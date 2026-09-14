import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function FloatingWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: '¡Hola! Bienvenido a Buena Toma. 📸 ¿En qué podemos ayudarte hoy?',
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [quickReplies, setQuickReplies] = useState([
    { text: 'Ver paquetes de Cumpleaños', value: 'cumple' },
    { text: 'Cotizar sesión de XV Años', value: 'xv' },
    { text: '¿Cuentan con maquillaje?', value: 'makeup' },
    { text: 'Agendar Sesión Casual', value: 'casual' }
  ]);

  const handleWhatsappDirect = (messageText = "Hola me interesa información de su servicio de Fotografía") => {
    const phoneNumber = "5662914092";
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/52${phoneNumber}?text=${encoded}`, '_blank');
  };

  const handleOptionClick = (value, optionText) => {
    // Add user response bubble
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: optionText,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuickReplies([]); // Clear quick replies during response processing

    setTimeout(() => {
      let responseText = '';
      let waQuery = '';

      switch (value) {
        case 'cumple':
          responseText = '¡Excelente elección! Nuestros paquetes de cumpleaños inician desde $2,799 MXN e incluyen set decorado con globos, accesorios temáticos y archivos digitales de alta calidad. ¿Quieres cotizar una fecha en específico?';
          waQuery = 'Hola me interesa información del servicio de Paquetes de Cumpleaños';
          break;
        case 'xv':
          responseText = 'Las sesiones de XV años inician desde $4,000 MXN. Incluyen locaciones, vestuario, cambios de ropa, fotografías impresas y retoques profesionales de alta gama. ¿Quieres consultar fechas disponibles?';
          waQuery = 'Hola me interesa información del servicio de XV Años';
          break;
        case 'makeup':
          responseText = '¡Sí! Ofrecemos servicio adicional de Peinado y Maquillaje profesional en el estudio por $800 MXN en cualquiera de tus paquetes, garantizando un acabado perfecto para las cámaras.';
          waQuery = 'Hola me interesa información del servicio de Peinado y Maquillaje';
          break;
        case 'casual':
          responseText = 'Nuestras Sesiones Casuales de retrato (individual o en pareja) inician en $2,899 MXN. Ideal para retratar tu esencia de manera libre y natural en exteriores o en nuestro estudio.';
          waQuery = 'Hola me interesa información del servicio de Sesión Casual';
          break;
        default:
          responseText = '¡Claro! En Buena Toma ofrecemos servicios personalizados de fotografía. Te redireccionaré de inmediato con un especialista.';
          waQuery = 'Hola me interesa información de su servicio de Fotografía';
      }

      const agentMsg = {
        id: messages.length + 2,
        sender: 'agent',
        text: responseText,
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        cta: {
          label: 'Contactar en WhatsApp',
          text: waQuery
        }
      };

      setMessages(prev => [...prev, agentMsg]);
      
      // Restore quick replies with options to restart or ask other things
      setQuickReplies([
        { text: 'Ver otros servicios', value: 'other' },
        { text: 'Preguntar por maquillaje', value: 'makeup' }
      ]);
    }, 800);
  };

  return (
    <div 
      className="floating-widget-container"
      style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1200, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}
    >
      
      {/* Interactive Chat window */}
      {isChatOpen && (
        <div 
          className="floating-chat-window"
          style={{
            width: '360px',
            height: '460px',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.2rem',
            background: 'linear-gradient(135deg, var(--bg-input) 0%, var(--bg-color) 100%)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>Asistente Buena Toma</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>En línea • Respuesta inmediata</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="interactive"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  padding: '0.8rem 1rem',
                  borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.04)',
                  color: msg.sender === 'user' ? 'var(--bg-color)' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                }}>
                  {msg.text}
                </div>
                
                {msg.cta && (
                  <button
                    onClick={() => handleWhatsappDirect(msg.cta.text)}
                    className="interactive"
                    style={{
                      marginTop: '8px',
                      backgroundColor: 'var(--accent-green)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {msg.cta.label}
                  </button>
                )}

                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Replies Area */}
          {quickReplies.length > 0 && (
            <div style={{
              padding: '0.8rem 1.2rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.01)'
            }}>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(reply.value, reply.text)}
                  className="interactive"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(197, 168, 128, 0.4)',
                    color: 'var(--accent-gold)',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Bottom input simulation */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px',
            backgroundColor: 'var(--bg-input)'
          }}>
            <input 
              type="text" 
              placeholder="Escribe tu mensaje..."
              disabled
              style={{
                flex: 1,
                fontSize: '0.8rem',
                padding: '8px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(28, 27, 26, 0.02)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}
            />
            <button
              onClick={() => handleWhatsappDirect()}
              className="interactive"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-color)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Buttons layout (Vertical Stack) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        {/* Chat Widget Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="interactive floating-elem floating-btn-action"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-chat, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            position: 'relative'
          }}
          title={isChatOpen ? "Cerrar chat" : "Abrir chat en vivo"}
        >
          {isChatOpen ? <X size={26} /> : <MessageSquare size={26} />}
        </button>

        {/* WhatsApp Floating CTA */}
        <button
          onClick={() => handleWhatsappDirect()}
          className="interactive floating-elem floating-btn-action"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-green, #25D366)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          title="Contactar por WhatsApp"
        >
          {/* Custom SVG WhatsApp Logo */}
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.8) translateY(50px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .floating-elem:hover {
          animation: none !important;
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 12px 25px rgba(0,0,0,0.2) !important;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .floating-widget-container {
            bottom: 16px !important;
            right: 16px !important;
            gap: 10px !important;
          }
          .floating-btn-action {
            width: 48px !important;
            height: 48px !important;
          }
          .floating-btn-action svg {
            width: 22px !important;
            height: 22px !important;
          }
          .floating-chat-window {
            width: calc(100vw - 32px) !important;
            max-width: 360px !important;
            height: 68vh !important;
            max-height: 440px !important;
            right: 0 !important;
            bottom: 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
