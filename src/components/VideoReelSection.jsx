import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Share2, Download, Heart } from 'lucide-react';

export default function VideoReelSection({
  reelUrl = 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-looking-at-each-other-in-the-sunset-41617-large.mp4',
  posterUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  title = 'Reel Cinemático de Regalo',
  subtitle = 'Edición vertical para Instagram & TikTok'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section style={{
      padding: '4rem 1.5rem',
      backgroundColor: '#09090b',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 1.1rem',
            borderRadius: '30px',
            backgroundColor: 'rgba(255, 212, 2, 0.12)',
            border: '1px solid rgba(255, 212, 2, 0.3)',
            color: '#ffd402',
            fontSize: '0.78rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} color="#ffd402" />
            <span>Regalo Especial Incluido</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'serif, Georgia',
            fontWeight: '300',
            color: '#ffffff',
            margin: '0 0 0.8rem 0'
          }}>
            {title}
          </h2>

          <p style={{
            fontSize: '1rem',
            color: '#a1a1aa',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Como detalle exclusivo de Buena Toma, tu sesión incluye un Reel vertical en calidad cinematográfica 4K calibrado en color y ritmo para tus redes sociales.
          </p>
        </div>

        {/* Video Player Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '9 / 16',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255, 212, 2, 0.15)'
          }}>
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={reelUrl}
              poster={posterUrl}
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlay}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
            />

            {/* Play Overlay Button if paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ffd402',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px rgba(255, 212, 2, 0.4)',
                  transition: 'transform 0.2s ease'
                }}>
                  <Play size={26} fill="#09090b" style={{ marginLeft: '4px' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', letterSpacing: '0.05em' }}>
                  Reproducir Reel
                </span>
              </div>
            )}

            {/* Controls Bar at bottom of reel */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.2rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={togglePlay}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} fill="#ffffff" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    backgroundColor: 'rgba(255, 212, 2, 0.9)',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={13} />
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Reel'}</span>
                </button>
              </div>
            </div>

            {/* Watermark badge top left */}
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.68rem',
              fontWeight: '700',
              color: '#ffd402',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Heart size={11} fill="#ffd402" />
              <span>REEL OFICIAL · BUENA TOMA</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
