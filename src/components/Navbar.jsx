import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, ArrowRight, ChevronDown } from 'lucide-react';
import { sendLeadToWix } from '../lib/wixLeads';

export default function Navbar({ currentTab, setTab, cartCount, toggleCart, togglePortal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ensure mobile menu closes automatically when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const servicesList = [
    { name: 'Cumpleaños 🎂', id: 'service-cumple', price: '$2,799' },
    { name: 'XV Años 👑', id: 'service-xv', price: '$4,000' },
    { name: 'Maternidad 🍼', id: 'service-maternidad', price: '$3,000' },
    { name: 'Sesión Casual ⚡', id: 'service-casual', price: '$2,899' },
    { name: 'Graduación 🎓', id: 'service-graduacion', price: '$3,799' },
    { name: 'Parejas 💖', id: 'service-parejas', price: '$2,999' }
  ];

  const menuItems = [
    { name: 'Inicio', id: 'home' },
    { name: 'Servicios', id: 'services', isDropdown: true },
    { name: 'Cotizador', id: 'cotizador' },
    { name: 'Portafolio', id: 'portfolio' },
    { name: 'Comunidad', id: 'community' },
    { name: 'Contacto', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    setTab(id);
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const handleWhatsappCotizar = () => {
    sendLeadToWix({
      origen: 'Navbar CTA (Cotizar WhatsApp)',
      mensaje: 'Click en botón Cotizar por WhatsApp de la barra de navegación',
      title: 'Consulta WhatsApp Navbar'
    });
    const phoneNumber = "5662914092";
    const text = encodeURIComponent("Hola me interesa información de su servicio de Fotografía en Reforma 284, CDMX");
    window.open(`https://wa.me/52${phoneNumber}?text=${text}`, '_blank');
  };

  const isServiceActive = currentTab === 'services' || currentTab === 'servicios' || currentTab.startsWith('service-');

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
          className="interactive nav-logo-brand"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            height: '100%',
            width: '180px'
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
          {menuItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div 
                  key={item.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNavClick('services')}
                    className="interactive"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isServiceActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      fontWeight: isServiceActive ? '600' : '400',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'color 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Servicios <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div 
                      className="glass"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingTop: '0.8rem',
                        width: '260px',
                        zIndex: 1200,
                        animation: 'fadeIn 0.2s ease'
                      }}
                    >
                      <div style={{
                        backgroundColor: 'var(--bg-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '0.6rem 0',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                      }}>
                        <div style={{
                          padding: '0.4rem 1.2rem',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          borderBottom: '1px solid var(--border-color)',
                          marginBottom: '0.4rem'
                        }}>
                          Páginas de Servicio
                        </div>

                        {servicesList.map((svc) => (
                          <button
                            key={svc.id}
                            onClick={() => handleNavClick(svc.id)}
                            className="interactive"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                              padding: '0.65rem 1.2rem',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: currentTab === svc.id ? 'var(--accent-gold)' : 'var(--text-primary)',
                              fontSize: '0.88rem',
                              fontWeight: currentTab === svc.id ? '600' : '400',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span>{svc.name}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{svc.price}</span>
                          </button>
                        ))}

                        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.4rem', paddingTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button
                            onClick={() => handleNavClick('services')}
                            className="interactive"
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '0.5rem 1.2rem',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: 'var(--accent-gold)',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Ver catálogo de servicios (/servicios) →
                          </button>
                          <button
                            onClick={() => handleNavClick('cotizador')}
                            className="interactive"
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '0.5rem 1.2rem',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: 'var(--text-secondary)',
                              fontSize: '0.82rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Cotizador de paquetes →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const isActive = currentTab === item.id || (item.id === 'cotizador' && (currentTab === 'cotizador' || currentTab === 'packages'));

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="interactive"
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'color 0.3s',
                  cursor: 'pointer'
                }}
              >
                {item.name}
              </button>
            );
          })}
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
              transition: 'color 0.3s',
              cursor: 'pointer'
            }}
          >
            <User size={20} />
          </button>

          {/* Cart Button */}
          <button 
            onClick={toggleCart}
            className="interactive"
            title="Ver carrito de reservas"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '0.5rem',
              transition: 'color 0.3s',
              cursor: 'pointer'
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

          {/* Fullscreen Menu Trigger (Mobile Only) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="interactive nav-hamburger-btn"
            aria-label="Abrir menú móvil"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* CSS adjustments to handle responsive visibility inline */}
      <style>{`
        .nav-hamburger-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-hamburger-btn {
            display: flex !important;
          }
          .desktop-only {
            display: none !important;
          }
          header.glass {
            padding: 0 1.25rem !important;
            height: 68px !important;
          }
          .nav-logo-brand img {
            height: 85px !important;
          }
        }
        @media (min-width: 769px) {
          .nav-mobile-overlay-menu {
            display: none !important;
          }
        }
      `}</style>

      {/* Fullscreen Overlay Menu */}
      {isOpen && (
        <div 
          className="nav-mobile-overlay-menu"
          style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(12, 12, 14, 0.99)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '5.5rem 8vw 3rem 8vw',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'fadeIn 0.25s ease-out forwards'
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

          {/* Animated Menu Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', zIndex: 2 }}>
            <div>
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className="menu-link interactive"
              >
                <span className="menu-number">01</span>
                Inicio
              </a>
            </div>

            {/* Mobile Services Accordion */}
            <div>
              <div 
                className="menu-link interactive"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div 
                  onClick={() => handleNavClick('services')}
                  style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center' }}
                >
                  <span className="menu-number">02</span>
                  Servicios
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  aria-label="Desplegar servicios"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronDown size={22} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--accent-gold)' }} />
                </button>
              </div>

              {/* Submenu for individual services */}
              {dropdownOpen && (
                <div style={{
                  paddingLeft: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  marginTop: '0.8rem',
                  marginBottom: '0.8rem',
                  borderLeft: '2px solid var(--accent-gold)'
                }}>
                  <a
                    href="/servicios"
                    onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}
                    className="interactive"
                    style={{
                      color: currentTab === 'services' ? 'var(--accent-gold)' : '#ffffff',
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    ✨ Catálogo de Servicios (/servicios)
                  </a>
                  {servicesList.map((svc) => (
                    <a
                      key={svc.id}
                      href={`/servicio-${svc.id.replace('service-', '')}`}
                      onClick={(e) => { e.preventDefault(); handleNavClick(svc.id); }}
                      className="interactive"
                      style={{
                        color: currentTab === svc.id ? 'var(--accent-gold)' : '#ffffff',
                        fontSize: '1.1rem',
                        textDecoration: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{svc.name}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{svc.price}</span>
                    </a>
                  ))}
                  <a
                    href="/cotizador"
                    onClick={(e) => { e.preventDefault(); handleNavClick('cotizador'); }}
                    style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', textDecoration: 'none', marginTop: '0.4rem', fontWeight: '600' }}
                  >
                    Cotizador interactivo de paquetes →
                  </a>
                </div>
              )}
            </div>

            <div>
              <a
                href="#cotizador"
                onClick={(e) => { e.preventDefault(); handleNavClick('cotizador'); }}
                className="menu-link interactive"
              >
                <span className="menu-number">03</span>
                Cotizador
              </a>
            </div>

            <div>
              <a
                href="#portfolio"
                onClick={(e) => { e.preventDefault(); handleNavClick('portfolio'); }}
                className="menu-link interactive"
              >
                <span className="menu-number">04</span>
                Portafolio
              </a>
            </div>

            <div>
              <a
                href="#community"
                onClick={(e) => { e.preventDefault(); handleNavClick('community'); }}
                className="menu-link interactive"
              >
                <span className="menu-number">05</span>
                Comunidad
              </a>
            </div>

            <div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                className="menu-link interactive"
              >
                <span className="menu-number">06</span>
                Contacto
              </a>
            </div>
          </div>

          {/* Social Links & Mobile Call to Action in Menu */}
          <div style={{
            marginTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            zIndex: 2
          }}>
            <div>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700' }}>
                Estudio CDMX
              </p>
              <p style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '0.35rem', fontFamily: 'var(--font-serif)', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Paseo de la Reforma 284, CDMX
              </p>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: '600' }}>
                566 291 4092 (WhatsApp)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="https://www.facebook.com/buenatoma.mx" target="_blank" rel="noreferrer" className="interactive" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Facebook
              </a>
              <a href="http://instagram.com/buenatoma.mx" target="_blank" rel="noreferrer" className="interactive" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Instagram
              </a>
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: '600' }}>
                @buenatoma.mx
              </span>
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
