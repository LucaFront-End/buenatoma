import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, ArrowRight } from 'lucide-react';

export default function Navbar({ currentTab, setTab, cartCount, toggleCart, togglePortal }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Inicio', id: 'home' },
    { name: 'Paquetes', id: 'packages' },
    { name: 'Portafolio', id: 'portfolio' },
    { name: 'Comunidad', id: 'community' },
    { name: 'Contacto', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    setTab(id);
    setIsOpen(false);
  };

  const handleWhatsappCotizar = () => {
    const phoneNumber = "5662914092";
    const text = encodeURIComponent("Hola me interesa información de su servicio de Fotografía");
    window.open(`https://wa.me/52${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      <header className="glass" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '75px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setTab('home')} 
          className="interactive"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            height: '100%',
            width: '180px' // Reserved click width area
          }}
        >
          <img 
            src="/images/logos/LOGO-01.png" 
            alt="Buena Toma Logo" 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '0',
              transform: 'translateY(-50%)',
              height: '120px', 
              width: 'auto', 
              objectFit: 'contain',
              zIndex: 10
            }}
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-only">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="interactive"
              style={{
                background: 'none',
                border: 'none',
                color: currentTab === item.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontWeight: currentTab === item.id ? '600' : '400',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'color 0.3s'
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* User Button */}
          <button 
            onClick={togglePortal}
            className="interactive"
            title="Mi Portal de Cliente"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              transition: 'color 0.3s'
            }}
          >
            <User size={20} />
          </button>

          {/* Cart Button */}
          <button 
            onClick={toggleCart}
            className="interactive"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '0.5rem',
              transition: 'color 0.3s'
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--accent-gold)',
                color: 'var(--bg-color)',
                fontSize: '0.7rem',
                fontWeight: '700',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Quote Button (Desktop) */}
          <button 
            onClick={handleWhatsappCotizar}
            className="btn-premium btn-gold interactive desktop-only"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.75rem' }}
          >
            Cotizar Ahora <ArrowRight size={14} />
          </button>

          {/* Fullscreen Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="interactive"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* CSS adjustments to handle responsive visibility inline */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>

      {/* Fullscreen Overlay Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 11, 12, 0.98)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 10vw',
          animation: 'fadeIn 0.3s ease-out forwards'
        }}>
          {/* Decorative floating blurred circles */}
          <div style={{
            position: 'absolute',
            width: '30vw',
            height: '30vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197,168,128,0.1) 0%, rgba(0,0,0,0) 70%)',
            top: '10%',
            right: '10%',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 70%)',
            bottom: '5%',
            left: '5%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />

          {/* Animated Menu Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 2 }}>
            {menuItems.map((item, idx) => (
              <div 
                key={item.id} 
                style={{
                  animation: `revealText 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s forwards`,
                  opacity: 0,
                  transform: 'translateY(30px)'
                }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className="menu-link interactive"
                >
                  <span className="menu-number">0{idx + 1}</span>
                  {item.name}
                </a>
              </div>
            ))}
          </div>

          {/* Social Links & Mobile Call to Action in Menu */}
          <div style={{
            marginTop: '4rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            zIndex: 2
          }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Contacto
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                566 291 4092
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                hola@buenatoma.mx
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="interactive" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="interactive" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Instagram
              </a>
              <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="interactive" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Vimeo
              </a>
            </div>
            
            <button 
              onClick={handleWhatsappCotizar}
              className="btn-premium btn-gold interactive"
              style={{ width: '100%', maxWidth: '280px', textAlign: 'center', justifyContent: 'center' }}
            >
              Cotizar por WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
