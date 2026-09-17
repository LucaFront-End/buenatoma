import React, { useState, useEffect } from 'react';
import { Camera, Copy, Check, Sparkles, Download, Layers, CheckCircle2 } from 'lucide-react';
import { useWixClient } from '../context/WixContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import { useSEO } from '../hooks/useSEO';

export default function PhotographerRetouch({ slug = '', setTab }) {
  const { wixClient, isReady } = useWixClient();
  const [session, setSession] = useState(null);
  const [retouchPhotos, setRetouchPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!isReady || !wixClient) return;

      try {
        setLoading(true);
        const search = (slug || '').trim().toLowerCase();

        const res = await wixClient.items.query('Galeria').find();
        const found = res.items.find(it => 
          (it.slugDeGaleraFinal && it.slugDeGaleraFinal.toLowerCase() === search) ||
          (it.title && it.title.toLowerCase() === search) ||
          (it.nmeroDeSesin && it.nmeroDeSesin.toLowerCase() === search) ||
          (it._id === search)
        ) || res.items[0];

        if (cancelled) return;

        if (found) {
          setSession(found);
          let raw = found.galeraDeFotosARetocar || [];
          if (raw.length === 0) {
            try {
              const baseCode = (search || '').replace('-retocar', '').replace('-compartir', '');
              const rawSel = localStorage.getItem(`buenatoma_selection_${search}`) || 
                             localStorage.getItem(`buenatoma_selection_${baseCode}`) ||
                             localStorage.getItem('buenatoma_selection_bntm-26001');
              if (rawSel) {
                const parsed = JSON.parse(rawSel);
                if (parsed.selectedWixMedia?.length > 0) {
                  raw = parsed.selectedWixMedia;
                }
              }
            } catch (e) {}
          }
          if (raw.length === 0) {
            raw = found.galeraDeFotos || [];
          }
          setRetouchPhotos(raw.map((p, idx) => normalizeGalleryItem(p, idx)));
        }
        setLoading(false);
      } catch (err) {
        console.error('[PhotographerRetouch] Load error:', err);
        setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [wixClient, isReady, slug]);

  useSEO({
    title: `Mesa de Retoque · ${session?.title || 'Fotógrafo'} | Buena Toma`,
    description: 'Panel privado para fotógrafos y editores de Buena Toma Estudio.'
  });

  const handleCopyFilenames = () => {
    const filenames = retouchPhotos.map(p => p.fileName || p.title).join(', ');
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(filenames);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5', padding: '5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#18181b',
          border: '1px solid rgba(255, 212, 2, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 212, 2, 0.12)',
              color: '#ffd402',
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.8rem'
            }}>
              <Camera size={13} />
              <span>Mesa de Edición & Retoque Fotográfico</span>
            </div>

            <h1 style={{ fontSize: '2rem', margin: '0 0 0.4rem 0', fontWeight: '700' }}>
              {session?.title || 'BNTM-26001'} · {session?.tipoDeSesi || 'Sesión'}
            </h1>
            <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.9rem' }}>
              Cliente: <strong style={{ color: '#ffffff' }}>{session?.usuario || 'Sofía & Alejandro'}</strong> · {retouchPhotos.length} fotos elegidas para retoque final
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopyFilenames}
              style={{
                backgroundColor: copied ? '#22c55e' : '#ffd402',
                color: '#09090b',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '¡Nombres Copiados!' : 'Copiar Nombres de Archivo'}</span>
            </button>
          </div>
        </div>

        {/* Grid of Retouch Photos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ffd402' }}>
            <p>Cargando lista de retoque del CMS...</p>
          </div>
        ) : retouchPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#a1a1aa' }}>
            <p>Aún no hay fotos marcadas para retoque en esta sesión.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {retouchPhotos.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  backgroundColor: '#18181b',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ aspectRatio: '3/4', position: 'relative' }}>
                  <img
                    src={item.url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#ffd402'
                  }}>
                    #{index + 1}
                  </div>
                </div>

                <div style={{ padding: '0.9rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', wordBreak: 'break-all' }}>
                    {item.fileName || item.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' }}>
                    ID: {item.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
