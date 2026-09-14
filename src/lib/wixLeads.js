import { createClient, OAuthStrategy, EMPTY_TOKENS } from '@wix/sdk';
import { items } from '@wix/data';
import { WIX_CLIENT_ID, TOKEN_KEY } from './wixClient.js';

let memoryTokens = null;

// Token storage synchronized with localStorage and in-memory fallback
function createTokenStorage() {
  return {
    getTokens() {
      if (typeof window === 'undefined') return memoryTokens || EMPTY_TOKENS;
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
            return parsed;
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
      return memoryTokens || EMPTY_TOKENS;
    },
    setTokens(tokens) {
      memoryTokens = tokens;
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      } catch (e) {
        console.warn('[Wix Leads] Error guardando tokens en localStorage:', e);
      }
    },
  };
}

let leadsClient = null;

async function getClient() {
  if (leadsClient) return leadsClient;

  leadsClient = createClient({
    modules: { items },
    auth: OAuthStrategy({
      clientId: WIX_CLIENT_ID,
      tokenStorage: createTokenStorage()
    }),
  });

  const tokens = await leadsClient.auth.getTokens();
  const hasTokens = tokens?.accessToken?.value && tokens?.refreshToken?.value;
  if (!hasTokens) {
    try {
      const visitorTokens = await leadsClient.auth.generateVisitorTokens();
      await leadsClient.auth.setTokens(visitorTokens);
      console.log('[Wix Leads] Visitor tokens generados y asignados exitosamente.');
    } catch (err) {
      console.warn('[Wix Leads] Nota generando visitor token:', err?.message || err);
    }
  }

  return leadsClient;
}

/**
 * Registra un contacto o lead en la colección "Contacto" de Wix CMS.
 *
 * @param {Object} params
 * @param {string} [params.nombre]   - Nombre del cliente
 * @param {string} [params.email]    - Correo electrónico
 * @param {string} [params.telefono] - Teléfono / WhatsApp
 * @param {string} [params.mensaje]  - Mensaje, notas o detalles del servicio/paquete
 * @param {string} [params.origen]   - Origen explícito de la captura
 * @param {string} [params.title]    - Título del registro
 * @returns {Promise<{success: boolean, item?: any, error?: string}>}
 */
export async function sendLeadToWix({
  nombre = '',
  email = '',
  telefono = '',
  mensaje = '',
  origen = 'Web Buena Toma',
  title = ''
}) {
  const cleanTitle = title || `${nombre.trim() || email.trim() || 'Nuevo Lead'} — [${origen.trim()}]`;

  const payload = {
    title: cleanTitle,
    nombre: (nombre || '').trim(),
    email: (email || '').trim(),
    telefono: (telefono || '').trim(),
    mensaje: (mensaje || '').trim(),
    origen: (origen || 'Web Buena Toma').trim()
  };

  try {
    const client = await getClient();
    console.log('[Wix Leads] Insertando contacto en CMS "Contacto":', payload);

    const res = await client.items.insert('Contacto', payload);
    console.log('[Wix Leads] ✅ Contacto guardado con éxito en CMS:', res);
    return { success: true, item: res };
  } catch (err) {
    console.warn(`[Wix Leads] Primer intento falló (${err?.message || err}), renovando visitor token...`);
    
    // Auto-retry with fresh visitor token in case current session expired
    try {
      const client = await getClient();
      const freshTokens = await client.auth.generateVisitorTokens();
      await client.auth.setTokens(freshTokens);
      const retryRes = await client.items.insert('Contacto', payload);
      console.log('[Wix Leads] ✅ Reintento exitoso, contacto guardado en CMS:', retryRes);
      return { success: true, item: retryRes };
    } catch (retryErr) {
      console.error(`[Wix Leads] ❌ Error definitivo enviando a CMS Contacto (origen: ${origen}):`, retryErr?.message || retryErr);
      return { success: false, error: retryErr?.message || retryErr };
    }
  }
}
