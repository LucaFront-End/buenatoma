import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Sparkles, Camera } from 'lucide-react';

export default function PasswordGate({ 
  sessionCode = 'BNTM-26001', 
  sessionTitle = 'Galería Privada', 
  clientName = '', 
  correctPassword = '', 
  onUnlock 
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const storageKey = `buenatoma_gallery_auth_${(sessionCode || 'default').toLowerCase().trim()}`;

  // Check if session was previously unlocked
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(storageKey);
      if (savedAuth === 'unlocked') {
        onUnlock();
      }
    } catch {
      // ignore localStorage errors
    }
  }, [storageKey, onUnlock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const input = password.trim();
      const target = (correctPassword || '').trim();

      // If no password is set in CMS, accept session code or any password
      const isMatch = !target || 
        input.toLowerCase() === target.toLowerCase() || 
        input.toLowerCase() === (sessionCode || '').toLowerCase().trim();

      if (isMatch) {
        try {
          localStorage.setItem(storageKey, 'unlocked');
        } catch {}
        onUnlock();
      } else {
        setError('Contraseña incorrecta. Verifica con tu fotógrafo de Buena Toma.');
      }
      setLoading(false);
    }, 350);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: '#09090b',
      backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(255, 212, 2, 0.08) 0%, rgba(9, 9, 11, 0.98) 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      {/* Ambient background blur glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(255, 212, 2, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'rgba(18, 18, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 212, 2, 0.25)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 212, 2, 0.1)',
        textAlign: 'center'
      }}>
        
        {/* Brand Header */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.9rem',
            borderRadius: '50px',
            backgroundColor: 'rgba(255, 212, 2, 0.12)',
            border: '1px solid rgba(255, 212, 2, 0.3)',
            color: '#ffd402',
            fontSize: '0.72rem',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.2rem'
          }}>
            <Sparkles size={13} color="#ffd402" />
            <span>Portal Privado de Galería</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.8rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 212, 2, 0.1)',
              border: '1px solid rgba(255, 212, 2, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffd402'
            }}>
              <Camera size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#a1a1aa', fontWeight: '700', display: 'block' }}>
                Estudio Fotográfico
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>
                BUENA <span style={{ color: '#ffd402' }}>TOMA</span>
              </span>
            </div>
          </div>

          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '300',
            fontFamily: 'serif, Georgia',
            color: '#ffffff',
            margin: '0.6rem 0 0.2rem 0'
          }}>
            {sessionTitle || 'Pedida de Mano'}
          </h2>

          <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0 }}>
            Sesión: <strong style={{ color: '#ffd402' }}>{sessionCode}</strong> {clientName ? `· ${clientName}` : ''}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#d4d4d8',
              display: 'block',
              marginBottom: '0.45rem'
            }}>
              Contraseña de Acceso
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa la contraseña..."
                autoFocus
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(24, 24, 27, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  padding: '0.9rem 2.8rem 0.9rem 1.1rem',
                  fontSize: '0.92rem',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ffd402';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 212, 2, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '0.7rem 1rem',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left'
            }}>
              <Lock size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              backgroundColor: '#ffd402',
              color: '#09090b',
              border: 'none',
              borderRadius: '14px',
              padding: '0.95rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              letterSpacing: '0.04em',
              cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !password.trim() ? 0.6 : 1,
              boxShadow: '0 10px 25px rgba(255, 212, 2, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading && password.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 14px 30px rgba(255, 212, 2, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 212, 2, 0.25)';
            }}
          >
            {loading ? (
              <span>Verificando...</span>
            ) : (
              <>
                <span>Desbloquear Galería</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* WhatsApp Recovery */}
        <div style={{
          marginTop: '1.8rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.78rem',
          color: '#71717a'
        }}>
          ¿No tienes tu contraseña? Pídela a tu fotógrafo asignado en{' '}
          <a
            href="https://wa.me/525592441070?text=Hola%20Buena%20Toma,%20necesito%20la%20contrase%C3%B1a%20de%20mi%20galer%C3%ADa"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffd402', textDecoration: 'none', fontWeight: '600' }}
          >
            WhatsApp Buena Toma
          </a>
        </div>

      </div>
    </div>
  );
}
