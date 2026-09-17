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
  EyeOff,
  MessageSquare,
  RefreshCw,
  Edit3,
  Image as ImageIcon,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import { useWixAuth } from '../context/WixAuthContext';
import { useWixClient } from '../context/WixContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import { useSEO } from '../hooks/useSEO';
import SessionPhotoViewerModal from '../components/SessionPhotoViewerModal';
import FilmmakerUploaderModal from '../components/FilmmakerUploaderModal';
import CheckoutModal from '../components/CheckoutModal';

export default function UserSection({ setTab }) {
  const { 
    currentUser, 
    isLoggedIn, 
    isFilmmaker, 
    login, 
    register, 
    updateProfile, 
    loginAsFilmmaker, 
    loginAsClient, 
    logout 
  } = useWixAuth();
  const { wixClient, isReady } = useWixClient();

  // Active section tab: 'sessions' | 'filmmaker' | 'packages' | 'profile'
  const [activeTab, setActiveTab] = useState('sessions');

  // Auth Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('CDMX');
  const [regRole, setRegRole] = useState('client'); // 'client' | 'filmmaker'
  const [regSessionCode, setRegSessionCode] = useState('BNTM-26001');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sessions from Wix CMS
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Filmmaker sub-tab
  const [filmmakerStage, setFilmmakerStage] = useState('selection'); // 'selection' | 'retouch' | 'final'

  // Viewer & Uploader modals state
  const [activeViewerSession, setActiveViewerSession] = useState(null);
  const [viewerStageTitle, setViewerStageTitle] = useState('');
  const [viewerPhotos, setViewerPhotos] = useState([]);
  const [activeUploadSession, setActiveUploadSession] = useState(null);
  const [uploadTargetStage, setUploadTargetStage] = useState('selection');

  // Interactive comments state
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutInitialData, setCheckoutInitialData] = useState({});

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Dynamic Packages & Extras State
  const [selectedExtrasCount, setSelectedExtrasCount] = useState(4);
  const [selectedIncludeFrame, setSelectedIncludeFrame] = useState(true);

  // SEO metadata
  useSEO({
    title: isLoggedIn 
      ? `Mi Cuenta · ${currentUser?.name || 'Portal de Miembros'} | Buena Toma`
      : 'Iniciar Sesión · Portal de Clientes y Staff | Buena Toma',
    description: 'Accede a tus sesiones fotográficas en alta resolución, selección de pruebas, descarga ultra-HD y mesa de trabajo para filmmakers de Buena Toma.',
    keywords: 'portal clientes buena toma, seleccion fotos, entrega fotos cdmx, filmmaker portal'
  });

  // Load sessions from Wix CMS and merge with local studio cache
  useEffect(() => {
    let isMounted = true;
    async function loadSessions() {
      if (!isReady || !wixClient) return;
      try {
        setLoadingSessions(true);
        let itemsData = [];
        try {
          const res = await wixClient.items.query('Galeria').find();
          itemsData = res.items || [];
        } catch (queryErr) {
          console.warn('[UserSection] Wix CMS Galeria query note:', queryErr?.message || queryErr);
        }

        // Check local storage cross-desk cache
        let localCacheSessions = {};
        try {
          const cached = localStorage.getItem('buenatoma_filmmaker_sessions_cache');
          if (cached) localCacheSessions = JSON.parse(cached);
        } catch {}

        // Check selection cache for client
        let clientSelectedMedia = [];
        try {
          const selRaw = localStorage.getItem('buenatoma_selection_cache');
          if (selRaw) {
            const parsedSel = JSON.parse(selRaw);
            if (parsedSel.selectedWixMedia?.length) {
              clientSelectedMedia = parsedSel.selectedWixMedia;
            }
          }
        } catch {}

        // Fallback default sample session BNTM-26001
        if (itemsData.length === 0) {
          itemsData = [{
            _id: 'default-bntm-26001',
            title: 'BNTM-26001 · Pedida de Mano',
            nmeroDeSesin: 'BNTM-26001',
            usuario: 'Sofía & Alejandro',
            correo: 'sofia.oramas@gmail.com',
            tipoDeSesi: 'Pedida de Mano',
            fechaDeSesin: new Date().toISOString(),
            comentarios: 'Tonalidades cálidas doradas en atardecer, encuadres abiertos y retrato editorial.',
            galeraDeFotos: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
            ],
            galeraDeFotosARetocar: clientSelectedMedia.length ? clientSelectedMedia : [
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
            ],
            galeraDeFotosMostrar: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
            ]
          }];
        }

        // Merge with local cache
        const merged = itemsData.map(item => {
          const id = item._id || item.nmeroDeSesin;
          const overlay = localCacheSessions[id] || {};
          return {
            ...item,
            ...overlay,
            galeraDeFotosARetocar: overlay.galeraDeFotosARetocar?.length 
              ? overlay.galeraDeFotosARetocar 
              : (clientSelectedMedia.length ? clientSelectedMedia : (item.galeraDeFotosARetocar || []))
          };
        });

        if (isMounted) {
          setSessions(merged);
        }
      } finally {
        if (isMounted) setLoadingSessions(false);
      }
    }

    loadSessions();
    return () => { isMounted = false; };
  }, [wixClient, isReady]);

  // Sync profile form when user updates
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileCity(currentUser.city || 'CDMX');
      setProfileAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Por favor ingresa tu correo y tu contraseña.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await login(loginEmail.trim(), loginPassword.trim());
    } catch (err) {
      setAuthError(err.message || 'Error al iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('Por favor completa tu nombre, correo y contraseña.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        phone: regPhone.trim(),
        city: regCity.trim(),
        role: regRole,
        sessionCode: regSessionCode.trim() || 'BNTM-26001',
      });
    } catch (err) {
      setAuthError(err.message || 'Error al registrar la cuenta.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Profile Update Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (newPassword) {
      if (!currentPassword) {
        setProfileErrorMsg('Debes ingresar tu contraseña actual para cambiarla.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setProfileErrorMsg('Las contraseñas nuevas no coinciden.');
        return;
      }
      if (newPassword.length < 6) {
        setProfileErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        city: profileCity.trim(),
        photo: profileAvatar.trim(),
        currentPassword: currentPassword ? currentPassword.trim() : undefined,
        newPassword: newPassword ? newPassword.trim() : undefined,
      });
      setProfileSuccessMsg('¡Perfil actualizado con éxito en Wix Members!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setProfileErrorMsg(err.message || 'Error al guardar los cambios.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save comment to session
  const handleSaveComment = async (sessionId) => {
    const updatedSessions = sessions.map(s => {
      if (s._id === sessionId) {
        return { ...s, comentarios: commentText };
      }
      return s;
    });
    setSessions(updatedSessions);
    setEditingSessionId(null);

    // Save to local cache
    try {
      const cached = JSON.parse(localStorage.getItem('buenatoma_filmmaker_sessions_cache') || '{}');
      cached[sessionId] = { ...(cached[sessionId] || {}), comentarios: commentText };
      localStorage.setItem('buenatoma_filmmaker_sessions_cache', JSON.stringify(cached));
    } catch {}

    // Update in Wix CMS
    const targetSession = updatedSessions.find(s => s._id === sessionId);
    if (wixClient && targetSession) {
      try {
        await wixClient.items.update('Galeria', targetSession);
      } catch (err) {
        console.warn('[UserSection] Note CMS update:', err);
      }
    }
  };

  // Quick Open Checkout
  const handleOpenCheckout = (tipo) => {
    setCheckoutInitialData({
      tipoPago: tipo,
      nombre: currentUser?.name || 'Sofía Oramas',
      correo: currentUser?.email || 'sofia.oramas@gmail.com',
      telefono: currentUser?.phone || '55 1234 5678',
      sessionCode: currentUser?.sessionCode || 'BNTM-26001',
      cantidadExtras: selectedExtrasCount,
      incluyeCuadro: selectedIncludeFrame,
    });
    setIsCheckoutOpen(true);
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
        
        {/* ─── NOT LOGGED IN: LOGIN / REGISTER VIEW (MATCHING RUTAXASIA) ─── */}
        {!isLoggedIn ? (
          <div style={{
            maxWidth: '520px',
            margin: '2rem auto',
            backgroundColor: '#141416',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(212, 175, 55, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--accent-gold, #d4af37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <User size={30} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.4rem', color: '#ffffff', fontFamily: 'var(--font-serif, serif)' }}>
              Portal de <span style={{ color: 'var(--accent-gold, #d4af37)' }}>Usuarios Buena Toma</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.75rem' }}>
              Accede a tus sesiones fotográficas, mesa de selección y panel de producción conectado con Wix Members.
            </p>

            {/* Auth Switcher Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#0d0d0f',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1.75rem'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                style={{
                  padding: '0.65rem',
                  border: 'none',
                  borderRadius: '9px',
                  background: authMode === 'login' ? 'var(--accent-gold, #d4af37)' : 'transparent',
                  color: authMode === 'login' ? '#000' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                style={{
                  padding: '0.65rem',
                  border: 'none',
                  borderRadius: '9px',
                  background: authMode === 'register' ? 'var(--accent-gold, #d4af37)' : 'transparent',
                  color: authMode === 'register' ? '#000' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Crear Cuenta
              </button>
            </div>

            {authError && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                {authError}
              </div>
            )}

            {/* ─── LOGIN FORM ─── */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    Correo electrónico
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="sofia@gmail.com o isaac@buenatoma.mx"
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
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1f1f23',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.8rem 2.8rem 0.8rem 1rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.8rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    backgroundColor: 'var(--accent-gold, #d4af37)',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.95rem',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.5rem',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)',
                    opacity: authLoading ? 0.7 : 1,
                  }}
                >
                  {authLoading ? 'Iniciando sesión...' : 'Ingresar a Mi Cuenta'}
                </button>
              </form>
            )}

            {/* ─── REGISTER FORM ─── */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    Nombre Completo *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Sofía & Alejandro"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#1f1f23',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    Correo Electrónico *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="sofia@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#1f1f23',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    Contraseña (mínimo 6 caracteres) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1f1f23',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.75rem 2.8rem 0.75rem 1rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.8rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>WhatsApp</label>
                    <input 
                      type="tel"
                      placeholder="55 1234 5678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#1f1f23', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Código Sesión</label>
                    <input 
                      type="text"
                      placeholder="BNTM-26001"
                      value={regSessionCode}
                      onChange={(e) => setRegSessionCode(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#1f1f23', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tipo de Acceso</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1f1f23', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="client">Cliente VIP (Selección de fotos y pedidos)</option>
                    <option value="filmmaker">Staff Filmmaker (Mesa de retoque y subida)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    backgroundColor: 'var(--accent-gold, #d4af37)',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.95rem',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.5rem',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)',
                    opacity: authLoading ? 0.7 : 1,
                  }}
                >
                  {authLoading ? 'Registrando cuenta...' : 'Crear Cuenta y Vincular Sesión'}
                </button>
              </form>
            )}

            {/* Quick Demo Acccess Shortcuts */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Accesos de Prueba Rápida (Demo)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => loginAsClient('BNTM-26001')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.8rem',
                    color: '#f4f4f5',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  👤 Entrar como Cliente (Sofía)
                </button>
                <button
                  type="button"
                  onClick={() => loginAsFilmmaker()}
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.8rem',
                    color: 'var(--accent-gold, #d4af37)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  🎬 Entrar como Staff (Isaac)
                </button>
              </div>
            </div>
          </div>
        ) : (

          /* ─── LOGGED IN DASHBOARD ─── */
          <div>
            {/* Top Member Header */}
            <div style={{
              backgroundColor: '#141416',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '1.75rem 2rem',
              marginBottom: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                  alt={currentUser?.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-gold, #d4af37)'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#ffffff', fontFamily: 'var(--font-serif, serif)' }}>
                      {currentUser?.name || 'Mi Cuenta'}
                    </h1>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: isFilmmaker ? 'rgba(212, 175, 55, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: isFilmmaker ? 'var(--accent-gold, #d4af37)' : '#4ade80',
                      border: isFilmmaker ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid rgba(34, 197, 94, 0.35)',
                      padding: '2px 10px',
                      borderRadius: '100px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      letterSpacing: '0.05em'
                    }}>
                      <ShieldCheck size={12} />
                      {isFilmmaker ? 'Etiqueta: Filmmaker (Staff)' : 'Cliente VIP'}
                    </span>
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {currentUser?.email} · {currentUser?.city || 'CDMX'} {currentUser?.sessionCode ? `· Sesión: ${currentUser.sessionCode}` : ''}
                  </p>
                </div>
              </div>

              {/* Header Actions & Testing Role Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', background: '#1c1c20', borderRadius: '10px', padding: '3px' }}>
                  <button
                    type="button"
                    onClick={loginAsClient}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: !isFilmmaker ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: !isFilmmaker ? '#ffffff' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Cliente
                  </button>
                  <button
                    type="button"
                    onClick={loginAsFilmmaker}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isFilmmaker ? 'var(--accent-gold, #d4af37)' : 'transparent',
                      color: isFilmmaker ? '#09090b' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Filmmaker
                  </button>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <LogOut size={13} />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            {/* Main Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('sessions')}
                style={{
                  padding: '0.85rem 1.4rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'sessions' ? '2px solid var(--accent-gold, #d4af37)' : '2px solid transparent',
                  color: activeTab === 'sessions' ? 'var(--accent-gold, #d4af37)' : '#94a3b8',
                  fontWeight: activeTab === 'sessions' ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Camera size={16} />
                <span>Mis Sesiones & Fotos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('filmmaker')}
                style={{
                  padding: '0.85rem 1.4rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'filmmaker' ? '2px solid var(--accent-gold, #d4af37)' : '2px solid transparent',
                  color: activeTab === 'filmmaker' ? 'var(--accent-gold, #d4af37)' : '#94a3b8',
                  fontWeight: activeTab === 'filmmaker' ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Film size={16} />
                <span>Zona Filmmaker (Staff)</span>
                {isFilmmaker && (
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent-gold, #d4af37)', color: '#09090b', padding: '1px 6px', borderRadius: '100px', fontWeight: '800' }}>
                    PRO
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                style={{
                  padding: '0.85rem 1.4rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'packages' ? '2px solid var(--accent-gold, #d4af37)' : '2px solid transparent',
                  color: activeTab === 'packages' ? 'var(--accent-gold, #d4af37)' : '#94a3b8',
                  fontWeight: activeTab === 'packages' ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <ShoppingBag size={16} />
                <span>Mis Paquetes & Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '0.85rem 1.4rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'profile' ? '2px solid var(--accent-gold, #d4af37)' : '2px solid transparent',
                  color: activeTab === 'profile' ? 'var(--accent-gold, #d4af37)' : '#94a3b8',
                  fontWeight: activeTab === 'profile' ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <User size={16} />
                <span>Mi Perfil</span>
              </button>
            </div>

            {/* ─── TAB 1: MIS SESIONES (CLIENT VIEW) ─── */}
            {activeTab === 'sessions' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                      Sesiones Fotográficas Activas
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.3rem 0 0 0' }}>
                      Elige tus tomas favoritas para retoque, descarga tus fotos finales y comparte con invitados.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout('fotos_extras')}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37, #aa8010)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.65rem 1.2rem',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <CreditCard size={15} /> Pagar Extras en Wix
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                  {sessions.map((session) => {
                    const totalPhotos = (session.galeraDeFotos || []).length;
                    const retouchPhotos = (session.galeraDeFotosARetocar || []).length;
                    const finalPhotos = (session.galeraDeFotosMostrar || []).length;
                    const coverImg = session.galeraDeFotos?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

                    return (
                      <div
                        key={session._id}
                        style={{
                          backgroundColor: '#141416',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                          <img 
                            src={coverImg} 
                            alt={session.title || session.tipoDeSesi}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(13,13,15,0.95) 0%, transparent 60%)'
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            left: '1.25rem',
                            right: '1.25rem'
                          }}>
                            <span style={{
                              display: 'inline-block',
                              backgroundColor: 'rgba(212, 175, 55, 0.95)',
                              color: '#09090b',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              marginBottom: '0.3rem',
                              letterSpacing: '0.05em'
                            }}>
                              SESIÓN {session.nmeroDeSesin || 'BNTM-26001'}
                            </span>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                              {session.tipoDeSesi || 'Sesión Fotográfica'}
                            </h3>
                          </div>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                            <span>Cliente: <strong style={{ color: '#ffffff' }}>{session.usuario || currentUser?.name}</strong></span>
                            <span>{totalPhotos} Tomas cargadas</span>
                          </div>

                          {/* Progress Status Bar */}
                          <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '0.8rem 1rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                              <Clock size={14} />
                              <span>EN MESA DE RETOQUE ({retouchPhotos} fotos elegidas)</span>
                            </div>
                            <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: retouchPhotos ? '65%' : '20%', backgroundColor: 'var(--accent-gold, #d4af37)', borderRadius: '10px' }} />
                            </div>
                          </div>

                          {/* Action Shortcuts */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const slug = session.nmeroDeSesin ? session.nmeroDeSesin.toLowerCase() : 'bntm-26001';
                                window.location.href = `/galeria/${slug}`;
                              }}
                              style={{
                                width: '100%',
                                backgroundColor: 'var(--accent-gold, #d4af37)',
                                color: '#09090b',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <CheckCircle2 size={16} />
                              <span>1. Seleccionar Fotos para Retoque</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                window.location.href = '/entrega';
                              }}
                              style={{
                                width: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <Download size={16} />
                              <span>2. Fotos Finales Retocadas ({finalPhotos})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const slug = session.nmeroDeSesin ? session.nmeroDeSesin.toLowerCase() : 'bntm-26001';
                                window.location.href = `/compartir/${slug}`;
                              }}
                              style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: '#94a3b8',
                                border: 'none',
                                padding: '0.5rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px'
                              }}
                            >
                              <ExternalLink size={13} />
                              <span>Compartir Galería con Invitados</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── TAB 2: ZONA FILMMAKER (STAFF) ─── */}
            {activeTab === 'filmmaker' && (
              <div>
                {!isFilmmaker ? (
                  <div style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '2rem auto'
                  }}>
                    <Lock size={40} color="#f87171" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Acceso Restringido a Filmmakers
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      Esta área de trabajo está reservada para usuarios con la etiqueta <strong>Filmmaker</strong> en Wix Members.
                    </p>
                    <button
                      type="button"
                      onClick={loginAsFilmmaker}
                      style={{
                        backgroundColor: 'var(--accent-gold, #d4af37)',
                        color: '#09090b',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      Entrar con Permisos Filmmaker
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Filmmaker Subtabs */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      backgroundColor: '#141416',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '0.6rem',
                      marginBottom: '2rem'
                    }}>
                      {stageTabs.map((stage) => {
                        const isSelected = filmmakerStage === stage.id;
                        return (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => setFilmmakerStage(stage.id)}
                            style={{
                              padding: '0.9rem',
                              borderRadius: '12px',
                              border: 'none',
                              backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                              color: isSelected ? '#ffffff' : '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                          >
                            <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? '800' : '600' }}>
                              {stage.label}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              color: isSelected ? 'var(--accent-gold, #d4af37)' : '#71717a',
                              fontWeight: '600'
                            }}>
                              {stage.badge}
                            </span>
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                bottom: '-6px',
                                width: '30px',
                                height: '2px',
                                backgroundColor: 'var(--accent-gold, #d4af37)'
                              }} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sessions Grid for Current Stage */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                      {sessions.map((session) => {
                        const currentPhotos = session[currentFilmmakerStageConfig.field] || [];
                        const count = currentPhotos.length;
                        const coverImg = currentPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

                        return (
                          <div
                            key={session._id}
                            style={{
                              backgroundColor: '#141416',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '16px',
                              padding: '1.25rem',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              <img 
                                src={coverImg} 
                                alt={session.title}
                                style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                              />
                              <div style={{ flex: 1 }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  color: 'var(--accent-gold, #d4af37)',
                                  fontWeight: '800',
                                  letterSpacing: '0.05em'
                                }}>
                                  {session.nmeroDeSesin || 'BNTM-26001'}
                                </span>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: '0.1rem 0' }}>
                                  {session.tipoDeSesi || 'Sesión Fotográfica'}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                  {session.usuario} · {count} fotos en esta etapa
                                </p>
                              </div>
                            </div>

                            {/* Comment Box */}
                            <div style={{
                              background: 'rgba(255,255,255,0.03)',
                              borderLeft: '2px solid var(--accent-gold, #d4af37)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.78rem'
                            }}>
                              <div style={{ color: 'var(--accent-gold, #d4af37)', fontWeight: '700', marginBottom: '2px' }}>Notas de Retoque:</div>
                              <div style={{ color: '#cbd5e1' }}>{session.comentarios || 'Sin notas.'}</div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
                                  padding: '0.6rem',
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
                                <span>Ver Fotos ({count})</span>
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
                                  padding: '0.6rem',
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

            {/* ─── TAB 3: MIS PAQUETES & CHECKOUT ─── */}
            {activeTab === 'packages' && (
              <div style={{
                backgroundColor: '#141416',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.3rem 0', color: '#ffffff', fontFamily: 'var(--font-serif, serif)' }}>
                      Paquetes Contratados & Extras
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                      Configura tus fotos extras, agrega cuadros Fine Art o liquida tu anticipo con la pasarela oficial de Wix.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout('fotos_extras')}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37, #aa8010)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.8rem 1.6rem',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)'
                    }}
                  >
                    <CreditCard size={17} />
                    <span>Iniciar Wix Checkout</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Base Package Card */}
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold, #d4af37)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.08em' }}>
                      Paquete Base Incluido
                    </span>
                    <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0.2rem 0', color: '#ffffff' }}>
                      15 Fotografías en Alta Resolución
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                      Incluye calibración de color, limpieza de piel y entrega digital sin marcas de agua.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#4ade80', fontSize: '0.8rem', fontWeight: '700' }}>
                      <Check size={14} /> Cubierto por tu reserva base
                    </div>
                  </div>

                  {/* Extra Photos Card */}
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.08em' }}>
                      Retoque Adicional
                    </span>
                    <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0.2rem 0', color: '#ffffff' }}>
                      Fotos Extras ($250 MXN c/u)
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                      Elige tantas fotos extras como desees por encima del paquete base de 15.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout('fotos_extras')}
                      style={{
                        background: 'rgba(96, 165, 250, 0.15)',
                        border: '1px solid rgba(96, 165, 250, 0.35)',
                        color: '#60a5fa',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Pagar Fotos Extras →
                    </button>
                  </div>

                  {/* Cuadro Fine Art Card */}
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(34, 197, 94, 0.35)'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.08em' }}>
                      Impresión & Enmarcado
                    </span>
                    <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0.2rem 0', color: '#ffffff' }}>
                      Cuadro Fine Art ($1,850 MXN)
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                      Papel algodón de grado museo con marco de madera sólida nogal y passepartout libre de ácido.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout('cuadro_fine_art')}
                      style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.35)',
                        color: '#4ade80',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Comprar Cuadro Fine Art →
                    </button>
                  </div>
                </div>

                {/* Anticipo & Liquidación Banner */}
                <div style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', color: '#fff' }}>
                      ¿Deseas apartar una nueva sesión o liquidar tu saldo?
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                      Puedes liquidar tu anticipo de apartado ($1,500 MXN) o liquidar el saldo total de tu producción en línea.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout('anticipo')}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Anticipo ($1,500)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout('liquidacion')}
                      style={{
                        background: 'var(--accent-gold, #d4af37)',
                        border: 'none',
                        color: '#000',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Liquidación ($3,500)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: MI PERFIL (EDIT PROFILE & PASSWORD) ─── */}
            {activeTab === 'profile' && (
              <div style={{
                backgroundColor: '#141416',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '720px'
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#ffffff', fontFamily: 'var(--font-serif, serif)' }}>
                  Configuración de Perfil
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.75rem 0' }}>
                  Actualiza tus datos de contacto registrados en Wix CRM y cambia tu contraseña de acceso.
                </p>

                {profileSuccessMsg && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {profileSuccessMsg}
                  </div>
                )}

                {profileErrorMsg && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {profileErrorMsg}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nombre Completo</label>
                      <input 
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.7rem 0.8rem', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
                      <input 
                        type="email"
                        disabled
                        value={currentUser?.email || ''}
                        style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.7rem 0.8rem', color: '#71717a', fontSize: '0.88rem', boxSizing: 'border-box', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>WhatsApp / Teléfono</label>
                      <input 
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.7rem 0.8rem', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Ciudad</label>
                      <input 
                        type="text"
                        value={profileCity}
                        onChange={(e) => setProfileCity(e.target.value)}
                        style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.7rem 0.8rem', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>URL de Foto de Perfil</label>
                    <input 
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://..."
                      style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.7rem 0.8rem', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Change Password Section */}
                  <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold, #d4af37)', margin: '0 0 0.8rem 0', fontWeight: '700' }}>
                      Cambiar Contraseña (Opcional)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Contraseña Actual</label>
                        <input 
                          type="password"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nueva Contraseña</label>
                          <input 
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Confirmar Nueva</label>
                          <input 
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', background: '#1f1f23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.65rem 0.8rem', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    style={{
                      background: 'var(--accent-gold, #d4af37)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: isSavingProfile ? 'not-allowed' : 'pointer',
                      marginTop: '0.5rem',
                      opacity: isSavingProfile ? 0.7 : 1
                    }}
                  >
                    {isSavingProfile ? 'Guardando en Wix CRM...' : 'Guardar Cambios de Perfil'}
                  </button>
                </form>
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

        {/* Wix Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          initialData={checkoutInitialData}
          onCheckoutSuccess={(res) => {
            console.log('[UserSection] Checkout created:', res);
          }}
        />

      </div>
    </div>
  );
}
