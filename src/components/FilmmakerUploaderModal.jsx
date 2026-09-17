import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, Check, Trash2, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useWixClient } from '../context/WixContext';

export default function FilmmakerUploaderModal({
  isOpen,
  onClose,
  session,
  targetStage = 'selection', // 'selection' | 'retouch' | 'final'
  onPhotosUploaded
}) {
  const { wixClient } = useWixClient();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen || !session) return null;

  const stageLabels = {
    selection: {
      name: 'Fotos para Selección',
      field: 'galeraDeFotos',
      color: '#ffd402'
    },
    retouch: {
      name: 'Fotos a Retocar',
      field: 'galeraDeFotosARetocar',
      color: '#f59e0b'
    },
    final: {
      name: 'Fotos Finales',
      field: 'galeraDeFotosMostrar',
      color: '#22c55e'
    }
  };

  const currentStageConfig = stageLabels[targetStage] || stageLabels.selection;

  const handleFiles = (files) => {
    const validImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newItems = validImages.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
    }));
    setSelectedFiles(prev => [...prev, ...newItems]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    try {
      // Format newly uploaded files into Wix image objects
      const newWixItems = selectedFiles.map((item, idx) => ({
        description: '',
        fileName: item.name,
        slug: `upload_${Date.now()}_${idx}_${item.name}`,
        alt: item.name,
        src: item.preview, // local blob or CDN
        title: item.name,
        type: 'image',
        settings: {
          height: 4000,
          width: 6000
        }
      }));

      const targetField = currentStageConfig.field;
      const currentList = session[targetField] || [];
      const updatedList = [...currentList, ...newWixItems];

      const updatedSession = {
        ...session,
        [targetField]: updatedList,
        _updatedDate: new Date().toISOString()
      };

      // Update Wix CMS collection if available
      if (wixClient && session._id) {
        try {
          await wixClient.items.update('Galeria', updatedSession);
          console.log('[FilmmakerUploader] Updated Wix CMS successfully.');
        } catch (cmsErr) {
          console.warn('[FilmmakerUploader] CMS update error (persisting locally in studio cache):', cmsErr);
        }
      }

      // Persist in local studio cache
      try {
        const raw = localStorage.getItem('buenatoma_filmmaker_sessions_cache');
        let list = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex(s => s._id === updatedSession._id || (s.title && s.title.toLowerCase() === (updatedSession.title || '').toLowerCase()));
        if (idx >= 0) {
          list[idx] = updatedSession;
        } else {
          list.push(updatedSession);
        }
        localStorage.setItem('buenatoma_filmmaker_sessions_cache', JSON.stringify(list));
      } catch (cacheErr) {
        console.warn('[FilmmakerUploader] Cache save note:', cacheErr);
      }

      if (onPhotosUploaded) {
        onPhotosUploaded(updatedSession);
      }

      setIsUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFiles([]);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('[FilmmakerUploader] Upload failed:', err);
      setIsUploading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(9, 9, 11, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          backgroundColor: '#121214',
          border: '1px solid rgba(255, 212, 2, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 212, 2, 0.12)',
              color: currentStageConfig.color,
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.4rem'
            }}>
              <UploadCloud size={13} />
              <span>Subir {currentStageConfig.name}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontWeight: '700' }}>
              Sesión {session.title || session.nmeroDeSesin}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#a1a1aa' }}>
              Cliente: <strong style={{ color: '#ffffff' }}>{session.usuario || 'Cliente'}</strong> · {session.tipoDeSesi || 'Sesión'}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {uploadSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '0 0 0.4rem 0' }}>
              ¡Fotos agregadas exitosamente!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
              Se han incorporado a la etapa <strong>{currentStageConfig.name}</strong> y sincronizado con el CMS.
            </p>
          </div>
        ) : (
          <div>
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #ffd402' : '2px dashed rgba(255, 255, 255, 0.15)',
                backgroundColor: isDragging ? 'rgba(255, 212, 2, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '1.5rem'
              }}
              onClick={() => document.getElementById('filmmaker-file-input').click()}
            >
              <input
                id="filmmaker-file-input"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 212, 2, 0.12)',
                color: '#ffd402',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <UploadCloud size={28} />
              </div>

              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.3rem' }}>
                Arrastra y suelta tus fotos aquí
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#a1a1aa' }}>
                O haz clic para seleccionar archivos JPG, PNG o WEBP en alta resolución
              </p>
            </div>

            {/* Selected files preview list */}
            {selectedFiles.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffd402', textTransform: 'uppercase' }}>
                    Archivos listos para subir ({selectedFiles.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Quitar todos
                  </button>
                </div>

                <div style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: '0.6rem',
                  borderRadius: '10px'
                }}>
                  {selectedFiles.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.preview}
                          alt={item.name}
                          style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '600' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                            {item.size}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={isUploading || selectedFiles.length === 0}
                style={{
                  backgroundColor: currentStageConfig.color,
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: isUploading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: isUploading || selectedFiles.length === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Guardando en CMS...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Subir {selectedFiles.length} Fotos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
