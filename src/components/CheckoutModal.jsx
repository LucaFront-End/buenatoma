import React, { useState } from 'react';
import { 
  X as LuX, 
  ShieldCheck as LuShieldCheck, 
  Sparkles as LuSparkles, 
  Check as LuCheck, 
  ArrowRight as LuArrowRight, 
  CreditCard as LuCreditCard, 
  Lock as LuLock 
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, initialData = {}, onCheckoutSuccess }) {
  if (!isOpen) return null;

  const [tipoPago, setTipoPago] = useState(initialData.tipoPago || 'fotos_extras'); // 'anticipo' | 'fotos_extras' | 'cuadro_fine_art' | 'liquidacion'
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [correo, setCorreo] = useState(initialData.correo || '');
  const [telefono, setTelefono] = useState(initialData.telefono || '');
  const [sessionCode, setSessionCode] = useState(initialData.sessionCode || 'BNTM-26001');
  
  // Specific extras
  const [cantidadExtras, setCantidadExtras] = useState(initialData.cantidadExtras || 4);
  const [incluyeCuadro, setIncluyeCuadro] = useState(initialData.incluyeCuadro || (tipoPago === 'cuadro_fine_art'));
  const [tamanoCuadro, setTamanoCuadro] = useState('16x24" Fine Art (40x60cm)');
  const [marcoCuadro, setMarcoCuadro] = useState('Madera Nogal Sólida');
  const [notas, setNotas] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  // Cost calculations
  const PRECIO_FOTO_EXTRA = 250;
  const PRECIO_CUADRO = 1850;
  const PRECIO_ANTICIPO = 1500;
  const PRECIO_LIQUIDACION = 3500;

  let totalAmount = 0;
  if (tipoPago === 'anticipo') {
    totalAmount = PRECIO_ANTICIPO;
  } else if (tipoPago === 'fotos_extras') {
    totalAmount = cantidadExtras * PRECIO_FOTO_EXTRA + (incluyeCuadro ? PRECIO_CUADRO : 0);
  } else if (tipoPago === 'cuadro_fine_art') {
    totalAmount = PRECIO_CUADRO;
  } else if (tipoPago === 'liquidacion') {
    totalAmount = PRECIO_LIQUIDACION + (cantidadExtras > 0 ? cantidadExtras * PRECIO_FOTO_EXTRA : 0);
  }

  const formatPrice = (n) => `$${(n || 0).toLocaleString('es-MX')} MXN`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setErrorMsg('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const desgloseItems = [];
    if (tipoPago === 'anticipo') desgloseItems.push(`Anticipo de Apartado de Sesión (${formatPrice(PRECIO_ANTICIPO)})`);
    if (tipoPago === 'fotos_extras') desgloseItems.push(`${cantidadExtras} Fotos Extras de Retoque (${formatPrice(cantidadExtras * PRECIO_FOTO_EXTRA)})`);
    if (incluyeCuadro || tipoPago === 'cuadro_fine_art') desgloseItems.push(`Cuadro Fine Art ${tamanoCuadro} - Marco ${marcoCuadro} (${formatPrice(PRECIO_CUADRO)})`);
    if (tipoPago === 'liquidacion') desgloseItems.push(`Liquidación Total de Sesión (${formatPrice(PRECIO_LIQUIDACION)})`);
    if (notas.trim()) desgloseItems.push(`Notas: ${notas.trim()}`);

    try {
      const res = await fetch('/api/wix-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          telefono: telefono.trim(),
          sessionCode: sessionCode.trim(),
          tipoServicio: initialData.tipoServicio || 'Sesión Fotográfica de Estudio',
          tipoPago,
          montoTotal: totalAmount,
          montoACobrar: totalAmount,
          cantidadExtras: Number(cantidadExtras) || 0,
          incluyeCuadro: Boolean(incluyeCuadro || tipoPago === 'cuadro_fine_art'),
          tamanoCuadro,
          marcoCuadro,
          desglose: desgloseItems.join(' | '),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al iniciar checkout.');
      }

      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        setRedirecting(true);
        if (onCheckoutSuccess) onCheckoutSuccess(data);
        
        // Immediate redirect to Wix Checkout
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1200);
      }
    } catch (err) {
      console.error('[Checkout] Error:', err);
      setErrorMsg(err.message || 'No se pudo conectar con la pasarela de pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#0d0d0f',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92vh',
        overflowY: 'auto',
        color: '#f3f4f6',
        padding: '2rem',
        position: 'relative',
        animation: 'fadeInScale 0.25s ease-out',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#cbd5e1',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          aria-label="Cerrar modal"
        >
          <LuX size={18} />
        </button>

        {redirecting ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold, #d4af37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--accent-gold, #d4af37)',
              animation: 'spin 1.5s linear infinite',
            }}>
              <LuCreditCard size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif, serif)', color: '#fff', marginBottom: '0.5rem' }}>
              Conectando con Wix Checkout Seguro...
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Te estamos redirigiendo a la pasarela de pago oficial protegida con cifrado SSL de 256 bits.
            </p>
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.8rem',
                  background: 'linear-gradient(135deg, #d4af37, #aa8010)',
                  color: '#000',
                  fontWeight: '700',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Hacer clic si no redirige automáticamente <LuArrowRight size={16} />
              </a>
            )}
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '100px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--accent-gold, #d4af37)',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
              }}>
                <LuShieldCheck size={14} /> Pasarela de Pago Oficial Wix
              </div>
              <h2 style={{
                fontSize: '1.6rem',
                fontFamily: 'var(--font-serif, serif)',
                color: '#ffffff',
                margin: '0 0 0.4rem 0',
                letterSpacing: '-0.01em',
              }}>
                Checkout & Extras Buena Toma
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                Elige tu concepto de pago para tu sesión fotográfica <strong style={{ color: '#fff' }}>{sessionCode}</strong>
              </p>
            </div>

            {errorMsg && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Concept Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold, #d4af37)', fontWeight: '700', marginBottom: '0.6rem' }}>
                  Selecciona el Concepto a Pagar
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {[
                    { id: 'fotos_extras', label: 'Fotos Extras', desc: `$${PRECIO_FOTO_EXTRA} MXN c/u` },
                    { id: 'cuadro_fine_art', label: 'Cuadro Fine Art', desc: '$1,850 MXN' },
                    { id: 'anticipo', label: 'Anticipo Sesión', desc: '$1,500 MXN' },
                    { id: 'liquidacion', label: 'Liquidación Total', desc: '$3,500 MXN' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setTipoPago(opt.id);
                        if (opt.id === 'cuadro_fine_art') setIncluyeCuadro(true);
                      }}
                      style={{
                        background: tipoPago === opt.id ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: tipoPago === opt.id ? '1px solid var(--accent-gold, #d4af37)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '0.8rem 0.9rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: tipoPago === opt.id ? '#ffffff' : '#cbd5e1',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {opt.label}
                        {tipoPago === opt.id && <LuCheck size={14} color="var(--accent-gold, #d4af37)" />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: tipoPago === opt.id ? 'var(--accent-gold, #d4af37)' : '#94a3b8', marginTop: '0.2rem' }}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Extras Options */}
              {tipoPago === 'fotos_extras' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Fotos Extras Seleccionadas:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setCantidadExtras(Math.max(1, cantidadExtras - 1))}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#26262a', border: '1px solid #404044', color: '#fff', cursor: 'pointer' }}
                      >-</button>
                      <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center', color: 'var(--accent-gold, #d4af37)' }}>
                        {cantidadExtras}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidadExtras(cantidadExtras + 1)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#26262a', border: '1px solid #404044', color: '#fff', cursor: 'pointer' }}
                      >+</button>
                    </div>
                  </div>

                  {/* Optional Cuadro Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <input
                      type="checkbox"
                      checked={incluyeCuadro}
                      onChange={(e) => setIncluyeCuadro(e.target.checked)}
                      style={{ accentColor: 'var(--accent-gold, #d4af37)' }}
                    />
                    <span>Agregar Cuadro Fine Art con Marco (+$1,850 MXN)</span>
                  </label>
                </div>
              )}

              {/* Cuadro details if selected */}
              {(incluyeCuadro || tipoPago === 'cuadro_fine_art') && (
                <div style={{
                  background: 'rgba(212, 175, 55, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Tamaño Cuadro</label>
                    <select
                      value={tamanoCuadro}
                      onChange={(e) => setTamanoCuadro(e.target.value)}
                      style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    >
                      <option value='16x24" Fine Art (40x60cm)'>16x24" Fine Art (40x60cm)</option>
                      <option value='20x30" Fine Art (50x75cm)'>20x30" Fine Art (50x75cm)</option>
                      <option value='24x36" Fine Art (60x90cm)'>24x36" Fine Art (60x90cm)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Acabado del Marco</label>
                    <select
                      value={marcoCuadro}
                      onChange={(e) => setMarcoCuadro(e.target.value)}
                      style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    >
                      <option value="Madera Nogal Sólida">Madera Nogal Sólida</option>
                      <option value="Madera Natural Roble">Madera Natural Roble</option>
                      <option value="Negro Mate Minimalista">Negro Mate Minimalista</option>
                      <option value="Blanco Puro Galería">Blanco Puro Galería</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Client Contact Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Sofía Oramas"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.65rem 0.8rem', borderRadius: '8px', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="sofia@gmail.com"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.65rem 0.8rem', borderRadius: '8px', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>WhatsApp / Teléfono</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="55 1234 5678"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.65rem 0.8rem', borderRadius: '8px', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Código de Sesión</label>
                  <input
                    type="text"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    placeholder="BNTM-26001"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.65rem 0.8rem', borderRadius: '8px', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div style={{
                background: '#141417',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', display: 'block' }}>
                    Total a Pagar
                  </span>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--accent-gold, #d4af37)', fontFamily: 'var(--font-serif, serif)' }}>
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', color: '#4ade80', fontWeight: '600' }}>
                    <LuLock size={12} /> Cifrado SSL 256-bit
                  </div>
                  <div>Recibo oficial automático</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #d4af37, #aa8010)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontWeight: '800',
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1,
                  marginTop: '0.5rem',
                }}
              >
                {loading ? 'Generando sesión de checkout...' : (
                  <>Pagar en Pasarela Wix ({formatPrice(totalAmount)}) <LuArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
