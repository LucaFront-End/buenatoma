import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Check, 
  Download, 
  Play, 
  Pause, 
  Share2, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  MessageCircle, 
  Sparkles, 
  Send, 
  ShoppingBag, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Copy,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { sendLeadToWix } from '../lib/wixLeads';

// Gallery dataset inspired by the reference Pixieset collection with high-res couple photography
const GALLERY_ITEMS = [
  {
    id: 'BT-03180',
    title: 'La Propuesta en el Mirador',
    category: 'La Propuesta',
    url: 'https://images.pixieset.com/222910221/6de7addef4e742ea505cb8c24b4a6e0a-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/6de7addef4e742ea505cb8c24b4a6e0a-large.jpg',
    aspect: 'portrait',
    focal: '85mm · f/1.8 · ISO 100'
  },
  {
    id: 'BT-03192',
    title: 'El Momento del Sí',
    category: 'La Propuesta',
    url: 'https://images.pixieset.com/222910221/ad096127df20fa36454ecaacffc7e737-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/ad096127df20fa36454ecaacffc7e737-large.jpg',
    aspect: 'landscape',
    focal: '35mm · f/2.0 · ISO 120'
  },
  {
    id: 'BT-03194',
    title: 'Abrazo de Promesa',
    category: 'La Propuesta',
    url: 'https://images.pixieset.com/222910221/4924f4abc510d78b8df487f9e3e0cbc7-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/4924f4abc510d78b8df487f9e3e0cbc7-large.jpg',
    aspect: 'portrait',
    focal: '50mm · f/1.4 · ISO 100'
  },
  {
    id: 'BT-03196',
    title: 'Miradas Cómplices',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/de782744dae53f6dd609909102d5ab27-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/de782744dae53f6dd609909102d5ab27-large.jpg',
    aspect: 'portrait',
    focal: '85mm · f/2.2 · ISO 200'
  },
  {
    id: 'BT-03197',
    title: 'Luz Cálida de la Tarde',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/a898177365a7c2f8c56aa2a8544e63e2-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/a898177365a7c2f8c56aa2a8544e63e2-large.jpg',
    aspect: 'landscape',
    focal: '35mm · f/1.8 · ISO 160'
  },
  {
    id: 'BT-03198',
    title: 'Risas Inolvidables',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/252b64b0e6332ba4968c3247a8c99ea6-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/252b64b0e6332ba4968c3247a8c99ea6-large.jpg',
    aspect: 'portrait',
    focal: '50mm · f/2.0 · ISO 100'
  },
  {
    id: 'BT-03200',
    title: 'Detalle de Manos y Anillo',
    category: 'Detalles',
    url: 'https://images.pixieset.com/222910221/21d5090772f6ede110dd952d7ce73885-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/21d5090772f6ede110dd952d7ce73885-large.jpg',
    aspect: 'portrait',
    focal: '105mm Macro · f/2.8 · ISO 250'
  },
  {
    id: 'BT-03205',
    title: 'Paseo al Atardecer',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/c08e541a0b6ffde53dc9f56c5c87515f-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/c08e541a0b6ffde53dc9f56c5c87515f-large.jpg',
    aspect: 'landscape',
    focal: '35mm · f/2.8 · ISO 100'
  },
  {
    id: 'BT-03207',
    title: 'Silueta Romántica',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/e21727cb9ccf98c5f5ded3af93aa0890-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/e21727cb9ccf98c5f5ded3af93aa0890-large.jpg',
    aspect: 'portrait',
    focal: '85mm · f/1.4 · ISO 100'
  },
  {
    id: 'BT-03212',
    title: 'Emoción Espontánea',
    category: 'La Propuesta',
    url: 'https://images.pixieset.com/222910221/9f5471ecc3be9e4123bf14ccca5aaf90-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/9f5471ecc3be9e4123bf14ccca5aaf90-large.jpg',
    aspect: 'portrait',
    focal: '50mm · f/1.8 · ISO 125'
  },
  {
    id: 'BT-03213',
    title: 'Brillo del Diamante',
    category: 'Detalles',
    url: 'https://images.pixieset.com/222910221/0fd198093cfaf88ccb4061bf1308020c-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/0fd198093cfaf88ccb4061bf1308020c-large.jpg',
    aspect: 'landscape',
    focal: '105mm Macro · f/3.2 · ISO 200'
  },
  {
    id: 'BT-03214',
    title: 'Juntos en el Sendero',
    category: 'Retratos',
    url: 'https://images.pixieset.com/222910221/a48e2ba01a4680f345c017de3c5758ee-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/a48e2ba01a4680f345c017de3c5758ee-large.jpg',
    aspect: 'portrait',
    focal: '85mm · f/2.0 · ISO 160'
  },
  {
    id: 'BT-03215',
    title: 'Destello de Felicidad',
    category: 'La Propuesta',
    url: 'https://images.pixieset.com/222910221/159027d3148c5a1e454ea988271702a7-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/159027d3148c5a1e454ea988271702a7-large.jpg',
    aspect: 'portrait',
    focal: '35mm · f/1.4 · ISO 100'
  },
  {
    id: 'BT-03226',
    title: 'La Celebración',
    category: 'Celebración',
    url: 'https://images.pixieset.com/222910221/735953a69eb4a2d646f93c001471a3c2-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/735953a69eb4a2d646f93c001471a3c2-large.jpg',
    aspect: 'landscape',
    focal: '50mm · f/2.5 · ISO 200'
  },
  {
    id: 'BT-03228',
    title: 'Brindis por el Futuro',
    category: 'Celebración',
    url: 'https://images.pixieset.com/222910221/3a011b0ca9781b5d0bd33b2eafa5a391-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/3a011b0ca9781b5d0bd33b2eafa5a391-large.jpg',
    aspect: 'portrait',
    focal: '85mm · f/1.8 · ISO 125'
  },
  {
    id: 'BT-03233',
    title: 'Para Toda la Vida',
    category: 'Celebración',
    url: 'https://images.pixieset.com/222910221/7cadf38ef67ff4703d9f83a0c433764d-large.jpg',
    thumb: 'https://images.pixieset.com/222910221/7cadf38ef67ff4703d9f83a0c433764d-large.jpg',
    aspect: 'landscape',
    focal: '35mm · f/2.0 · ISO 100'
  }
];

export default function ClientGallery({ initialStage = 'selection', setTab }) {
  // Stage state: 'selection' (Etapa 1: Selección de fotos) | 'delivery' (Etapa 2: Ya quedaron / Entrega final)
  const [stage, setStage] = useState(initialStage);
  
  // Selection proofing state
  const [selectedPhotos, setSelectedPhotos] = useState(['BT-03180', 'BT-03192', 'BT-03194', 'BT-03200']);
  const [photoNotes, setPhotoNotes] = useState({});
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  // Modals & Viewers
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeNotePhoto, setActiveNotePhoto] = useState(null);
  const [currentNoteText, setCurrentNoteText] = useState('');
  
  // Client submission form state
  const [clientName, setClientName] = useState('Sofía Oramas & Alejandro');
  const [clientPhone, setClientPhone] = useState('55 1234 5678');
  const [clientEmail, setClientEmail] = useState('sofia.oramas@gmail.com');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const galleryRef = useRef(null);
  const LIMIT_PHOTOS = 10; // Included in standard package

  useSEO({
    title: stage === 'selection' 
      ? 'Selección de Fotografías · Pedida de Mano | Buena Toma' 
      : 'Galería Final · Pedida de Mano (Fotos Listas) | Buena Toma',
    description: 'Portal de clientes de Buena Toma Estudio. Visualiza, selecciona y descarga tu sesión de fotografía profesional en alta resolución.',
    canonical: typeof window !== 'undefined' ? window.location.href : '',
  });

  const categories = ['Todas', 'La Propuesta', 'Retratos', 'Detalles', 'Celebración'];

  const displayedPhotos = GALLERY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    const matchesSelection = !filterSelectedOnly || selectedPhotos.includes(item.id);
    return matchesCategory && matchesSelection;
  });

  // Scroll smoothly to gallery grid
  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle selection of photo
  const togglePhotoSelection = (photoId, e) => {
    if (e) e.stopPropagation();
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(prev => prev.filter(id => id !== photoId));
    } else {
      if (selectedPhotos.length >= LIMIT_PHOTOS) {
        alert(`Has alcanzado el límite de ${LIMIT_PHOTOS} fotografías incluidas en tu paquete. Puedes deseleccionar alguna o agregar fotos extras.`);
        return;
      }
      setSelectedPhotos(prev => [...prev, photoId]);
    }
  };

  // Open note editor for photo
  const openNoteEditor = (item, e) => {
    if (e) e.stopPropagation();
    setActiveNotePhoto(item);
    setCurrentNoteText(photoNotes[item.id] || '');
  };

  const savePhotoNote = () => {
    if (activeNotePhoto) {
      setPhotoNotes(prev => ({
        ...prev,
        [activeNotePhoto.id]: currentNoteText
      }));
      // Auto-select if not already selected
      if (!selectedPhotos.includes(activeNotePhoto.id)) {
        setSelectedPhotos(prev => [...prev, activeNotePhoto.id]);
      }
      setActiveNotePhoto(null);
    }
  };

  // Submit selection to Wix CMS Contacto collection
  const handleSubmitSelection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const notesSummary = selectedPhotos.map(id => {
      const note = photoNotes[id];
      return `- ${id}${note ? ` (Nota: "${note}")` : ''}`;
    }).join('\n');

    const formattedMessage = `Selección de fotos para edición:\n` +
      `Cliente: ${clientName}\n` +
      `Teléfono: ${clientPhone}\n` +
      `Correo: ${clientEmail}\n` +
      `Total seleccionadas: ${selectedPhotos.length} de ${LIMIT_PHOTOS}\n` +
      `Notas generales: ${generalNotes || 'Ninguna'}\n\n` +
      `Fotos seleccionadas:\n${notesSummary}`;

    try {
      await sendLeadToWix({
        nombre: clientName,
        email: clientEmail,
        telefono: clientPhone,
        origen: 'Galería Selección Pixieset (Buena Toma)',
        mensaje: formattedMessage,
        title: `Selección Fotos: ${clientName} (${selectedPhotos.length} fotos) — [Pixieset]`
      });
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error enviando selección a CMS:', err);
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }
  };

  // Slideshow auto-advance timer
  useEffect(() => {
    let timer;
    if (isSlideshowOpen && isSlideshowPlaying) {
      timer = setInterval(() => {
        setSlideshowIndex(prev => (prev + 1) % GALLERY_ITEMS.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshowOpen, isSlideshowPlaying]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((lightboxIndex + 1) % displayedPhotos.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((lightboxIndex - 1 + displayedPhotos.length) % displayedPhotos.length);
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      }
      if (isSlideshowOpen && e.key === 'Escape') {
        setIsSlideshowOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedPhotos.length, isSlideshowOpen]);

  const handleCopyShareLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadSingle = (item, e) => {
    if (e) e.stopPropagation();
    // Simulate image download
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.id}-buenatoma-hd.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5' }} className="fade-in">
      
      {/* ─── STAGE CONTROLLER FLOATING SWITCHER (For Demo & Workflow Inspection) ─── */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          backgroundColor: 'rgba(18, 18, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          borderRadius: '50px',
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px' }}>
          Demostración:
        </span>
        <button
          onClick={() => { setStage('selection'); setFilterSelectedOnly(false); }}
          className="interactive"
          style={{
            padding: '8px 18px',
            borderRadius: '40px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: stage === 'selection' ? '#ffd402' : 'transparent',
            color: stage === 'selection' ? '#09090b' : '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.25s ease'
          }}
        >
          <Heart size={14} fill={stage === 'selection' ? '#09090b' : 'none'} />
          1. Selección de Fotos
        </button>
        <button
          onClick={() => { setStage('delivery'); setFilterSelectedOnly(false); }}
          className="interactive"
          style={{
            padding: '8px 18px',
            borderRadius: '40px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: stage === 'delivery' ? '#22c55e' : 'transparent',
            color: stage === 'delivery' ? '#09090b' : '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.25s ease'
          }}
        >
          <CheckCircle2 size={14} />
          2. ¡Ya quedaron! (Entrega)
        </button>
      </div>

      {/* ─── FULLSCREEN HERO COVER (Like Pixieset /pedidademano) ─── */}
      <section 
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Cover Background Photo */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.pixieset.com/222910221/5701ee37356611ca9b5a7fd4022e2a46-cover.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            filter: 'brightness(0.72)',
            transform: 'scale(1.02)',
            transition: 'transform 8s ease'
          }}
        />

        {/* Ambient Dark Gradients */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.4) 0%, rgba(9,9,11,0.2) 50%, rgba(9,9,11,0.95) 100%)'
        }} />

        {/* Center Editorial Typography */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 1.5rem',
            maxWidth: '850px'
          }}
        >
          {/* Status Badge */}
          <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: stage === 'selection' ? 'rgba(255, 212, 2, 0.15)' : 'rgba(34, 197, 94, 0.15)',
              border: stage === 'selection' ? '1px solid rgba(255, 212, 2, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)',
              color: stage === 'selection' ? '#ffd402' : '#4ade80',
              padding: '0.4rem 1.1rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(10px)'
            }}>
              {stage === 'selection' ? (
                <>
                  <Heart size={14} fill="#ffd402" />
                  Etapa 1: Selección de Fotos para Edición
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Etapa 2: ¡Tus fotos ya quedaron listas!
                </>
              )}
            </span>
          </div>

          <span style={{
            fontSize: '0.9rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.8rem'
          }}>
            BUENA TOMA · COLECCIÓN PRIVADA DE CLIENTE
          </span>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: '300',
            fontFamily: 'serif, Georgia, "Times New Roman"',
            letterSpacing: '0.04em',
            lineHeight: '1.05',
            margin: '0 0 1rem 0',
            color: '#ffffff',
            textShadow: '0 4px 25px rgba(0,0,0,0.6)'
          }}>
            Pedida de Mano
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '300',
            letterSpacing: '0.05em',
            marginBottom: '2.5rem',
            fontStyle: 'italic'
          }}>
            Sofía & Alejandro · 14 de Septiembre, 2026
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={scrollToGallery}
              className="interactive"
              style={{
                backgroundColor: '#ffffff',
                color: '#09090b',
                border: 'none',
                padding: '0.9rem 2.2rem',
                borderRadius: '50px',
                fontSize: '0.88rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffd402';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver Galería ↓
            </button>

            {stage === 'delivery' && (
              <button
                onClick={() => setIsSlideshowOpen(true)}
                className="interactive"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '50px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={16} fill="#ffffff" />
                Iniciar Slideshow
              </button>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={scrollToGallery}
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            animation: 'bounce 2s infinite'
          }}
        >
          <span>Deslizar</span>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.5)' }} />
        </div>
      </section>

      {/* ─── STICKY GALLERY TOOLBAR ─── */}
      <nav 
        ref={galleryRef}
        style={{
          position: 'sticky',
          top: '75px',
          zIndex: 100,
          backgroundColor: 'rgba(9, 9, 11, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0.9rem 2rem'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.2rem',
          maxWidth: '1380px'
        }}>
          {/* Left: Category tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="interactive"
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeCategory === cat ? '#ffffff' : '#71717a',
                  fontWeight: activeCategory === cat ? '600' : '400',
                  fontSize: '0.84rem',
                  letterSpacing: '0.04em',
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                  borderBottom: activeCategory === cat ? '2px solid #ffd402' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {cat} {cat === 'Todas' ? `(${GALLERY_ITEMS.length})` : ''}
              </button>
            ))}
          </div>

          {/* Right: Actions depending on current stage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            
            {/* STAGE 1 (SELECTION) ACTIONS */}
            {stage === 'selection' && (
              <>
                {/* Counter & Filter selected */}
                <button
                  onClick={() => setFilterSelectedOnly(!filterSelectedOnly)}
                  className="interactive"
                  style={{
                    backgroundColor: filterSelectedOnly ? 'rgba(255, 212, 2, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: filterSelectedOnly ? '1px solid #ffd402' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: filterSelectedOnly ? '#ffd402' : '#e4e4e7',
                    padding: '0.45rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={14} fill={selectedPhotos.length > 0 ? '#ffd402' : 'none'} color="#ffd402" />
                  <span>{selectedPhotos.length} / {LIMIT_PHOTOS} seleccionadas</span>
                  {filterSelectedOnly && <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>(Ver todas)</span>}
                </button>

                {/* Submit button */}
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  disabled={selectedPhotos.length === 0}
                  className="btn-premium btn-gold interactive"
                  style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: selectedPhotos.length === 0 ? 0.5 : 1,
                    cursor: selectedPhotos.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={14} />
                  Enviar Selección ({selectedPhotos.length})
                </button>
              </>
            )}

            {/* STAGE 2 (DELIVERY) ACTIONS */}
            {stage === 'delivery' && (
              <>
                <button
                  onClick={() => setIsSlideshowOpen(true)}
                  className="interactive"
                  title="Modo Presentación"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#f4f4f5',
                    padding: '0.45rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Play size={14} />
                  Slideshow
                </button>

                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="btn-premium btn-gold interactive"
                  style={{
                    padding: '0.45rem 1.2rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  Descargar Todo (ZIP)
                </button>

                <button
                  onClick={() => {
                    if (setTab) setTab('cotizador');
                  }}
                  className="interactive"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffd402',
                    padding: '0.45rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <ShoppingBag size={14} />
                  Pedir Cuadros / Impresiones
                </button>
              </>
            )}

            {/* Share button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="interactive"
              title="Compartir Galería"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── STAGE INFO NOTICE BAR ─── */}
      <div style={{
        backgroundColor: stage === 'selection' ? 'rgba(255, 212, 2, 0.05)' : 'rgba(34, 197, 94, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0.85rem 2rem'
      }}>
        <div className="container" style={{ maxWidth: '1380px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {stage === 'selection' ? (
              <Sparkles size={18} style={{ color: '#ffd402', flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            )}
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#d4d4d8' }}>
              {stage === 'selection' ? (
                <>
                  <strong style={{ color: '#ffd402' }}>Modo Selección de Pruebas:</strong> Haz clic en el corazón de cada foto que desees incluir en tu paquete ({selectedPhotos.length}/{LIMIT_PHOTOS} seleccionadas). Puedes añadir notas de retoque haciendo clic en el ícono de nota.
                </>
              ) : (
                <>
                  <strong style={{ color: '#4ade80' }}>¡Tus fotografías han sido editadas!:</strong> Todas las tomas están calibradas en color, exposición y piel por el laboratorio de Buena Toma. Descarga tus favoritas individualmente o la colección completa en alta resolución.
                </>
              )}
            </p>
          </div>

          {stage === 'selection' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '120px', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(selectedPhotos.length / LIMIT_PHOTOS) * 100}%`,
                  backgroundColor: selectedPhotos.length === LIMIT_PHOTOS ? '#4ade80' : '#ffd402',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: '600' }}>
                {LIMIT_PHOTOS - selectedPhotos.length > 0 ? `Quedan ${LIMIT_PHOTOS - selectedPhotos.length}` : 'Límite completado'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── MAIN PHOTO GRID (Masonry / Justified Pixieset Layout) ─── */}
      <main style={{ padding: '3rem 1.5rem 8rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
        
        {displayedPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#71717a' }}>
            <Filter size={42} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '0.5rem' }}>No hay fotografías que mostrar</h3>
            <p style={{ fontSize: '0.9rem' }}>Prueba cambiando el filtro de categorías o desactivando el filtro de seleccionadas.</p>
            <button
              onClick={() => { setActiveCategory('Todas'); setFilterSelectedOnly(false); }}
              style={{
                marginTop: '1rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div 
            style={{
              columns: '3 340px',
              columnGap: '1.2rem',
              width: '100%'
            }}
          >
            {displayedPhotos.map((item, index) => {
              const isSelected = selectedPhotos.includes(item.id);
              const hasNote = Boolean(photoNotes[item.id]);

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="interactive"
                  style={{
                    marginBottom: '1.2rem',
                    breakInside: 'avoid',
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#18181b',
                    cursor: 'pointer',
                    boxShadow: isSelected && stage === 'selection' 
                      ? '0 0 0 3px #ffd402, 0 10px 30px rgba(255, 212, 2, 0.2)' 
                      : '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Photo image */}
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      display: 'block',
                      objectFit: 'cover',
                      transition: 'filter 0.3s ease'
                    }}
                  />

                  {/* Gradient Hover Overlay */}
                  <div 
                    className="gallery-item-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.2) 50%, rgba(9,9,11,0.4) 100%)',
                      opacity: isSelected ? 1 : 0,
                      transition: 'opacity 0.25s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.opacity = '0';
                    }}
                  >
                    {/* Top action row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: '#ffd402',
                        letterSpacing: '0.05em'
                      }}>
                        {item.id}
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Note Button (Selection mode) */}
                        {stage === 'selection' && (
                          <button
                            onClick={(e) => openNoteEditor(item, e)}
                            title={hasNote ? `Nota: "${photoNotes[item.id]}"` : "Agregar nota de retoque"}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: hasNote ? '#ffd402' : 'rgba(0,0,0,0.65)',
                              border: 'none',
                              color: hasNote ? '#09090b' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <FileText size={15} />
                          </button>
                        )}

                        {/* Favorite / Select Button */}
                        {stage === 'selection' ? (
                          <button
                            onClick={(e) => togglePhotoSelection(item.id, e)}
                            title={isSelected ? "Quitar de selección" : "Seleccionar foto"}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#ffd402' : 'rgba(0,0,0,0.65)',
                              border: 'none',
                              color: isSelected ? '#09090b' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Heart size={16} fill={isSelected ? '#09090b' : 'none'} />
                          </button>
                        ) : (
                          /* Download Single (Delivery mode) */
                          <button
                            onClick={(e) => handleDownloadSingle(item, e)}
                            title="Descargar foto en Alta Resolución"
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.65)',
                              border: 'none',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Download size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom label row */}
                    <div>
                      {hasNote && stage === 'selection' && (
                        <div style={{
                          backgroundColor: 'rgba(255, 212, 2, 0.2)',
                          border: '1px solid rgba(255, 212, 2, 0.4)',
                          borderRadius: '6px',
                          padding: '0.35rem 0.6rem',
                          marginBottom: '0.4rem',
                          fontSize: '0.72rem',
                          color: '#ffd402'
                        }}>
                          ✏️ "{photoNotes[item.id]}"
                        </div>
                      )}
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#ffffff' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                          {item.focal}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#ffd402', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner indicator badge when selected */}
                  {isSelected && stage === 'selection' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: '#ffd402',
                      color: '#09090b',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      zIndex: 2
                    }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── FULLSCREEN LIGHTBOX ─── */}
      {lightboxIndex !== null && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            backgroundColor: 'rgba(5, 5, 7, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Lightbox Bar */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.2rem 2rem',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: '#ffd402', fontWeight: '700', letterSpacing: '0.1em' }}>
                {displayedPhotos[lightboxIndex].id} · {displayedPhotos[lightboxIndex].category.toUpperCase()}
              </span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: '600' }}>
                {displayedPhotos[lightboxIndex].title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                {lightboxIndex + 1} de {displayedPhotos.length}
              </span>

              {stage === 'selection' ? (
                <button
                  onClick={(e) => togglePhotoSelection(displayedPhotos[lightboxIndex].id, e)}
                  style={{
                    backgroundColor: selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#ffd402' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#09090b' : '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={16} fill={selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#09090b' : 'none'} />
                  {selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? 'Seleccionada' : 'Seleccionar'}
                </button>
              ) : (
                <button
                  onClick={(e) => handleDownloadSingle(displayedPhotos[lightboxIndex], e)}
                  style={{
                    backgroundColor: '#ffd402',
                    border: 'none',
                    color: '#09090b',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={15} />
                  Descargar HD
                </button>
              )}

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
          </div>

          {/* Center Image Container with Previous/Next Arrows */}
          <div 
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Arrow */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + displayedPhotos.length) % displayedPhotos.length)}
              style={{
                position: 'absolute',
                left: '20px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Lightbox Image */}
            <img
              src={displayedPhotos[lightboxIndex].url}
              alt={displayedPhotos[lightboxIndex].title}
              style={{
                maxHeight: 'calc(80vh - 120px)',
                maxWidth: '90vw',
                objectFit: 'contain',
                borderRadius: '6px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
            />

            {/* Next Arrow */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % displayedPhotos.length)}
              style={{
                position: 'absolute',
                right: '20px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Filmstrip Thumbnails */}
          <div 
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              overflowX: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {displayedPhotos.map((thumb, idx) => (
              <img
                key={thumb.id}
                src={thumb.thumb}
                alt={thumb.title}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  height: '55px',
                  width: '75px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: lightboxIndex === idx ? '2px solid #ffd402' : '2px solid transparent',
                  opacity: lightboxIndex === idx ? 1 : 0.45,
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN SLIDESHOW PRESENTATION (Etapa 2) ─── */}
      {isSlideshowOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Top Slideshow controls */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            zIndex: 10,
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
              style={{
                width: '42px',
                height: '42px',
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
              {isSlideshowPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              onClick={() => setIsSlideshowOpen(false)}
              style={{
                width: '42px',
                height: '42px',
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
              <X size={20} />
            </button>
          </div>

          {/* Slideshow image with smooth fade transition */}
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              key={slideshowIndex}
              src={GALLERY_ITEMS[slideshowIndex].url}
              alt={GALLERY_ITEMS[slideshowIndex].title}
              style={{
                maxHeight: '92vh',
                maxWidth: '92vw',
                objectFit: 'contain',
                animation: 'fadeIn 0.8s ease-in-out'
              }}
            />

            {/* Bottom title banner */}
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '0.6rem 1.6rem',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#ffd402', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {GALLERY_ITEMS[slideshowIndex].id} · {slideshowIndex + 1} de {GALLERY_ITEMS.length}
              </div>
              <div style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: '600' }}>
                {GALLERY_ITEMS[slideshowIndex].title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── NOTE EDITOR MODAL (Etapa 1) ─── */}
      {activeNotePhoto && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1350,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setActiveNotePhoto(null)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#18181b',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img
                src={activeNotePhoto.thumb}
                alt={activeNotePhoto.title}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ffd402', fontWeight: '700' }}>
                  {activeNotePhoto.id}
                </span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', color: '#ffffff' }}>
                  {activeNotePhoto.title}
                </h4>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', fontWeight: '600' }}>
              Instrucciones específicas de retoque para esta foto:
            </label>
            <textarea
              rows={3}
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              placeholder="Ej: Suavizar sombra en el rostro, retocar fondo, dejar en blanco y negro..."
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: '#09090b',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                resize: 'none',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActiveNotePhoto(null)}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#a1a1aa',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={savePhotoNote}
                className="btn-premium btn-gold interactive"
                style={{
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.85rem'
                }}
              >
                Guardar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUBMIT SELECTION MODAL (Etapa 1) ─── */}
      {isSubmitModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#121214',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!submissionSuccess ? (
              <form onSubmit={handleSubmitSelection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd402' }}>
                    <Heart size={20} fill="#ffd402" />
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Confirmar Selección de Fotos
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsSubmitModalOpen(false)} 
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                  Enviar {selectedPhotos.length} fotos a Edición
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.8rem' }}>
                  El equipo de retoque de Buena Toma procesará tus fotografías seleccionadas con calibración de color, suavizado de piel y formato de entrega en Ultra HD.
                </p>

                {/* Selected Thumbnails Carousel Strip */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  {selectedPhotos.map(id => {
                    const item = GALLERY_ITEMS.find(p => p.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} style={{ position: 'relative', flexShrink: 0 }}>
                        <img 
                          src={item.thumb} 
                          alt={item.title} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          fontSize: '0.62rem',
                          color: '#ffd402',
                          padding: '1px 3px',
                          borderRadius: '2px'
                        }}>
                          {id}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Client Info Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.3rem' }}>Nombre / Pareja</label>
                    <input 
                      type="text" 
                      required 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.3rem' }}>WhatsApp / Teléfono</label>
                    <input 
                      type="tel" 
                      required 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.3rem' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.3rem' }}>Notas generales para el fotógrafo</label>
                  <textarea 
                    rows={2}
                    value={generalNotes} 
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="Comentarios adicionales o preferencias de estilo para la edición..."
                    style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.88rem', resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium btn-gold interactive"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Enviando selección a Buena Toma...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Confirmar y Enviar Selección para Edición
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success confirmation state */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.6rem' }}>
                  ¡Selección enviada con éxito!
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto 1.8rem auto' }}>
                  Hemos recibido las <strong>{selectedPhotos.length} fotografías</strong> seleccionadas de tu sesión. El tiempo de entrega de edición es de 3 a 5 días hábiles.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Hola Buena Toma, acabo de enviar mi selección de ${selectedPhotos.length} fotos para la sesión de Pedida de Mano (Sofía & Alejandro).`);
                      window.open(`https://wa.me/525662914092?text=${msg}`, '_blank');
                    }}
                    className="interactive"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.4rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageCircle size={16} />
                    Avisar por WhatsApp
                  </button>

                  <button
                    onClick={() => { setIsSubmitModalOpen(false); setSubmissionSuccess(false); }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.4rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── DOWNLOAD MODAL (Etapa 2) ─── */}
      {isDownloadModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setIsDownloadModalOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#121214',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80' }}>
                <Download size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Descarga de Galería
                </span>
              </div>
              <button 
                onClick={() => setIsDownloadModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
              Descargar Colección Completa
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.8rem' }}>
              Selecciona el formato deseado para descargar las {GALLERY_ITEMS.length} fotografías en un solo archivo ZIP comprimido:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {/* High Res */}
              <div 
                className="glass interactive"
                onClick={() => {
                  alert('Descargando archivo ZIP de Alta Resolución (300 DPI para impresión y cuadros).');
                  setIsDownloadModalOpen(false);
                }}
                style={{
                  padding: '1.2rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                    💎 Alta Resolución Original (300 DPI)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '2px' }}>
                    Ideal para impresión de cuadros, lienzos y álbumes familiares.
                  </div>
                </div>
                <span style={{ color: '#ffd402', fontSize: '0.82rem', fontWeight: '700' }}>
                  ~420 MB →
                </span>
              </div>

              {/* Web optimized */}
              <div 
                className="glass interactive"
                onClick={() => {
                  alert('Descargando archivo ZIP optimizado para Web y Redes Sociales.');
                  setIsDownloadModalOpen(false);
                }}
                style={{
                  padding: '1.2rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                    📱 Formato Web & Redes Sociales (1080p)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '2px' }}>
                    Optimizado para compartir en Instagram, WhatsApp y enviar por correo.
                  </div>
                </div>
                <span style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: '700' }}>
                  ~65 MB →
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
              🔒 Enlace seguro respaldado en los servidores de Buena Toma Estudio CDMX.
            </div>
          </div>
        </div>
      )}

      {/* ─── SHARE MODAL ─── */}
      {isShareModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#121214',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                Compartir Galería
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Comparte este enlace con tus familiares y amigos para que puedan revivir cada momento de tu sesión:
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#09090b',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem 0.4rem 1rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {typeof window !== 'undefined' ? window.location.href : 'https://buenatoma.mx/pedidademano'}
              </span>
              <button
                onClick={handleCopyShareLink}
                style={{
                  backgroundColor: copiedLink ? '#4ade80' : '#ffd402',
                  color: '#09090b',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <button
              onClick={() => {
                const text = encodeURIComponent(`Mira las fotos de nuestra sesión con Buena Toma Estudio: ${window.location.href}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <MessageCircle size={18} />
              Compartir por WhatsApp
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
