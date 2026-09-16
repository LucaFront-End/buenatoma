import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Eye, ChevronLeft, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import { normalizeGalleryItem } from '../lib/wixMedia';

export default function SessionPhotoViewerModal({
  isOpen,
  onClose,
  session,
  stageTitle = 'Galería de Fotos',
  photos = []
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  if (!isOpen || !session) return null;

  const normalizedPhotos = (photos || []).map((p, idx) => normalizeGalleryItem(p, idx));

  const handleDownloadSingle = (item, e) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.fileName || `${item.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (normalizedPhotos.length === 0) return;
    setDownloadingAll(true);

    normalizedPhotos.forEach((photo, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `${session.title || 'sesion'}_${idx + 1}_${photo.fileName || 'foto.jpg'}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (idx === normalizedPhotos.length - 1) {
          setDownloadingAll(false);
        }
      }, idx * 300);
    });
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#121214',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffd402', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {stageTitle}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717a' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }}>
              {session.title || session.nmeroDeSesin}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '2px' }}>
            Cliente: <strong style={{ color: '#ffffff' }}>{session.usuario || 'Cliente'}</strong> · {normalizedPhotos.length} fotos en esta etapa
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={downloadingAll || normalizedPhotos.length === 0}
            style={{
              backgroundColor: '#ffd402',
              color: '#09090b',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem 1.2rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: downloadingAll || normalizedPhotos.length === 0 ? 'not-allowed' : 'pointer',
              opacity: downloadingAll || normalizedPhotos.length === 0 ? 0.5 : 1
            }}
          >
            <Download size={15} />
            <span>{downloadingAll ? 'Descargando colección...' : `Bajar Todas (${normalizedPhotos.length})`}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
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
      </div>

      {/* Grid of Photos */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {normalizedPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#71717a' }}>
            <ImageIcon size={48} style={{ opacity: 0.4, margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              No hay fotos cargadas en esta etapa
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              Usa la opción "Subir Fotos" desde el panel de Filmmaker para agregar tomas a esta sesión.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.2rem',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {normalizedPhotos.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => setLightboxIndex(index)}
                style={{
                  backgroundColor: '#18181b',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ aspectRatio: '1', position: 'relative' }}>
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: '#ffd402'
                  }}>
                    #{index + 1}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDownloadSingle(item, e)}
                    title="Bajar fotografía"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                  </button>
                </div>

                <div style={{ padding: '0.7rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.fileName || item.title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#71717a', marginTop: '2px' }}>
                    ID: {item.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox inspection */}
      {lightboxIndex !== null && normalizedPhotos[lightboxIndex] && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000000,
            backgroundColor: 'rgba(0,0,0,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '42px',
              height: '42px',
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
            <X size={22} />
          </button>

          <img
            src={normalizedPhotos[lightboxIndex].url}
            alt={normalizedPhotos[lightboxIndex].title}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + normalizedPhotos.length) % normalizedPhotos.length);
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '46px',
              height: '46px',
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
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % normalizedPhotos.length);
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '46px',
              height: '46px',
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
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>,
    document.body
  );
}
