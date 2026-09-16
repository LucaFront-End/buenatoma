import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Film, 
  UploadCloud, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  MessageSquare, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ExternalLink,
  Search,
  ShieldCheck,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useWixClient } from '../context/WixContext';
import { useWixAuth } from '../context/WixAuthContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import FilmmakerUploaderModal from '../components/FilmmakerUploaderModal';
import SessionPhotoViewerModal from '../components/SessionPhotoViewerModal';
import { useSEO } from '../hooks/useSEO';

export default function FilmmakerPortal({ setTab }) {
  const { wixClient, isReady } = useWixClient();
  const { currentUser, isFilmmaker, loginAsFilmmaker, logout } = useWixAuth();

  // Active Filmmaker Tab: 'selection' | 'retouch' | 'final'
  const [activeTab, setActiveTab] = useState('selection');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeUploadSession, setActiveUploadSession] = useState(null);
  const [uploadTargetStage, setUploadTargetStage] = useState('selection');

  const [activeViewerSession, setActiveViewerSession] = useState(null);
  const [viewerStageTitle, setViewerStageTitle] = useState('');
  const [viewerPhotos, setViewerPhotos] = useState([]);

  useSEO({
    title: 'Portal Filmmaker & Producción | Buena Toma',
    description: 'Espacio de trabajo privado para fotógrafos, filmmakers y editores de Buena Toma Estudio.'
  });

  // Fetch all sessions from Wix CMS collection 'Galeria'
  const fetchSessions = async () => {
    if (!isReady || !wixClient) return;

    try {
      setLoading(true);
      const res = await wixClient.items.query('Galeria').find();
      if (res.items && res.items.length > 0) {
        setSessions(res.items);
      } else {
        // Fallback default sample session
        setSessions([{
          _id: 'default-bntm-26001',
          title: 'BNTM-26001',
          nmeroDeSesin: 'BNTM-26001',
          tipoDeSesi: 'Pedida de Mano',
          usuario: 'Sofía Oramas & Alejandro',
          fechaDeSesiones: '2026-09-14',
          comentarios: 'Priorizar tomas con luz dorada del mirador y fotos con el anillo de compromiso.',
          galeraDeFotos: [],
          galeraDeFotosARetocar: [],
          galeraDeFotosMostrar: [],
          slugDeGaleraMostrar: 'bntm-26001-compartir',
          slugDeGaleraFinal: 'bntm-26001-retocar'
        }]);
      }
      setLoading(false);
    } catch (err) {
      console.warn('[FilmmakerPortal] Error loading Galeria from CMS:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [wixClient, isReady]);

  // Stage configurations
  const stageTabs = [
    {
      id: 'selection',
      label: 'Fotos para Selección',
      field: 'galeraDeFotos',
      color: '#ffd402',
      badge: 'Pruebas / Cliente Elige',
      description: 'Tomas en bruto y pruebas subidas para que el cliente elija sus favoritas.'
    },
    {
      id: 'retouch',
      label: 'Fotos Retocar',
      field: 'galeraDeFotosARetocar',
      color: '#f59e0b',
      badge: 'Mesa de Edición',
      description: 'Fotografías seleccionadas por el cliente con notas de calibración y retoque.'
    },
    {
      id: 'final',
      label: 'Fotos Finales',
      field: 'galeraDeFotosMostrar',
      color: '#22c55e',
      badge: 'Entrega Final / Exhibición',
      description: 'Colección terminada en Ultra HD lista para descarga o difusión pública.'
    }
  ];

  const currentTabConfig = stageTabs.find(t => t.id === activeTab) || stageTabs[0];

  // Open viewer modal
  const openViewer = (session, stageConfig) => {
    const photos = session[stageConfig.field] || [];
    setActiveViewerSession(session);
    setViewerStageTitle(`${stageConfig.label} · ${session.title || session.nmeroDeSesin}`);
    setViewerPhotos(photos);
  };

  // Open uploader modal
  const openUploader = (session, stageId) => {
    setActiveUploadSession(session);
    setUploadTargetStage(stageId);
  };

  // Direct download of stage photos
  const handleBulkDownload = (session, stageConfig) => {
    const rawPhotos = session[stageConfig.field] || [];
    if (rawPhotos.length === 0) {
      alert(`No hay fotos en la etapa "${stageConfig.label}" para esta sesión.`);
      return;
    }
    const normalized = rawPhotos.map((p, idx) => normalizeGalleryItem(p, idx));
    normalized.forEach((photo, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `${session.title || 'sesion'}_${idx + 1}_${photo.fileName || 'foto.jpg'}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 250);
    });
  };

  const handleSessionUpdated = (updatedSession) => {
    setSessions(prev => prev.map(s => s._id === updatedSession._id ? updatedSession : s));
  };

  // Filter sessions by search
  const filteredSessions = sessions.filter(s => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const sessionNum = (s.title || s.nmeroDeSesin || '').toLowerCase();
    const client = (s.usuario || '').toLowerCase();
    const type = (s.tipoDeSesi || '').toLowerCase();
    return sessionNum.includes(query) || client.includes(query) || type.includes(query);
  });

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5', padding: '5.5rem 1.5rem 6rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* ─── PERMISSION CHECK / AUTH BANNER ─── */}
        {!isFilmmaker ? (
          <div style={{
            maxWidth: '520px',
            margin: '4rem auto',
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 212, 2, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 212, 2, 0.12)',
              color: '#ffd402',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto'
            }}>
              <Lock size={26} />
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
              Acceso a Espacio Filmmaker
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', lineHeight: '1.6', marginBottom: '1.8rem' }}>
              Esta sección requiere permisos de usuario con la etiqueta <strong style={{ color: '#ffd402' }}>Filmmaker</strong> autorizada por Buena Toma Estudio.
            </p>

            <button
              type="button"
              onClick={loginAsFilmmaker}
              style={{
                width: '100%',
                backgroundColor: '#ffd402',
                color: '#09090b',
                border: 'none',
                borderRadius: '12px',
                padding: '0.9rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px rgba(255, 212, 2, 0.25)'
              }}
            >
              <ShieldCheck size={17} />
              <span>Acceder con Permisos de Filmmaker</span>
            </button>
          </div>
        ) : (
          /* ─── AUTHORIZED FILMMAKER WORKSPACE ─── */
          <div>
            
            {/* Header / User Profile Row */}
            <div style={{
              backgroundColor: 'rgba(18, 18, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '1.8rem 2rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                  <span style={{
                    backgroundColor: 'rgba(255, 212, 2, 0.15)',
                    border: '1px solid rgba(255, 212, 2, 0.4)',
                    color: '#ffd402',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Film size={13} />
                    <span>Rol: Filmmaker Autorizado</span>
                  </span>

                  <span style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '700'
                  }}>
                    ✓ Wix CMS Conectado
                  </span>
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.3rem 0' }}>
                  Mesa de Control de Sesiones
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
                  Bienvenido, <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Filmmaker'}</strong> ({currentUser?.email}) · Gestión de subidas, selecciones y entregas finales
                </p>
              </div>

              {/* Quick Actions & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', minWidth: '240px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                  <input
                    type="text"
                    placeholder="Buscar por sesión o cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#09090b',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      padding: '0.55rem 0.8rem 0.55rem 2.2rem',
                      fontSize: '0.82rem',
                      color: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchSessions}
                  title="Recargar sesiones del CMS"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.55rem 1rem',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  <span>Sincronizar CMS</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  title="Cerrar sesión"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            {/* ─── 3 PRIMARY TABS ─── */}
            <div style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.8rem',
              marginBottom: '2rem',
              overflowX: 'auto'
            }}>
              {stageTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                // Count how many photos exist across sessions for this tab
                const totalPhotosInTab = sessions.reduce((acc, s) => acc + (s[tab.field]?.length || 0), 0);

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 212, 2, 0.12)' : 'transparent',
                      border: isActive ? `1.5px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '0.8rem 1.4rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? tab.color : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#09090b' : '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={16} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: isActive ? '#ffffff' : '#a1a1aa' }}>
                        {tab.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: tab.color, fontWeight: '600' }}>
                        {totalPhotosInTab} fotos totales · {tab.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tab Description Notice */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderLeft: `3px solid ${currentTabConfig.color}`,
              padding: '0.8rem 1.2rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '2rem',
              fontSize: '0.82rem',
              color: '#d4d4d8'
            }}>
              <strong>{currentTabConfig.label}:</strong> {currentTabConfig.description}
            </div>

            {/* ─── SESSIONS GRID UNDER ACTIVE TAB ─── */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#ffd402' }}>
                <RefreshCw size={32} className="spin" style={{ margin: '0 auto 1rem auto' }} />
                <p>Cargando sesiones desde Wix CMS...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#a1a1aa' }}>
                <p>No se encontraron sesiones que coincidan con la búsqueda.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredSessions.map((session) => {
                  const stagePhotos = session[currentTabConfig.field] || [];
                  const photoCount = stagePhotos.length;
                  const dateStr = session.fechaDeSesiones 
                    ? new Date(session.fechaDeSesiones).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Fecha por confirmar';

                  return (
                    <div
                      key={session._id}
                      style={{
                        backgroundColor: '#141416',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.2rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                    >
                      {/* Top Session Metadata */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: '800',
                            color: '#ffd402',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                          }}>
                            {session.title || session.nmeroDeSesin}
                          </span>

                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            backgroundColor: photoCount > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            color: photoCount > 0 ? '#4ade80' : '#a1a1aa',
                            fontSize: '0.72rem',
                            fontWeight: '700'
                          }}>
                            {photoCount} fotos
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                          {session.tipoDeSesi || 'Sesión Fotográfica'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#a1a1aa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={13} color="#ffd402" />
                            <span>Cliente: <strong style={{ color: '#ffffff' }}>{session.usuario || 'Cliente registrado'}</strong></span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} color="#ffd402" />
                            <span>Fecha: {dateStr}</span>
                          </div>
                        </div>

                        {/* Comentarios de la sesión */}
                        {session.comentarios ? (
                          <div style={{
                            marginTop: '0.8rem',
                            padding: '0.65rem 0.9rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderLeft: '2px solid #ffd402',
                            borderRadius: '0 6px 6px 0',
                            fontSize: '0.75rem',
                            color: '#d4d4d8',
                            lineHeight: '1.4'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd402', fontWeight: '700', marginBottom: '2px' }}>
                              <MessageSquare size={12} />
                              <span>Comentarios:</span>
                            </div>
                            "{session.comentarios}"
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.8rem', fontSize: '0.72rem', color: '#52525b', fontStyle: 'italic' }}>
                            Sin comentarios especiales.
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Ver, Subir, Bajar Fotos */}
                      <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {/* Ver Fotos */}
                          <button
                            type="button"
                            onClick={() => openViewer(session, currentTabConfig)}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '10px',
                              padding: '0.6rem',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Eye size={14} />
                            <span>Ver Fotos ({photoCount})</span>
                          </button>

                          {/* Subir Fotos */}
                          <button
                            type="button"
                            onClick={() => openUploader(session, activeTab)}
                            style={{
                              backgroundColor: 'rgba(255, 212, 2, 0.12)',
                              color: '#ffd402',
                              border: '1px solid rgba(255, 212, 2, 0.3)',
                              borderRadius: '10px',
                              padding: '0.6rem',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <UploadCloud size={14} />
                            <span>Subir Fotos</span>
                          </button>
                        </div>

                        {/* Bajar Fotos */}
                        <button
                          type="button"
                          onClick={() => handleBulkDownload(session, currentTabConfig)}
                          disabled={photoCount === 0}
                          style={{
                            width: '100%',
                            backgroundColor: photoCount > 0 ? '#ffd402' : 'rgba(255,255,255,0.04)',
                            color: photoCount > 0 ? '#09090b' : '#71717a',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.65rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: photoCount > 0 ? 'pointer' : 'not-allowed',
                            opacity: photoCount > 0 ? 1 : 0.5
                          }}
                        >
                          <Download size={15} />
                          <span>Bajar Fotos ({photoCount})</span>
                        </button>

                        {/* Direct Link Shortcuts */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingTop: '6px',
                          fontSize: '0.72rem'
                        }}>
                          <a
                            href={`/galeria/${(session.title || session.nmeroDeSesin || '').toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>Galería Cliente</span>
                            <ExternalLink size={10} />
                          </a>

                          <a
                            href={`/compartir/${session.slugDeGaleraMostrar || (session.title || '').toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>Compartida</span>
                            <ExternalLink size={10} />
                          </a>

                          <a
                            href={`/retocar/${session.slugDeGaleraFinal || (session.title || '').toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#ffd402', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>Retoque</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ─── MODALS ─── */}
      {/* Upload Modal */}
      <FilmmakerUploaderModal
        isOpen={Boolean(activeUploadSession)}
        onClose={() => setActiveUploadSession(null)}
        session={activeUploadSession}
        targetStage={uploadTargetStage}
        onPhotosUploaded={handleSessionUpdated}
      />

      {/* Photo Viewer Modal */}
      <SessionPhotoViewerModal
        isOpen={Boolean(activeViewerSession)}
        onClose={() => setActiveViewerSession(null)}
        session={activeViewerSession}
        stageTitle={viewerStageTitle}
        photos={viewerPhotos}
      />

    </div>
  );
}
