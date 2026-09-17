import { createClient, ApiKeyStrategy, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_DB_PATH = path.resolve(__dirname, '..', 'scratch', 'orders-db.json');

function saveOrder(order) {
  try {
    const dir = path.dirname(ORDERS_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let orders = [];
    if (fs.existsSync(ORDERS_DB_PATH)) {
      orders = JSON.parse(fs.readFileSync(ORDERS_DB_PATH, 'utf-8'));
    }
    orders.unshift(order);
    fs.writeFileSync(ORDERS_DB_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Checkout] Order save warning:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      nombre = '',
      correo = '',
      telefono = '',
      tipoServicio = 'Sesión Fotográfica',
      sessionCode = 'BNTM-26001',
      tipoPago = 'fotos_extras', // 'anticipo' | 'fotos_extras' | 'cuadro_fine_art' | 'liquidacion'
      montoTotal = 0,
      montoACobrar = 0,
      cantidadExtras = 0,
      incluyeCuadro = false,
      tamanoCuadro = '16x24"',
      marcoCuadro = 'Madera Natural',
      desglose = '',
    } = req.body || {};

    const siteId = process.env.VITE_WIX_SITE_ID || '8370f33d-3514-4c2c-9c28-9b8fa1ee1537';
    const apiKey = process.env.VITE_WIX_API_KEY;
    const productId = process.env.VITE_WIX_ANTICIPO_PRODUCT_ID;
    const wixBaseDomain = process.env.VITE_WIX_BASE_DOMAIN || 'https://www.buenatoma.mx';

    const chargeAmount = Math.max(1, Math.round(Number(montoACobrar) || Number(montoTotal) || 1000));
    const formatPrice = (n) => `$${(n || 0).toLocaleString('es-MX')} MXN`;

    // Generate unique order ID
    const orderCode = `BNTM-ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    let productTitle = '';
    if (tipoPago === 'fotos_extras') {
      productTitle = `Fotos Extras (${cantidadExtras}) — ${nombre} (${sessionCode})`;
    } else if (tipoPago === 'cuadro_fine_art') {
      productTitle = `Cuadro Fine Art ${tamanoCuadro} (${marcoCuadro}) — ${nombre} (${sessionCode})`;
    } else if (tipoPago === 'anticipo') {
      productTitle = `Anticipo de Apartado — ${tipoServicio} (${nombre})`;
    } else {
      productTitle = `Liquidación de Sesión — ${tipoServicio} (${nombre})`;
    }

    let checkoutUrl = '';

    // If Wix Store Product ID and API Key are configured, generate official Wix Checkout
    if (apiKey && productId) {
      try {
        const { productsV3 } = await import('@wix/stores');
        const { checkout } = await import('@wix/ecom');

        const wixClient = createClient({
          modules: { items, productsV3, checkout },
          auth: ApiKeyStrategy({ siteId, apiKey }),
        });

        // 1. Update product price in catalog
        const chargeStr = String(chargeAmount);
        const currentProd = await wixClient.productsV3.getProduct(productId);
        if (currentProd) {
          await wixClient.productsV3.updateProduct(productId, {
            ...currentProd,
            name: productTitle,
            actualPriceRange: {
              minValue: { amount: chargeStr },
              maxValue: { amount: chargeStr },
            },
            variantsInfo: {
              variants: currentProd.variantsInfo.variants.map((v) => ({
                ...v,
                price: { actualPrice: { amount: chargeStr } },
              })),
            },
          });
        }

        // 2. Create official checkout session
        const session = await wixClient.checkout.createCheckout({
          channelType: 'WEB',
          lineItems: [
            {
              catalogReference: {
                appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e',
                catalogItemId: productId,
              },
              quantity: 1,
            },
          ],
        });

        if (session?._id) {
          const nameParts = (nombre || '').trim().split(' ');
          await wixClient.checkout.updateCheckout(session._id, {
            buyerInfo: { email: correo },
            billingInfo: {
              address: {
                firstName: nameParts[0] || 'Cliente',
                lastName: nameParts.slice(1).join(' ') || 'Buena Toma',
                phone: telefono || '+52 55 9244 1070',
                country: 'MX',
              },
            },
          });
          const urlRes = await wixClient.checkout.getCheckoutUrl(session._id);
          if (urlRes?.checkoutUrl) checkoutUrl = urlRes.checkoutUrl;
        }
      } catch (wixStoreErr) {
        console.warn('[Wix Checkout] Notice on live checkout API:', wixStoreErr.message);
      }
    }

    if (!checkoutUrl) {
      // Direct Wix checkout payment URL fallback
      checkoutUrl = `${wixBaseDomain}/checkout?orden=${orderCode}&monto=${chargeAmount}&servicio=${encodeURIComponent(tipoServicio)}`;
    }

    // Save order details to local orders db
    const orderRecord = {
      orderCode,
      sessionCode,
      nombre,
      correo,
      telefono,
      tipoPago,
      tipoServicio,
      montoCobrado: chargeAmount,
      productTitle,
      cantidadExtras,
      incluyeCuadro,
      tamanoCuadro,
      marcoCuadro,
      desglose,
      checkoutUrl,
      fecha: now,
      estado: 'Pendiente de pago',
    };
    saveOrder(orderRecord);

    // Send agency notification email via FormSubmit
    try {
      await fetch('https://formsubmit.co/ajax/contacto@buenatoma.mx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `📸 [Wix Checkout] Nuevo Pedido: ${productTitle} (${formatPrice(chargeAmount)})`,
          _template: 'table',
          _captcha: 'false',
          'Código de Orden': orderCode,
          'Código de Sesión': sessionCode,
          'Cliente': nombre,
          'Email': correo,
          'Teléfono / WhatsApp': telefono,
          'Concepto': productTitle,
          'Monto a Cobrar': formatPrice(chargeAmount),
          'Desglose': desglose || 'Pago procesado desde el Portal de Usuario de Buena Toma',
          'Fecha': new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
        }),
      });
    } catch (mailErr) {
      console.warn('[Checkout] Mail notification note:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      checkoutUrl: checkoutUrl,
      orderCode: orderCode,
      montoCobrado: chargeAmount,
      productTitle: productTitle,
      message: 'Redirigiendo a la pasarela de pago segura de Wix...',
    });
  } catch (error) {
    console.error('[Wix Checkout] Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error al procesar checkout' });
  }
}
