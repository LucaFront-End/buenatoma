import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer({ setTab }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleWhatsappCall = () => {
    const phoneNumber = "5662914092";
    const encoded = encodeURIComponent("Hola me interesa información de su servicio de Fotografía");
    window.open(`https://wa.me/52${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <footer className="glass" style={{
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '5rem 4rem 3rem 4rem',
      backgroundColor: '#0c0c0e',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '4rem',
        marginBottom: '4rem'
      }}>
        {/* Left Column: Brand and Bio */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <img 
              src="/images/logos/LOGO-01.png" 
              alt="Buena Toma Logo" 
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: '1.7',
            marginBottom: '2rem'
          }}>
            Estudio de fotografía profesional dedicado a capturar momentos espontáneos y convertirlos en piezas de arte atemporales. Creemos en la asimetría, la luz natural y las historias reales.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="https://facebook.com/asimetrico.mx" 
              target="_blank" 
              rel="noreferrer"
              className="interactive"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/asimetrico.mx" 
              target="_blank" 
              rel="noreferrer"
              className="interactive"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Center Column: Quick Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Explorar</h4>
          <a href="#home" onClick={(e) => { e.preventDefault(); setTab('home'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="interactive">Inicio</a>
          <a href="#packages" onClick={(e) => { e.preventDefault(); setTab('packages'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="interactive">Paquetes de Fotos</a>
          <a href="#portfolio" onClick={(e) => { e.preventDefault(); setTab('portfolio'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="interactive">Portafolio</a>
          <a href="#community" onClick={(e) => { e.preventDefault(); setTab('community'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="interactive">Comunidad</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setTab('contact'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="interactive">Contacto</a>
        </div>

        {/* Center-Right: Studio Location Info */}
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Estudio</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Plaza Macayo, Calle Macayo #5<br />
                Col. El Recreo, Villahermosa,<br />
                Tabasco, México
              </p>
            </div>
            <div 
              style={{ display: 'flex', gap: '12px', alignItems: 'center' }} 
              onClick={() => {
                window.open('https://wa.me/525662914092?text=Hola%20me%20interesa%20informaci%C3%B3n%20de%20su%20servicio%20de%20Fotograf%C3%ADa', '_blank');
              }}
              className="interactive"
            >
              <Phone size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                566 291 4092 (WhatsApp)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Mail size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                hola@buenatoma.mx
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Newsletter Subscription */}
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Suscríbete</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Recibe promociones mensuales, guías de estilo para tu shoot y notificaciones de nuevos sets fotográficos.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1rem 3.5rem 1rem 1.2rem',
                  borderRadius: '0',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                type="submit"
                className="interactive"
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                  bottom: '5px',
                  width: '40px',
                  backgroundColor: 'var(--accent-gold)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-color)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-gold-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-gold)'}
              >
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(197, 168, 128, 0.05)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              ¡Gracias por suscribirte a Buena Toma! 📸
            </div>
          )}
        </div>
      </div>

      {/* Footer Bottom copyright bar */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        <p>© {new Date().getFullYear()} Buena Toma Fotografía. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="interactive">Aviso de Privacidad</a>
          <a href="#terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="interactive">Términos del Servicio</a>
        </div>
      </div>
    </footer>
  );
}
