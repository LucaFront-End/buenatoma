import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Heart, 
  Sparkles, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Play,
  Film,
  Camera,
  Download
} from 'lucide-react';
import { useWixClient } from '../context/WixContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import PasswordGate from '../components/PasswordGate';
import GuestFloatingBar from '../components/GuestFloatingBar';
import VideoReelSection from '../components/VideoReelSection';
import { useSEO } from '../hooks/useSEO';

export default function SharedGallery({ slug = '', setTab }) {
  const { wixClient, isReady } = useWixClient();

  const [sessionData, setSessionData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'video'

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch shared collection from Wix CMS
  useEffect(() => {
    let cancelled = false;

    async function fetchSharedData() {
      if (!isReady || !wixClient) return;

      try {
        setLoading(true);
        const searchSlug = (slug || '').trim().toLowerCase();

        // 1. First attempt: Query 'Enlacesdecompartir' collection
        let enlaceItem = null;
        try {
          const enlacesRes = await wixClient.items.query('Enlacesdecompartir').find();
          enlaceItem = enlacesRes.items.find(it => 
            (it.slug && it.slug.toLowerCase() === searchSlug) ||
            (it.title && it.title.toLowerCase() === searchSlug) ||
            (it._id === searchSlug)
          );
          if (!enlaceItem && enlacesRes.items.length > 0 && !searchSlug) {
            enlaceItem = enlacesRes.items[0];
          }
        } catch (e) {
          console.warn('[SharedGallery] Error querying Enlacesdecompartir:', e);
        }

        // 2. Second attempt: Query 'Galeria' collection if needed
        let galeriaItem = null;
        try {
          const galeriaRes = await wixClient.items.query('Galeria').find();
          galeriaItem = galeriaRes.items.find(it =>
            (it.title && it.title.toLowerCase() === searchSlug) ||
            (it.nmeroDeSesin && it.nmeroDeSesin.toLowerCase() === searchSlug) ||
            (it.slugDeGaleraMostrar && it.slugDeGaleraMostrar.toLowerCase() === searchSlug) ||
            (it._id === searchSlug)
          );
          if (!galeriaItem && galeriaRes.items.length > 0) {
            galeriaItem = galeriaRes.items[0];
          }
        } catch (e) {
          console.warn('[SharedGallery] Error querying Galeria:', e);
        }

        if (cancelled) return;

        // Process photos from Enlacesdecompartir or Galeria
        let rawPhotos = [];
        let sessionCode = 'BNTM-26001';
        let title = 'Galería de Recuerdos';
        let client = 'Sofía & Alejandro';
        let password = '';

        if (enlaceItem && enlaceItem.galeria && enlaceItem.galeria.length > 0) {
          rawPhotos = enlaceItem.galeria;
          sessionCode = enlaceItem.title || 'BNTM-26001';
          title = enlaceItem.tipoDeSesin || 'Pedida de Mano';
        } else if (galeriaItem) {
          // If in Galeria, prefer galeraDeFotosARetocar or galeraDeFotosMostrar, fallback to galeraDeFotos
          rawPhotos = galeriaItem.galeraDeFotosMostrar?.length > 0 
            ? galeriaItem.galeraDeFotosMostrar 
            : (galeriaItem.galeraDeFotosARetocar?.length > 0 
                ? galeriaItem.galeraDeFotosARetocar 
                : (galeriaItem.galeraDeFotos || []));
          
          sessionCode = galeriaItem.nmeroDeSesin || galeriaItem.title || 'BNTM-26001';
          title = galeriaItem.tipoDeSesi || 'Pedida de Mano';
          client = galeriaItem.usuario || 'Sofía & Alejandro';
          password = galeriaItem.contrasea || '';
        }

        // Check local client selection or filmmaker cache if rawPhotos is empty
        if (rawPhotos.length === 0) {
          try {
            const baseCode = (searchSlug || '').replace('-compartir', '').replace('-retocar', '');
            const rawSel = localStorage.getItem(`buenatoma_selection_${searchSlug}`) || 
                           localStorage.getItem(`buenatoma_selection_${baseCode}`) ||
                           localStorage.getItem('buenatoma_selection_bntm-26001');
            if (rawSel) {
              const parsed = JSON.parse(rawSel);
              if (parsed.selectedWixMedia?.length > 0) {
                rawPhotos = parsed.selectedWixMedia;
                sessionCode = parsed.sessionCode || sessionCode;
                title = parsed.sessionTitle || title;
                client = parsed.clientName || client;
              }
            }
          } catch (e) {}
        }

        const normalized = (rawPhotos || []).map((p, idx) => normalizeGalleryItem(p, idx));

        setSessionData({
          sessionCode,
          title,
          clientName: client,
          password: password,
          raw: enlaceItem || galeriaItem
        });
        setPhotos(normalized);
        setLoading(false);
      } catch (err) {
        console.error('[SharedGallery] Failed to load data:', err);
        setLoading(false);
      }
    }

    fetchSharedData();

    return () => {
      cancelled = true;
    };
  }, [wixClient, isReady, slug]);

  useSEO({
    title: `${sessionData?.title || 'Galería'} · ${sessionData?.clientName || 'Buena Toma'} | Buena Toma`,
    description: 'Disfruta de esta selección especial de fotografías capturadas por Buena Toma Estudio.',
    canonical: typeof window !== 'undefined' ? window.location.href : '',
  });

  // Anti-download security
  useEffect(() => {
    const handleKeySecurity = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setToastMessage('Descarga directa deshabilitada por protección de derechos de autor.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    };
    window.addEventListener('keydown', handleKeySecurity);
    return () => window.removeEventListener('keydown', handleKeySecurity);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((lightboxIndex + 1) % photos.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5' }}>
      
      {/* ─── PASSWORD GATE IF LOCKED ─── */}
      {!isUnlocked && (
        <PasswordGate
          sessionCode={sessionData?.sessionCode || slug || 'BNTM-26001'}
          sessionTitle={sessionData?.title || 'Pedida de Mano'}
          clientName={sessionData?.clientName || ''}
          correctPassword={sessionData?.password || ''}
          onUnlock={() => setIsUnlocked(true)}
        />
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '85px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          backgroundColor: 'rgba(18, 18, 20, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #ffd402',
          color: '#ffffff',
          padding: '0.75rem 1.6rem',
          borderRadius: '50px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600',
          pointerEvents: 'none'
        }}>
          <Sparkles size={18} color="#ffd402" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HERO COVER ─── */}
      <section style={{
        position: 'relative',
        height: '70vh',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: photos.length > 0 ? `url(${photos[0].url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          filter: 'brightness(0.65)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0.95) 100%)'
        }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: '750px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 212, 2, 0.15)',
            border: '1px solid rgba(255, 212, 2, 0.35)',
            color: '#ffd402',
            padding: '0.4rem 1.2rem',
            borderRadius: '30px',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.2rem'
          }}>
            <Sparkles size={14} color="#ffd402" />
            <span>Colección Especial Compartida</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontFamily: 'serif, Georgia',
            fontWeight: '300',
            color: '#ffffff',
            margin: '0 0 0.8rem 0',
            lineHeight: '1.1'
          }}>
            {sessionData?.title || 'Pedida de Mano'}
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>
            {sessionData?.clientName || 'Sofía & Alejandro'} · {sessionData?.sessionCode || 'BNTM-26001'}
          </p>

          <p style={{ fontSize: '0.88rem', color: '#a1a1aa', margin: '0 auto', maxWidth: '500px' }}>
            Bienvenido a la galería oficial. Aquí podrás revivir los momentos más emotivos seleccionados con cariño por los anfitriones.
          </p>
        </div>
      </section>

      {/* ─── NAVIGATION BAR (FOTOS vs VIDEO) ─── */}
      <nav style={{
        position: 'sticky',
        top: '75px',
        zIndex: 100,
        backgroundColor: 'rgba(9, 9, 11, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem'
      }}>
        <div className="container" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Tabs: Fotos vs Video */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              style={{
                backgroundColor: activeTab === 'photos' ? '#ffd402' : 'transparent',
                color: activeTab === 'photos' ? '#09090b' : '#a1a1aa',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Camera size={15} />
              <span>Fotos ({photos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              style={{
                backgroundColor: activeTab === 'video' ? '#ffd402' : 'transparent',
                color: activeTab === 'video' ? '#09090b' : '#a1a1aa',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Film size={15} />
              <span>Video Reel</span>
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#71717a' }}>
            Fotografía por <strong style={{ color: '#ffffff' }}>Buena Toma</strong>
          </div>
        </div>
      </nav>

      {/* ─── TAB CONTENT ─── */}
      {activeTab === 'photos' ? (
        <section style={{ padding: '3rem 1.5rem 8rem 1.5rem', maxWidth: '1380px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ffd402' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Cargando fotografías compartidas...</p>
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#a1a1aa' }}>
              <p>Aún no hay fotos en esta galería compartida.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {photos.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => setLightboxIndex(index)}
                  style={{
                    position: 'relative',
                    aspectRatio: item.aspect === 'portrait' ? '3/4' : '4/3',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: '#18181b',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(255, 212, 2, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Watermark */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    color: 'rgba(255, 255, 255, 0.12)',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    letterSpacing: '0.15em',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}>
                    BUENA TOMA
                  </div>

                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                  >
                    <div style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: '600' }}>
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <VideoReelSection
          title="El Reel de la Sesión"
          subtitle={`Edición conmemorativa de ${sessionData?.title || 'la sesión'}`}
        />
      )}

      {/* ─── LIGHTBOX PORTAL ─── */}
      {lightboxIndex !== null && photos[lightboxIndex] && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: 'rgba(9, 9, 11, 0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar */}
          <div style={{
            padding: '1.2rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
              Foto {lightboxIndex + 1} de {photos.length} · <strong style={{ color: '#ffffff' }}>{photos[lightboxIndex].title}</strong>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Photo Display */}
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].title}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
              }}
            />

            {/* Nav Arrows */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* ─── GUEST FLOATING BAR ─── */}
      <GuestFloatingBar
        setTab={setTab}
        sessionTitle={sessionData?.title || 'esta sesión'}
        clientName={sessionData?.clientName || 'los novios'}
      />

    </div>
  );
}
