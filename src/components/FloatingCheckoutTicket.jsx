import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const EXTRA_PHOTO_PRICE = 150; // $150 MXN per individual extra photo
export const CUADRO_UPSELL_PRICE = 499; // $499 MXN includes 6 extra photos
export const CUADRO_INCLUDED_EXTRAS = 6;

export default function FloatingCheckoutTicket({
  totalSelected = 0,
  includedLimit = 15,
  hasCuadroUpsell = false,
  setHasCuadroUpsell,
  onOpenSubmitModal
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Math calculations
  const extraCount = Math.max(0, totalSelected - includedLimit);
  
  // Cost without Cuadro
  const costWithoutCuadro = extraCount * EXTRA_PHOTO_PRICE;

  // Cost with Cuadro (Cuadro covers first 6 extras)
  const remainingExtrasWithCuadro = Math.max(0, extraCount - CUADRO_INCLUDED_EXTRAS);
  const costWithCuadro = CUADRO_UPSELL_PRICE + (remainingExtrasWithCuadro * EXTRA_PHOTO_PRICE);

  // Active subtotal
  const totalExtraCost = hasCuadroUpsell ? costWithCuadro : costWithoutCuadro;

  // Recommendation engine: if client selected 4 or more extras, Cuadro is cheaper or almost free!
  const recommendsCuadro = extraCount >= 3 && !hasCuadroUpsell;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1200,
        width: 'calc(100vw - 48px)',
        maxWidth: '380px',
        backgroundColor: 'rgba(18, 18, 20, 0.95)',
        backdropFilter: 'blur(18px)',
        border: hasCuadroUpsell 
          ? '1.5px solid #ffd402' 
          : '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(255, 212, 2, 0.12)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Header / Click to toggle expand */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '0.9rem 1.2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 212, 2, 0.15)',
            color: '#ffd402',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={15} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff', display: 'block', lineHeight: 1.1 }}>
              Ticket de Selección
            </span>
            <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
              {totalSelected} fotos elegidas ({Math.min(totalSelected, includedLimit)}/{includedLimit} incluidas)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: '800',
            color: totalExtraCost > 0 ? '#ffd402' : '#4ade80'
          }}>
            {totalExtraCost > 0 ? `+$${totalExtraCost.toLocaleString('es-MX')} MXN` : 'Sin extras'}
          </span>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: '#a1a1aa', padding: 0, display: 'flex' }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Photos Breakdown Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#d4d4d8'
          }}>
            <span>Fotos del paquete:</span>
            <strong>{Math.min(totalSelected, includedLimit)} de {includedLimit}</strong>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#d4d4d8'
          }}>
            <span>Fotos adicionales:</span>
            {extraCount > 0 ? (
              <span style={{ color: '#f59e0b', fontWeight: '700' }}>
                +{extraCount} {extraCount === 1 ? 'extra' : 'extras'}
              </span>
            ) : (
              <span style={{ color: '#4ade80', fontWeight: '600' }}>0 extras</span>
            )}
          </div>

          {/* CUADRO UPSELL CARD */}
          <div 
            onClick={() => setHasCuadroUpsell(!hasCuadroUpsell)}
            style={{
              padding: '0.9rem',
              borderRadius: '12px',
              backgroundColor: hasCuadroUpsell 
                ? 'rgba(255, 212, 2, 0.12)' 
                : 'rgba(255, 255, 255, 0.03)',
              border: hasCuadroUpsell 
                ? '1px solid #ffd402' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  border: hasCuadroUpsell ? '2px solid #ffd402' : '2px solid #71717a',
                  backgroundColor: hasCuadroUpsell ? '#ffd402' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09090b'
                }}>
                  {hasCuadroUpsell && <Check size={14} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: hasCuadroUpsell ? '#ffd402' : '#ffffff' }}>
                  🖼️ Agregar Cuadro Fino
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffd402' }}>
                $499 MXN
              </span>
            </div>

            <p style={{ margin: '2px 0 0 28px', fontSize: '0.74rem', color: '#a1a1aa', lineHeight: '1.3' }}>
              Incluye <strong style={{ color: '#ffffff' }}>6 fotos extras</strong> para retoque + impresión de cuadro de gala para colgar en casa.
            </p>

            {recommendsCuadro && (
              <div style={{
                marginTop: '4px',
                marginLeft: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#ffd402',
                fontSize: '0.7rem',
                fontWeight: '700'
              }}>
                <Sparkles size={12} />
                <span>¡Recomendado! Ahorras en fotos extras y recibes el cuadro</span>
              </div>
            )}
          </div>

          {/* Subtotal Calculation details */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '600', color: '#f4f4f5' }}>Subtotal Extras:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: totalExtraCost > 0 ? '#ffd402' : '#ffffff' }}>
                ${totalExtraCost.toLocaleString('es-MX')} MXN
              </span>
            </div>
            {totalExtraCost === 0 && (
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>
                ✓ Todas las fotos seleccionadas están cubiertas por tu paquete base.
              </span>
            )}
          </div>

          {/* Action Button: Enviar Selección */}
          <button
            type="button"
            onClick={onOpenSubmitModal}
            disabled={totalSelected === 0}
            style={{
              backgroundColor: '#ffd402',
              color: '#09090b',
              border: 'none',
              borderRadius: '12px',
              padding: '0.85rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: totalSelected === 0 ? 'not-allowed' : 'pointer',
              opacity: totalSelected === 0 ? 0.5 : 1,
              boxShadow: '0 8px 20px rgba(255, 212, 2, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (totalSelected > 0) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 212, 2, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 212, 2, 0.25)';
            }}
          >
            <Send size={15} />
            <span>Enviar Fotos a Retoque ({totalSelected})</span>
          </button>

        </div>
      )}
    </div>
  );
}
