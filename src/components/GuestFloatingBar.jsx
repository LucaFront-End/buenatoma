import React, { useState } from 'react';
import { Sparkles, Calendar, MessageCircle, Gift, ChevronUp, ChevronDown, Heart } from 'lucide-react';

export default function GuestFloatingBar({
  setTab,
  sessionTitle = 'esta hermosa sesión',
  clientName = 'tu conocido'
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const whatsappEventUrl = `https://wa.me/525592441070?text=${encodeURIComponent(`Hola Buena Toma! Estuve viendo la sesión de ${sessionTitle} y me encantaron las fotos. Me gustaría cotizar y agendar una sesión para mi evento.`)}`;
  
  const whatsappGiftCuadroUrl = `https://wa.me/525592441070?text=${encodeURIComponent(`Hola Buena Toma! Quiero regalarle un Cuadro Fino de gala a ${clientName} de su sesión de ${sessionTitle}. ¿Cómo podemos coordinarlo?`)}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        width: 'calc(100vw - 32px)',
        maxWidth: '850px',
        backgroundColor: 'rgba(18, 18, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 212, 2, 0.35)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255, 212, 2, 0.15)',
        overflow: 'hidden',
        animation: 'fadeIn 0.35s ease-out'
      }}
    >
      {/* Top Banner Tab with Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '0.65rem 1.4rem',
          backgroundColor: 'rgba(255, 212, 2, 0.1)',
          borderBottom: isExpanded ? '1px solid rgba(255, 212, 2, 0.2)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="#ffd402" />
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#ffd402', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ¿Te gustó esta sesión? Agenda la tuya o regala un cuadro
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a1a1aa' }}>
          <span style={{ fontSize: '0.7rem' }}>{isExpanded ? 'Ocultar' : 'Ver opciones'}</span>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Expanded Actions Content */}
      {isExpanded && (
        <div style={{
          padding: '1.1rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          
          {/* Action Row 1: Book your event */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ maxWidth: '420px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                📸 Agenda una sesión para tu propio evento
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#a1a1aa', lineHeight: '1.3' }}>
                Pedidas de mano, bodas, XV años, graduaciones y retratos de gala con entrega digital y física.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Button 1: Ver Servicios */}
              <button
                type="button"
                onClick={() => {
                  if (setTab) setTab('servicios');
                  else window.location.href = '/servicios';
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <Calendar size={14} />
                <span>Ver Servicios</span>
              </button>

              {/* Button 2: WhatsApp */}
              <a
                href={whatsappEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ffd402',
                  color: '#09090b',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(255, 212, 2, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 212, 2, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 212, 2, 0.25)';
                }}
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Action Row 2: Gift a Cuadro for the Hosts */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '520px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: '#f472b6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Gift size={15} />
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#d4d4d8', lineHeight: '1.3' }}>
                <strong style={{ color: '#ffffff' }}>Regálale a tu familiar o conocido uno de nuestros Cuadros:</strong>{' '}
                <span style={{ color: '#a1a1aa' }}>
                  Sorpréndelos obsequiándoles su foto favorita impresa en cuadro de gala de alta resolución.
                </span>
              </p>
            </div>

            <a
              href={whatsappGiftCuadroUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'rgba(255, 212, 2, 0.12)',
                border: '1px solid rgba(255, 212, 2, 0.4)',
                color: '#ffd402',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 212, 2, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 212, 2, 0.12)';
              }}
            >
              <Heart size={13} fill="#ffd402" />
              <span>Regalar Cuadro ($499 MXN)</span>
            </a>
          </div>

        </div>
      )}
    </div>
  );
}
