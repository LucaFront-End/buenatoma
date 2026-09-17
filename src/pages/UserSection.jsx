import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Film, 
  Camera, 
  Calendar, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  LogOut, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  MessageSquare,
  RefreshCw,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { useWixAuth } from '../context/WixAuthContext';
import { useWixClient } from '../context/WixContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import { useSEO } from '../hooks/useSEO';
import SessionPhotoViewerModal from '../components/SessionPhotoViewerModal';
import FilmmakerUploaderModal from '../components/FilmmakerUploaderModal';

export default function UserSection({ setTab }) {
  const { currentUser, isLoggedIn, isFilmmaker, login, loginAsFilmmaker, loginAsClient, logout } = useWixAuth();
  const { wixClient, isReady } = useWixClient();

  // Active section tab: 'sessions' | 'filmmaker' | 'packages' | 'profile'
  const [activeTab, setActiveTab] = useState('sessions');

  // Login form state (if not logged in)
  const [loginEmail, setLoginEmail] = useState('');
  const [sessionCodeInput, setSessionCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Sessions from Wix CMS
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Filmmaker sub-tab (if inside filmmaker section)
  const [filmmakerStage, setFilmmakerStage] = useState('selection'); // 'selection' | 'retouch' | 'final'

  // Viewer & Uploader modals state
  const [activeViewerSession, setActiveViewerSession] = useState(null);
  const [viewerStageTitle, setViewerStageTitle] = useState('');
  const [viewerPhotos, setViewerPhotos] = useState([]);

  const [activeUploadSession, setActiveUploadSession] = useState(null);
  const [uploadTargetStage, setUploadTargetStage] = useState('selection');

  // Comment edit state
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useSEO({
    title: 'Mi Cuenta · Portal de Clientes y Producción | Buena Toma',
    description: 'Gestiona tus sesiones de fotografía, selecciona tus tomas favoritas, descarga fotos en alta resolución y accede al espacio de trabajo Filmmaker.'
  });

  // Load sessions from Wix CMS and merge with local studio cache
  const fetchSessions = async () => {
    if (!isReady || !wixClient) return;

    try {
      setLoadingSessions(true);
      const res = await wixClient.items.query('Galeria').find();
      let cmsList = res.items && res.items.length > 0 ? res.items : [];

      let cachedList = [];
      try {
        const raw = localStorage.getItem('buenatoma_filmmaker_sessions_cache');
        if (raw) cachedList = JSON.parse(raw);
      } catch (e) {}

      if (cmsList.length === 0 && cachedList.length === 0) {
        cmsList = [{
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
        }];
      }

      const merged = (cmsList.length > 0 ? cmsList : cachedList).map(session => {
        const sessionCode = session.title || session.nmeroDeSesin || '';
        const matchCached = cachedList.find(c => 
          (c._id && c._id === session._id) || 
          (c.title && c.title.toLowerCase() === sessionCode.toLowerCase())
        );

        let clientSelectedMedia = null;
        try {
          const rawSel = localStorage.getItem(`buenatoma_selection_${sessionCode.toLowerCase()}`);
          if (rawSel) {
            const parsedSel = JSON.parse(rawSel);
            if (parsedSel.selectedWixMedia?.length) {
              clientSelectedMedia = parsedSel.selectedWixMedia;
            }
          }
        } catch (e) {}

        const finalARetocar = clientSelectedMedia || matchCached?.galeraDeFotosARetocar || session.galeraDeFotosARetocar || [];
        const finalMostrar = matchCached?.galeraDeFotosMostrar || session.galeraDeFotosMostrar || [];
        const finalGalera = matchCached?.galeraDeFotos?.length ? matchCached.galeraDeFotos : (session.galeraDeFotos || []);

        return {
          ...session,
          ...(matchCached || {}),
          usuario: session.usuario || matchCached?.usuario || 'Sofía Oramas & Alejandro',
          fechaDeSesiones: session.fechaDeSesiones || matchCached?.fechaDeSesiones || '2026-09-14',
          comentarios: matchCached?.comentarios || session.comentarios || 'Priorizar tomas con luz dorada del mirador y fotos con el anillo de compromiso.',
          galeraDeFotos: finalGalera,
          galeraDeFotosARetocar: finalARetocar,
          galeraDeFotosMostrar: finalMostrar
        };
      });

      setSessions(merged);
      try {
        localStorage.setItem('buenatoma_filmmaker_sessions_cache', JSON.stringify(merged));
      } catch (e) {}
      setLoadingSessions(false);
    } catch (err) {
      console.warn('[UserSection] CMS load error:', err);
      try {
        const raw = localStorage.getItem('buenatoma_filmmaker_sessions_cache');
        if (raw) setSessions(JSON.parse(raw));
      } catch (e) {}
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [wixClient, isReady]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() && !sessionCodeInput.trim()) {
      setAuthError('Por favor ingresa tu correo electrónico o código de sesión.');
      return;
    }
    setAuthError('');
    if (sessionCodeInput.trim()) {
      loginAsClient(sessionCodeInput.trim().toUpperCase());
    } else {
      login(loginEmail);
    }
  };

  const handleSaveComment = async (sessionId) => {
    const updated = sessions.map(s => {
      if (s._id === sessionId) {
        return { ...s, comentarios: commentText.trim() };
      }
      return s;
    });
    setSessions(updated);
    setEditingSessionId(null);

    try {
      localStorage.setItem('buenatoma_filmmaker_sessions_cache', JSON.stringify(updated));
    } catch (e) {}

    const targetSession = updated.find(s => s._id === sessionId);
    if (wixClient && targetSession) {
      try {
        await wixClient.items.update('Galeria', targetSession);
      } catch (err) {
        console.warn('[UserSection] Note CMS update:', err);
      }
    }
  };

  const stageTabs = [
    {
      id: 'selection',
      label: 'Fotos para Selección',
      field: 'galeraDeFotos',
      color: '#ffd402',
      badge: 'Pruebas / Cliente Elige'
    },
    {
      id: 'retouch',
      label: 'Fotos Retocar',
      field: 'galeraDeFotosARetocar',
      color: '#f59e0b',
      badge: 'Mesa de Edición'
    },
    {
      id: 'final',
      label: 'Fotos Finales',
      field: 'galeraDeFotosMostrar',
      color: '#22c55e',
      badge: 'Entrega Final'
    }
  ];

  const currentFilmmakerStageConfig = stageTabs.find(t => t.id === filmmakerStage) || stageTabs[0];

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5', padding: '6rem 1.5rem 5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* ─── NOT LOGGED IN: LOGIN VIEW ─── */}
        {!isLoggedIn ? (
          <div style={{
            maxWidth: '500px',
            margin: '3rem auto',
            backgroundColor: '#141416',
            border: '1px solid rgba(255, 212, 2, 0.3)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 212, 2, 0.12)',
              color: '#ffd402',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <User size={30} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.4rem', color: '#ffffff' }}>
              Portal de <span style={{ color: '#ffd402' }}>Usuarios & Clientes</span>
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Ingresa con tu correo registrado en Wix Members o con tu código de sesión fotográfica (ej. BNTM-26001).
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  Correo electrónico (Wix Members)
                </label>
                <input 
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1f1f23',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.8rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  O Código de Sesión (Booking ID)
                </label>
                <input 
                  type="text"
                  placeholder="Ej. BNTM-26001"
                  value={sessionCodeInput}
                  onChange={(e) => setSessionCodeInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1f1f23',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.8rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              {authError && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0' }}>
                  {authError}
                </p>
              )}

              <button
                type="submit"
                style={{
                  backgroundColor: '#ffd402',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Ingresar a Mi Cuenta
              </button>
            </form>

            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Accesos directos rápidos de prueba
              </span>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => loginAsClient('BNTM-26001')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  👤 Entrar como Cliente (Sofía Oramas)
                </button>
                <button
                  type="button"
                  onClick={() => loginAsFilmmaker()}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '20px',
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🎬 Entrar como Filmmaker (Staff)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ─── LOGGED IN USER DASHBOARD ─── */
          <div>
            {/* Header User Profile Banner */}
            <div style={{
              backgroundColor: '#141416',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '1.8rem 2rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: isFilmmaker ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 212, 2, 0.15)',
                  border: isFilmmaker ? '2px solid #22c55e' : '2px solid #ffd402',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFilmmaker ? '#22c55e' : '#ffd402',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                      {currentUser?.name}
                    </h1>
                    {isFilmmaker ? (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}>
                        Etiqueta: Filmmaker
                      </span>
                    ) : (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 212, 2, 0.15)',
                        color: '#ffd402',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        border: '1px solid rgba(255, 212, 2, 0.3)'
                      }}>
                        Cliente VIP
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                    <span>{currentUser?.email}</span>
                    {currentUser?.sessionCode && <span> · Sesión activa: <strong style={{ color: '#ffd402' }}>{currentUser.sessionCode}</strong></span>}
                  </div>
                </div>
              </div>

              {/* Quick Actions / Role Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => isFilmmaker ? loginAsClient('BNTM-26001') : loginAsFilmmaker()}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isFilmmaker ? 'Ver vista Cliente' : 'Cambiar a Filmmaker'}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            {/* ─── MAIN USER TABS NAVIGATION ─── */}
            <div style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.8rem',
              marginBottom: '2rem',
              overflowX: 'auto'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('sessions')}
                style={{
                  backgroundColor: activeTab === 'sessions' ? 'rgba(255, 212, 2, 0.12)' : 'transparent',
                  border: activeTab === 'sessions' ? '1.5px solid #ffd402' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.7rem 1.4rem',
                  color: activeTab === 'sessions' ? '#ffffff' : '#a1a1aa',
                  fontWeight: activeTab === 'sessions' ? '700' : '500',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Camera size={16} color={activeTab === 'sessions' ? '#ffd402' : '#a1a1aa'} />
                Mis Sesiones & Fotos
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('filmmaker')}
                style={{
                  backgroundColor: activeTab === 'filmmaker' ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  border: activeTab === 'filmmaker' ? '1.5px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.7rem 1.4rem',
                  color: activeTab === 'filmmaker' ? '#ffffff' : '#a1a1aa',
                  fontWeight: activeTab === 'filmmaker' ? '700' : '500',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Film size={16} color={activeTab === 'filmmaker' ? '#22c55e' : '#a1a1aa'} />
                <span>Zona Filmmaker</span>
                {isFilmmaker && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    backgroundColor: '#22c55e',
                    color: '#09090b',
                    fontWeight: '800'
                  }}>
                    Staff
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                style={{
                  backgroundColor: activeTab === 'packages' ? 'rgba(255, 212, 2, 0.12)' : 'transparent',
                  border: activeTab === 'packages' ? '1.5px solid #ffd402' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.7rem 1.4rem',
                  color: activeTab === 'packages' ? '#ffffff' : '#a1a1aa',
                  fontWeight: activeTab === 'packages' ? '700' : '500',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <ShoppingBag size={16} color={activeTab === 'packages' ? '#ffd402' : '#a1a1aa'} />
                Mis Paquetes & Cuadros
              </button>
            </div>

            {/* ─── TAB 1: MIS SESIONES & FOTOS (CLIENTE) ─── */}
            {activeTab === 'sessions' && (
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>
                      Tus Sesiones Fotográficas
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
                      Accede a tus pruebas en alta resolución, elige tus fotos y revisa el estatus de edición en tiempo real.
                    </p>
                  </div>
                </div>

                {loadingSessions ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ffd402' }}>
                    <RefreshCw size={28} className="spin" style={{ margin: '0 auto 10px auto' }} />
                    <p>Consultando sesiones en Wix CMS...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: '#a1a1aa' }}>
                    <p>No tienes sesiones activas registradas en este momento.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {sessions.map((session) => {
                      const totalPhotos = session.galeraDeFotos?.length || 0;
                      const retouchCount = session.galeraDeFotosARetocar?.length || 0;
                      const finalCount = session.galeraDeFotosMostrar?.length || 0;
                      const dateStr = session.fechaDeSesiones 
                        ? new Date(session.fechaDeSesiones).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '14 de Septiembre, 2026';

                      return (
                        <div
                          key={session._id}
                          style={{
                            backgroundColor: '#141416',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '1.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(255, 212, 2, 0.12)',
                                  color: '#ffd402',
                                  fontWeight: '700'
                                }}>
                                  {session.tipoDeSesi || 'Pedida de Mano'}
                                </span>
                              </div>

                              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 6px 0', color: '#ffffff' }}>
                                Sesión de {session.usuario || 'Sofía Oramas & Alejandro'}
                              </h3>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.82rem', color: '#a1a1aa' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Calendar size={13} color="#ffd402" />
                                  <span>{dateStr}</span>
                                </div>
                                <div>·</div>
                                <div>
                                  <span>{totalPhotos} tomas disponibles</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div style={{
                              padding: '0.6rem 1rem',
                              borderRadius: '12px',
                              backgroundColor: finalCount > 0 ? 'rgba(34, 197, 94, 0.12)' : (retouchCount > 0 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 212, 2, 0.12)'),
                              border: `1px solid ${finalCount > 0 ? '#22c55e' : (retouchCount > 0 ? '#f59e0b' : '#ffd402')}`,
                              textAlign: 'right'
                            }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: finalCount > 0 ? '#22c55e' : (retouchCount > 0 ? '#f59e0b' : '#ffd402'),
                                display: 'block',
                                marginBottom: '2px'
                              }}>
                                {finalCount > 0 ? '¡Fotos Finales Listas!' : (retouchCount > 0 ? 'En Mesa de Retoque' : 'En Selección')}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#ffffff' }}>
                                {retouchCount > 0 ? `${retouchCount} fotos elegidas` : 'Pendiente de elegir favoritas'}
                              </span>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            paddingTop: '1.2rem'
                          }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (setTab) setTab('galeria:bntm-26001');
                              }}
                              style={{
                                padding: '0.65rem 1.2rem',
                                backgroundColor: '#ffd402',
                                color: '#09090b',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Camera size={14} />
                              <span>1. Seleccionar Fotos</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (setTab) setTab('entrega');
                              }}
                              style={{
                                padding: '0.65rem 1.2rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                color: '#22c55e',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <CheckCircle2 size={14} />
                              <span>2. Fotos Finales (¡Ya quedaron!)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (setTab) setTab('compartir:bntm-26001-compartir');
                              }}
                              style={{
                                padding: '0.65rem 1.2rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <ExternalLink size={14} />
                              <span>Compartir con Invitados</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 2: ZONA FILMMAKER (CON PERMISOS DE USUARIO) ─── */}
            {activeTab === 'filmmaker' && (
              <div>
                {!isFilmmaker ? (
                  /* Locked Screen */
                  <div style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(255, 212, 2, 0.3)',
                    borderRadius: '20px',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '540px',
                    margin: '2rem auto'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.2rem auto'
                    }}>
                      <Lock size={28} />
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#ffffff' }}>
                      Sección Filmmaker & Producción
                    </h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.8rem' }}>
                      Esta área de trabajo está restringida para usuarios con la etiqueta <strong>Filmmaker</strong> en Wix Members.
                    </p>

                    <button
                      type="button"
                      onClick={() => loginAsFilmmaker()}
                      style={{
                        padding: '0.8rem 1.6rem',
                        backgroundColor: '#22c55e',
                        color: '#09090b',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Activar Rol Filmmaker (Acceso Staff)
                    </button>
                  </div>
                ) : (
                  /* Unlocked Filmmaker Section */
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Film size={20} color="#22c55e" />
                          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                            Workspace Filmmaker & Editores
                          </h2>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '4px 0 0 0' }}>
                          Permisos activos: <strong>Etiqueta Filmmaker</strong> · Subida y descarga de fotos en Ultra HD.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (setTab) setTab('filmmaker');
                        }}
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          borderRadius: '10px',
                          padding: '0.55rem 1rem',
                          color: '#22c55e',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Abrir Portal Dedicado (/filmmaker)</span>
                      </button>
                    </div>

                    {/* 3 Filmmaker Subtabs */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '1.5rem',
                      overflowX: 'auto',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: '0.8rem'
                    }}>
                      {stageTabs.map((tab) => {
                        const isActive = filmmakerStage === tab.id;
                        const totalPhotosInTab = sessions.reduce((acc, s) => acc + (s[tab.field]?.length || 0), 0);

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilmmakerStage(tab.id)}
                            style={{
                              backgroundColor: isActive ? 'rgba(255, 212, 2, 0.12)' : 'transparent',
                              border: isActive ? `1.5px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '12px',
                              padding: '0.7rem 1.2rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isActive ? '#ffffff' : '#a1a1aa' }}>
                              {tab.label}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              backgroundColor: isActive ? tab.color : 'rgba(255, 255, 255, 0.08)',
                              color: isActive ? '#09090b' : '#a1a1aa',
                              fontWeight: '700'
                            }}>
                              {totalPhotosInTab}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Filmmaker Sessions Under Selected Stage */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                      {sessions.map((session) => {
                        const stagePhotos = session[currentFilmmakerStageConfig.field] || [];
                        const photoCount = stagePhotos.length;
                        const dateStr = session.fechaDeSesiones 
                          ? new Date(session.fechaDeSesiones).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '14 de Septiembre, 2026';

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
                              gap: '1.2rem'
                            }}
                          >
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
                                  {photoCount} fotos en etapa
                                </span>
                              </div>

                              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                                {session.tipoDeSesi || 'Sesión Fotográfica'}
                              </h3>

                              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <div>Cliente: <strong style={{ color: '#ffffff' }}>{session.usuario || 'Cliente registrado'}</strong></div>
                                <div>Fecha: {dateStr}</div>
                              </div>

                              {/* Interactive Comments */}
                              {editingSessionId === session._id ? (
                                <div style={{
                                  marginTop: '0.8rem',
                                  padding: '0.75rem',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 212, 2, 0.4)',
                                  borderRadius: '8px'
                                }}>
                                  <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows={2}
                                    placeholder="Notas de calibración..."
                                    style={{
                                      width: '100%',
                                      backgroundColor: '#18181b',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      borderRadius: '6px',
                                      color: '#ffffff',
                                      fontSize: '0.78rem',
                                      padding: '0.5rem',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }}>
                                    <button
                                      type="button"
                                      onClick={() => setEditingSessionId(null)}
                                      style={{ background: 'none', border: '1px solid #71717a', color: '#a1a1aa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveComment(session._id)}
                                      style={{ backgroundColor: '#22c55e', border: 'none', color: '#09090b', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}
                                    >
                                      Guardar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{
                                  marginTop: '0.8rem',
                                  padding: '0.65rem 0.9rem',
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                  borderLeft: '2px solid #ffd402',
                                  borderRadius: '0 6px 6px 0',
                                  fontSize: '0.75rem',
                                  color: '#d4d4d8',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <div>
                                    <span style={{ color: '#ffd402', fontWeight: '700', marginRight: '4px' }}>Comentarios:</span>
                                    <span>{session.comentarios || 'Sin notas.'}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSessionId(session._id);
                                      setCommentText(session.comentarios || '');
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#ffd402', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem' }}
                                  >
                                    <Edit3 size={11} />
                                    <span>Editar</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Filmmaker Action Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.8rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveViewerSession(session);
                                  setViewerStageTitle(`${currentFilmmakerStageConfig.label} · ${session.title || session.nmeroDeSesin}`);
                                  setViewerPhotos(session[currentFilmmakerStageConfig.field] || []);
                                }}
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  borderRadius: '8px',
                                  padding: '0.55rem',
                                  fontSize: '0.78rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px'
                                }}
                              >
                                <Eye size={13} />
                                <span>Ver Fotos</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveUploadSession(session);
                                  setUploadTargetStage(filmmakerStage);
                                }}
                                style={{
                                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                  color: '#22c55e',
                                  border: '1px solid rgba(34, 197, 94, 0.3)',
                                  borderRadius: '8px',
                                  padding: '0.55rem',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px'
                                }}
                              >
                                <Camera size={13} />
                                <span>Subir Fotos</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: MIS PAQUETES & CUADROS ─── */}
            {activeTab === 'packages' && (
              <div style={{
                backgroundColor: '#141416',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem', color: '#ffffff' }}>
                  Detalles de tu Paquete & Complementos
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 2rem 0' }}>
                  Resumen de tu cobertura fotográfica y productos seleccionados.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 212, 2, 0.3)'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#ffd402', textTransform: 'uppercase', fontWeight: '700' }}>
                      Paquete Base Contratado
                    </span>
                    <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem 0', color: '#ffffff' }}>
                      Paquete Estándar (15 Fotos)
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0 }}>
                      15 fotografías digitales con retoque fino en piel y color grading cinematográfico.
                    </p>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: '700' }}>
                      Cuadro Fine Art (Upsell)
                    </span>
                    <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem 0', color: '#ffffff' }}>
                      Cuadro Impreso 12x18" con Marco
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0 }}>
                      Incluye 6 fotos extras de regalo en tu selección digital.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* High Res Viewer Modal */}
        {activeViewerSession && (
          <SessionPhotoViewerModal
            isOpen={Boolean(activeViewerSession)}
            onClose={() => setActiveViewerSession(null)}
            photos={viewerPhotos}
            sessionTitle={viewerStageTitle}
          />
        )}

        {/* Uploader Modal */}
        {activeUploadSession && (
          <FilmmakerUploaderModal
            isOpen={Boolean(activeUploadSession)}
            onClose={() => setActiveUploadSession(null)}
            session={activeUploadSession}
            targetStage={uploadTargetStage}
            onPhotosUploaded={(updated) => {
              setSessions(prev => prev.map(s => s._id === updated._id ? updated : s));
            }}
          />
        )}

      </div>
    </div>
  );
}
