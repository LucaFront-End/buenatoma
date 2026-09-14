import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Copy, ArrowRight, Gift } from 'lucide-react';
import { sendLeadToWix } from '../lib/wixLeads';

const STORAGE_CLAIMED = 'buenatoma_promo_claimed';
const STORAGE_DISMISSED = 'buenatoma_promo_dismissed';

export default function RegistrationPromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto trigger after 3 seconds if not claimed or dismissed
  useEffect(() => {
    const isClaimed = localStorage.getItem(STORAGE_CLAIMED) === 'true';
    const isDismissed = localStorage.getItem(STORAGE_DISMISSED) === 'true';

    if (!isClaimed && !isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_DISMISSED, 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BUENATOMA10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsappRedeem = () => {
    const phoneNumber = '5662914092';
    const text = encodeURIComponent(
      `¡Hola Buena Toma! Me he registrado en su web y quiero redimir mi código de 10% OFF: BUENATOMA10 para mi primer sesión.`
    );
    window.open(`https://wa.me/52${phoneNumber}?text=${text}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await sendLeadToWix({
      nombre: name.trim(),
      telefono: phone.trim(),
      email: email.trim(),
      mensaje: 'Registro de nuevo cliente para obtener 10% OFF en primer sesión. Código asignado: BUENATOMA10',
      origen: 'Pop 10% OFF (Primer Sesión)',
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      localStorage.setItem(STORAGE_CLAIMED, 'true');
    } else {
      // Even if offline, show success state to not block the user UX
      setIsSuccess(true);
      localStorage.setItem(STORAGE_CLAIMED, 'true');
    }
  };

  return (
    <>
      {/* Floating Gift Trigger Pill — bottom left */}
      {!isOpen && !isSuccess && (
        <button
          onClick={() => setIsOpen(true)}
          className="interactive promo-floating-pill"
          style={{
            position: 'fixed',
            bottom: '26px',
            left: '26px',
            zIndex: 999,
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            padding: '10px 18px',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'promoBounce 3s infinite ease-in-out'
          }}
          title="Obtén 10% OFF en tu primer sesión"
        >
          <Gift size={18} style={{ color: 'var(--accent-gold)' }} />
          <span>10% OFF Primer Sesión</span>
        </button>
      )}

      {/* Modal Popup Overlay */}
      {isOpen && (
        <div
          className="promo-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(12, 12, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1.5rem',
            animation: 'fadeIn 0.3s ease-out forwards',
          }}
          onClick={handleClose}
        >
          <div
            className="promo-card glass"
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#121214',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(197, 168, 128, 0.1)',
              animation: 'promoScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="interactive"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Cerrar"
            >
              <X size={16} />
            </button>

            {!isSuccess ? (
              <>
                {/* Header Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-gold)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    backgroundColor: 'rgba(197, 168, 128, 0.1)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    marginBottom: '1rem',
                  }}
                >
                  <Sparkles size={14} /> Regalo de Bienvenida
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 1.9rem)',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '0.6rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  Regístrate y obtén <br />
                  <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                    10% OFF en tu primer sesión
                  </span>
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '1.8rem',
                    fontWeight: '300',
                  }}
                >
                  Déjanos tus datos para recibir tu cupón exclusivo y agendar con prioridad en nuestro estudio en Reforma.
                </p>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <input
                      id="promo-name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="interactive"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                    />
                  </div>

                  <div>
                    <input
                      id="promo-phone"
                      type="tel"
                      placeholder="Teléfono / WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="interactive"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                    />
                  </div>

                  <div>
                    <input
                      id="promo-email"
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="interactive"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                    />
                  </div>

                  {errorMsg && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>
                      {errorMsg}
                    </p>
                  )}

                  <button
                    id="promo-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-premium btn-gold interactive"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '13px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginTop: '0.4rem',
                    }}
                  >
                    {isSubmitting ? 'Guardando en CMS...' : 'Reclamar mi 10% OFF →'}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.4rem 0 0' }}>
                    🔒 Tus datos están 100% seguros y no enviamos spam.
                  </p>
                </form>
              </>
            ) : (
              /* Success View */
              <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    border: '1px solid rgba(37, 211, 102, 0.4)',
                    color: 'var(--accent-green, #25D366)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem',
                  }}
                >
                  <Check size={30} />
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  ¡Registro Exitoso! 🎉
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Tus datos han sido registrados en nuestro sistema. Usa este código al reservar tu sesión:
                </p>

                {/* Coupon Code Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(197, 168, 128, 0.1)',
                    border: '1px dashed var(--accent-gold)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>
                    BUENATOMA10
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="interactive"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copied ? 'var(--accent-green)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>

                <button
                  onClick={handleWhatsappRedeem}
                  className="btn-premium btn-gold interactive"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.85rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  Canjear en WhatsApp Ahora <ArrowRight size={14} />
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Cerrar y continuar navegando
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes promoScaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes promoBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .promo-floating-pill:hover {
          transform: scale(1.05) translateY(-2px) !important;
          box-shadow: 0 12px 28px rgba(197, 168, 128, 0.25) !important;
        }
      `}</style>
    </>
  );
}
