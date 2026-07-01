import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';

export default function Cart({ isOpen, toggleCart, cartItems, removeFromCart, clearCart }) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleWhatsappCheckout = () => {
    if (cartItems.length === 0) return;

    const phoneNumber = "5662914092";
    
    // Custom formatted text list of packages and complements
    let text = "Hola me interesa información de su servicio de Fotografía. He configurado una sesión en su página web:\n\n";
    
    cartItems.forEach((item, idx) => {
      text += `${idx + 1}. **${item.name}**\n`;
      if (item.category) text += `   Categoría: ${item.category}\n`;
      if (item.options && item.options.length > 0) {
        text += `   Detalles: ${item.options.join(', ')}\n`;
      }
      text += `   Precio: $${item.price.toLocaleString('es-MX')} MXN\n\n`;
    });
    
    text += `**Total estimado: $${total.toLocaleString('es-MX')} MXN**\n\n`;
    text += "¿Tienen disponibilidad de fechas?";

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/52${phoneNumber}?text=${encodedText}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1100,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out forwards'
    }} onClick={toggleCart}>
      
      {/* Sidebar Panel */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        height: '100%',
        backgroundColor: 'var(--bg-color)',
        borderLeft: '1px solid var(--border-color)',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        animation: 'slideIn 0.4s var(--ease-custom)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Tu <span style={{ color: 'var(--accent-gold)' }}>Selección</span>
          </h2>
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
              padding: '0.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Items list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              color: 'var(--text-secondary)'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem', fontStyle: 'italic' }}>Tu carrito está vacío.</p>
              <button 
                onClick={toggleCart}
                className="btn-premium interactive"
                style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}
              >
                Explorar Servicios
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1.2rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--accent-gold)',
                    letterSpacing: '0.1em',
                    marginBottom: '0.2rem'
                  }}>
                    {item.type === 'package' ? 'Paquete Principal' : 'Complemento'}
                  </p>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: '500' }}>
                    {item.name}
                  </h3>
                  {item.category && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      Categoría: {item.category}
                    </p>
                  )}
                  {item.options && item.options.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                      {item.options.map((opt, i) => (
                        <span key={i} style={{
                          fontSize: '0.7rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.2rem 0.5rem',
                          color: 'var(--text-secondary)',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginTop: '0.8rem'
                  }}>
                    ${item.price.toLocaleString('es-MX')} MXN
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="interactive"
                  title="Eliminar item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    alignSelf: 'flex-start',
                    padding: '0.4rem',
                    transition: 'color 0.2s',
                    marginTop: '0.2rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Subtotal Estimado:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                ${total.toLocaleString('es-MX')} MXN
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={handleWhatsappCheckout}
                className="btn-premium btn-gold interactive"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '1rem',
                  fontSize: '0.85rem'
                }}
              >
                Cotizar Vía WhatsApp <ArrowRight size={16} />
              </button>
              <button
                onClick={clearCart}
                className="interactive"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.5rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Vaciar Selección
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
