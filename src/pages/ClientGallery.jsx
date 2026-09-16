import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Filter,
  Package,
  Plus,
  ChevronDown,
  ShieldCheck,
  Film,
  Camera
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { sendLeadToWix } from '../lib/wixLeads';
import { useWixClient } from '../context/WixContext';
import { normalizeGalleryItem } from '../lib/wixMedia';
import PasswordGate from '../components/PasswordGate';
import FloatingCheckoutTicket, { CUADRO_UPSELL_PRICE, CUADRO_INCLUDED_EXTRAS } from '../components/FloatingCheckoutTicket';
import VideoReelSection from '../components/VideoReelSection';

// Client session packages definition
export const SESSION_PACKAGES = [
  {
    id: 'esencial',
    name: 'Paquete Esencial',
    included: 10,
    price: 1999,
    badge: '10 Fotos Incluidas',
    description: '10 fotografías digitales de alta resolución con retoque fino.'
  },
  {
    id: 'estandar',
    name: 'Paquete Estándar',
    included: 15,
    price: 2799,
    badge: '15 Fotos (Base)',
    description: '15 fotografías digitales con retoque profesional + galería privada.'
  },
  {
    id: 'deluxe',
    name: 'Paquete Deluxe',
    included: 25,
    price: 4000,
    badge: '25 Fotos (Popular)',
    description: '25 fotografías retocadas de gala + 1 cuadro impreso.'
  },
  {
    id: 'completo',
    name: 'Paquete Todo Incluido',
    included: 40,
    price: 5500,
    badge: '40 Fotos Completas',
    description: '40 fotografías digitales con etalonaje cinematográfico completo.'
  }
];

export const EXTRA_PHOTO_PRICE = 150; // $150 MXN per additional photo beyond package

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

export default function ClientGallery({ initialStage = 'selection', setTab, slug = '' }) {
  const { wixClient, isReady } = useWixClient();

  // Stage state: 'selection' (Etapa 1: Selección de fotos) | 'delivery' (Etapa 2: Ya quedaron / Entrega final)
  const [stage, setStage] = useState(initialStage);
  
  // Authentication gate state
  const [isUnlocked, setIsUnlocked] = useState(false);

  // CMS Session data & photos
  const [cmsSession, setCmsSession] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState(GALLERY_ITEMS);
  const [loadingCMS, setLoadingCMS] = useState(false);

  // Active Media Type filter: 'photos' | 'video' (strictly photos vs video)
  const [activeMediaType, setActiveMediaType] = useState('photos');

  // Package Selection & Extras state
  const [selectedPackageId, setSelectedPackageId] = useState('estandar');
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Cuadro Upsell ($499 MXN includes 6 extra photos)
  const [hasCuadroUpsell, setHasCuadroUpsell] = useState(false);

  // Generated Slugs upon submit
  const [generatedShareSlug, setGeneratedShareSlug] = useState('');
  const [generatedRetouchSlug, setGeneratedRetouchSlug] = useState('');

  // Selection proofing state
  const [selectedPhotos, setSelectedPhotos] = useState(['BT-03180', 'BT-03192', 'BT-03194', 'BT-03200']);
  const [photoNotes, setPhotoNotes] = useState({});
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);
  
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

  // Fetch session data from Wix CMS Galeria collection
  useEffect(() => {
    let cancelled = false;

    async function loadCmsSession() {
      if (!isReady || !wixClient) return;

      try {
        setLoadingCMS(true);
        const search = (slug || '').trim().toLowerCase();

        const res = await wixClient.items.query('Galeria').find();
        const found = res.items.find(it => 
          (it.title && it.title.toLowerCase() === search) ||
          (it.nmeroDeSesin && it.nmeroDeSesin.toLowerCase() === search) ||
          (it.slugDeGaleraMostrar && it.slugDeGaleraMostrar.toLowerCase() === search) ||
          (it._id === search)
        ) || res.items[0];

        if (cancelled) return;

        if (found) {
          setCmsSession(found);
          if (found.usuario) setClientName(found.usuario);
          if (found.cantidadDeFotos) {
            const matchingPkg = SESSION_PACKAGES.find(p => p.included === Number(found.cantidadDeFotos));
            if (matchingPkg) setSelectedPackageId(matchingPkg.id);
          }

          const rawPhotos = found.galeraDeFotos || [];
          if (rawPhotos.length > 0) {
            const normalized = rawPhotos.map((p, idx) => normalizeGalleryItem(p, idx));
            setGalleryPhotos(normalized);
            // Default select first 4 photos for smooth proofing
            if (normalized.length >= 4) {
              setSelectedPhotos([normalized[0].id, normalized[1].id, normalized[2].id, normalized[3].id]);
            }
          }
        }
        setLoadingCMS(false);
      } catch (err) {
        console.warn('[ClientGallery] Error loading Galeria from CMS:', err);
        setLoadingCMS(false);
      }
    }

    loadCmsSession();
    return () => { cancelled = true; };
  }, [wixClient, isReady, slug]);

  // Session metadata
  const sessionCode = cmsSession?.nmeroDeSesin || cmsSession?.title || 'BNTM-26001';
  const sessionTitle = cmsSession?.tipoDeSesi || 'Pedida de Mano';
  const sessionPassword = cmsSession?.contrasea || '';

  // Dynamic Package & Extra Photos Calculations
  const currentPackage = SESSION_PACKAGES.find(p => p.id === selectedPackageId) || SESSION_PACKAGES[1];
  const packageLimit = cmsSession?.cantidadDeFotos ? Number(cmsSession.cantidadDeFotos) : currentPackage.included;
  const totalSelected = selectedPhotos.length;
  const includedCount = Math.min(totalSelected, packageLimit);
  const extraCount = Math.max(0, totalSelected - packageLimit);

  // Extra photo calculations with Cuadro Upsell ($499 MXN includes 6 extra photos)
  const costWithoutCuadro = extraCount * EXTRA_PHOTO_PRICE;
  const remainingExtrasWithCuadro = Math.max(0, extraCount - CUADRO_INCLUDED_EXTRAS);
  const costWithCuadro = CUADRO_UPSELL_PRICE + (remainingExtrasWithCuadro * EXTRA_PHOTO_PRICE);
  const extraPhotosCost = hasCuadroUpsell ? costWithCuadro : costWithoutCuadro;

  useSEO({
    title: stage === 'selection' 
      ? `Selección de Fotografías · ${sessionTitle} | Buena Toma` 
      : `Galería Final · ${sessionTitle} (Fotos Listas) | Buena Toma`,
    description: 'Portal de clientes de Buena Toma Estudio. Visualiza, selecciona y descarga tu sesión de fotografía profesional en alta resolución.',
    canonical: typeof window !== 'undefined' ? window.location.href : '',
  });

  // Lock body scroll when any modal or fullscreen viewer is active
  useEffect(() => {
    const isAnyModalActive = lightboxIndex !== null || isSlideshowOpen || isSubmitModalOpen || isDownloadModalOpen || isShareModalOpen || !!activeNotePhoto;
    if (isAnyModalActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, isSlideshowOpen, isSubmitModalOpen, isDownloadModalOpen, isShareModalOpen, activeNotePhoto]);

  // Anti-download keyboard shortcut guard
  useEffect(() => {
    const handleKeySecurity = (e) => {
      // Block Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, Ctrl+U
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setToastMessage('Descarga directa deshabilitada por protección de derechos de autor.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    };
    window.addEventListener('keydown', handleKeySecurity);
    return () => window.removeEventListener('keydown', handleKeySecurity);
  }, []);

  const displayedPhotos = galleryPhotos.filter((item) => {
    const matchesSelection = !filterSelectedOnly || selectedPhotos.includes(item.id);
    return matchesSelection;
  });

  // Scroll smoothly to gallery grid
  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle selection of photo - seamlessly adds extra photos without blocking!
  const togglePhotoSelection = (photoId, e) => {
    if (e) e.stopPropagation();
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(prev => prev.filter(id => id !== photoId));
    } else {
      const nextCount = selectedPhotos.length + 1;
      setSelectedPhotos(prev => [...prev, photoId]);
      
      if (nextCount > packageLimit) {
        const thisExtraNumber = nextCount - packageLimit;
        setToastMessage(`✨ ¡Foto extra #${thisExtraNumber} agregada! (+$${EXTRA_PHOTO_PRICE} MXN)`);
      } else {
        setToastMessage(`✓ Foto seleccionada (${nextCount} de ${packageLimit} incluidas)`);
      }
      setTimeout(() => setToastMessage(''), 3000);
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

  // Submit selection to Wix CMS Galeria and Enlacesdecompartir
  const handleSubmitSelection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shareSlug = `${sessionCode.toLowerCase()}-compartir`;
    const retouchSlug = `${sessionCode.toLowerCase()}-retocar`;
    setGeneratedShareSlug(shareSlug);
    setGeneratedRetouchSlug(retouchSlug);

    // Filter raw Wix media items for selected photos
    const selectedWixMedia = (cmsSession?.galeraDeFotos || []).filter(rawPhoto => {
      const rawId = rawPhoto.id || rawPhoto.slug || rawPhoto.fileName;
      return selectedPhotos.some(selId => selId === rawId || selId === rawPhoto.slug || selId === rawPhoto.fileName);
    });

    const fallbackSelectedWixMedia = selectedWixMedia.length > 0 ? selectedWixMedia : selectedPhotos.map((id, idx) => {
      const p = galleryPhotos.find(gp => gp.id === id);
      return p?.originalItem || {
        fileName: p?.fileName || `${id}.jpg`,
        title: p?.title || id,
        src: p?.rawSrc || p?.url,
        type: 'image'
      };
    });

    // 1. Update 'Galeria' collection in Wix CMS
    if (wixClient && cmsSession?._id) {
      try {
        await wixClient.items.update('Galeria', {
          ...cmsSession,
          galeraDeFotosARetocar: fallbackSelectedWixMedia,
          slugDeGaleraFinal: retouchSlug,
          slugDeGaleraMostrar: shareSlug
        });
        console.log('[ClientGallery] Successfully updated Galeria with retouch list.');
      } catch (cmsErr) {
        console.warn('[ClientGallery] Could not update Galeria in CMS:', cmsErr);
      }

      // 2. Save entry to 'Enlacesdecompartir' collection in Wix CMS
      try {
        await wixClient.items.save('Enlacesdecompartir', {
          title: sessionCode,
          slug: shareSlug,
          galeria: fallbackSelectedWixMedia,
          tipoDeSesin: sessionTitle
        });
        console.log('[ClientGallery] Successfully saved Enlacesdecompartir in CMS.');
      } catch (enlaceErr) {
        console.warn('[ClientGallery] Could not save Enlacesdecompartir in CMS:', enlaceErr);
      }
    }

    // 3. Prepare full itemized lead notification
    const notesSummary = selectedPhotos.map((id, index) => {
      const note = photoNotes[id];
      const isExtra = index >= packageLimit;
      return `- ${id}${isExtra ? ' [FOTO EXTRA]' : ' [Incluida]'}${note ? ` (Nota: "${note}")` : ''}`;
    }).join('\n');

    const formattedMessage = `Selección de fotos para edición:\n` +
      `Sesión: ${sessionCode} (${sessionTitle})\n` +
      `Cliente: ${clientName}\n` +
      `Teléfono: ${clientPhone}\n` +
      `Correo: ${clientEmail}\n` +
      `Paquete: ${currentPackage.name} (${packageLimit} fotos incluidas)\n` +
      `Fotos incluidas elegidas: ${includedCount} de ${packageLimit}\n` +
      (extraCount > 0 ? `Fotos extras: ${extraCount} fotos adicionales\n` : '') +
      (hasCuadroUpsell ? `Cuadro Fino agregado: SÍ (+$${CUADRO_UPSELL_PRICE} MXN incluye 6 extras)\n` : 'Cuadro Fino: No agregado\n') +
      `Total inversión extra a pagar: $${extraPhotosCost.toLocaleString('es-MX')} MXN\n` +
      `Enlace Compartido creado: /compartir/${shareSlug}\n` +
      `Enlace Retoque Editor: /retocar/${retouchSlug}\n` +
      `Notas generales: ${generalNotes || 'Ninguna'}\n\n` +
      `Desglose de fotos seleccionadas:\n${notesSummary}`;

    try {
      await sendLeadToWix({
        nombre: clientName,
        email: clientEmail,
        telefono: clientPhone,
        origen: `Galería Selección (${sessionCode} - ${currentPackage.name})`,
        mensaje: formattedMessage,
        title: `Selección: ${clientName} (${totalSelected} fotos${extraPhotosCost > 0 ? ` | +$${extraPhotosCost} extras` : ''}) — [${sessionCode}]`
      });
    } catch (err) {
      console.error('Error enviando selección a CMS Contacto:', err);
    }

    setSubmissionSuccess(true);
    setIsSubmitting(false);
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
      
      {/* ─── PASSWORD GATE (ESTILO DILO) ─── */}
      {!isUnlocked && (
        <PasswordGate
          sessionCode={sessionCode}
          sessionTitle={sessionTitle}
          clientName={clientName}
          correctPassword={sessionPassword}
          onUnlock={() => setIsUnlocked(true)}
        />
      )}

      {/* ─── FLOATING TOAST NOTIFICATION BANNER ─── */}
      {toastMessage && (
        <div 
          style={{
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
            boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 15px rgba(255, 212, 2, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: '600',
            animation: 'fadeIn 0.25s ease-out',
            pointerEvents: 'none'
          }}
        >
          <Sparkles size={18} color="#ffd402" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          {/* Left: Strictly Fotos vs Video filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => setActiveMediaType('photos')}
              className="interactive"
              style={{
                backgroundColor: activeMediaType === 'photos' ? '#ffd402' : 'rgba(255, 255, 255, 0.06)',
                color: activeMediaType === 'photos' ? '#09090b' : '#a1a1aa',
                border: 'none',
                borderRadius: '30px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Camera size={15} />
              <span>Fotos ({galleryPhotos.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaType('video')}
              className="interactive"
              style={{
                backgroundColor: activeMediaType === 'video' ? '#ffd402' : 'rgba(255, 255, 255, 0.06)',
                color: activeMediaType === 'video' ? '#09090b' : '#a1a1aa',
                border: 'none',
                borderRadius: '30px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Film size={15} />
              <span>Video Reel</span>
            </button>
          </div>

          {/* Right: Actions depending on current stage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            
            {/* STAGE 1 (SELECTION) ACTIONS */}
            {stage === 'selection' && (
              <>
                {/* Package Selector Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsPackageDropdownOpen(!isPackageDropdownOpen)}
                    className="interactive"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 212, 2, 0.3)',
                      color: '#ffd402',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                    title="Cambiar paquete contratado"
                  >
                    <Package size={14} />
                    <span>{currentPackage.name} ({packageLimit} fotos)</span>
                    <ChevronDown size={13} style={{ transform: isPackageDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Package Selector Dropdown Menu */}
                  {isPackageDropdownOpen && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        zIndex: 200,
                        backgroundColor: '#18181b',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '0.5rem',
                        minWidth: '260px',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                        animation: 'fadeIn 0.2s ease-out'
                      }}
                    >
                      <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
                        Selecciona tu Paquete:
                      </div>
                      {SESSION_PACKAGES.map((pkg) => {
                        const isCurrent = pkg.id === selectedPackageId;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackageId(pkg.id);
                              setIsPackageDropdownOpen(false);
                              setToastMessage(`Paquete actualizado a ${pkg.name} (${pkg.included} fotos incluidas).`);
                              setTimeout(() => setToastMessage(''), 3000);
                            }}
                            className="interactive"
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              backgroundColor: isCurrent ? 'rgba(255, 212, 2, 0.12)' : 'transparent',
                              border: isCurrent ? '1px solid rgba(255, 212, 2, 0.3)' : '1px solid transparent',
                              cursor: 'pointer',
                              marginBottom: '4px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: isCurrent ? '700' : '500', color: isCurrent ? '#ffd402' : '#f4f4f5' }}>
                                {pkg.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                                {pkg.included} fotos incluidas · ${pkg.price.toLocaleString('es-MX')} MXN
                              </div>
                            </div>
                            {isCurrent && <Check size={14} color="#ffd402" />}
                          </div>
                        );
                      })}
                      <div style={{ padding: '6px 10px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px', fontSize: '0.72rem', color: '#71717a' }}>
                        Fotos adicionales: +${EXTRA_PHOTO_PRICE} MXN c/u
                      </div>
                    </div>
                  )}
                </div>

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
                  <Heart size={14} fill={totalSelected > 0 ? '#ffd402' : 'none'} color="#ffd402" />
                  <span>
                    {includedCount} / {packageLimit} incluidas
                    {extraCount > 0 && (
                      <strong style={{ color: '#f59e0b', marginLeft: '6px' }}>
                        +{extraCount} extras (+${extraPhotosCost.toLocaleString('es-MX')} MXN)
                      </strong>
                    )}
                  </span>
                  {filterSelectedOnly && <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>(Ver todas)</span>}
                </button>

                {/* Submit button */}
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  disabled={totalSelected === 0}
                  className="btn-premium btn-gold interactive"
                  style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: totalSelected === 0 ? 0.5 : 1,
                    cursor: totalSelected === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={14} />
                  Enviar Selección ({totalSelected})
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
        <div className="container" style={{ maxWidth: '1380px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '820px' }}>
            {stage === 'selection' ? (
              <Sparkles size={18} style={{ color: '#ffd402', flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            )}
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#d4d4d8', lineHeight: '1.4' }}>
              {stage === 'selection' ? (
                <>
                  <strong style={{ color: '#ffd402' }}>Modo Selección de Pruebas:</strong> Tu {currentPackage.name} incluye <strong style={{ color: '#ffd402' }}>{packageLimit} fotografías</strong>. Si deseas más fotos, cada toma adicional se suma como extra a <strong style={{ color: '#f59e0b' }}>${EXTRA_PHOTO_PRICE} MXN</strong> con retoque profesional completo.
                </>
              ) : (
                <>
                  <strong style={{ color: '#4ade80' }}>¡Tus fotografías han sido editadas!:</strong> Todas las tomas están calibradas en color, exposición y piel por el laboratorio de Buena Toma. Descarga tus favoritas individualmente o la colección completa en alta resolución.
                </>
              )}
            </p>
          </div>

          {stage === 'selection' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '130px', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (totalSelected / packageLimit) * 100)}%`,
                  backgroundColor: extraCount > 0 ? '#f59e0b' : totalSelected === packageLimit ? '#4ade80' : '#ffd402',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: extraCount > 0 ? '#f59e0b' : '#a1a1aa', fontWeight: '700' }}>
                {extraCount > 0 
                  ? `+${extraCount} fotos extras (+${extraPhotosCost.toLocaleString('es-MX')} MXN)` 
                  : `${packageLimit - totalSelected} restantes de tu paquete`}
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
              const selectionIndex = selectedPhotos.indexOf(item.id);
              const isSelected = selectionIndex !== -1;
              const isExtra = isSelected && selectionIndex >= packageLimit;
              const hasNote = Boolean(photoNotes[item.id]);

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setToastMessage('Fotografías protegidas por derechos de autor de Buena Toma Estudio.');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="interactive"
                  style={{
                    marginBottom: '1.2rem',
                    breakInside: 'avoid',
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#18181b',
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    boxShadow: isSelected && stage === 'selection' 
                      ? (isExtra 
                          ? '0 0 0 3px #f59e0b, 0 10px 30px rgba(245, 158, 11, 0.35)' 
                          : '0 0 0 3px #ffd402, 0 10px 30px rgba(255, 212, 2, 0.25)') 
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
                  {/* Transparent Anti-Download Shield */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                      userSelect: 'none'
                    }}
                  />

                  {/* Proofing Watermark in Selection Stage */}
                  {stage === 'selection' && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-25deg)',
                        pointerEvents: 'none',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                        fontSize: 'clamp(0.8rem, 1.8vw, 1.15rem)',
                        fontWeight: '900',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.22)',
                        textShadow: '0 0 10px rgba(0,0,0,0.7)',
                        userSelect: 'none'
                      }}
                    >
                      BUENA TOMA · PRUEBA
                    </div>
                  )}

                  {/* Photo image */}
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      width: '100%',
                      display: 'block',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      transition: 'filter 0.3s ease'
                    }}
                  />

                  {/* Gradient Hover Overlay */}
                  <div 
                    className="gallery-item-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 3,
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
                        color: isExtra ? '#f59e0b' : '#ffd402',
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
                              backgroundColor: isSelected ? (isExtra ? '#f59e0b' : '#ffd402') : 'rgba(0,0,0,0.65)',
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
                          /* Download Single (Delivery mode only) */
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
                        <span style={{ fontSize: '0.72rem', color: isExtra ? '#f59e0b' : '#ffd402', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
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
                      backgroundColor: isExtra ? '#f59e0b' : '#ffd402',
                      color: '#09090b',
                      borderRadius: isExtra ? '20px' : '50%',
                      padding: isExtra ? '4px 10px' : '0',
                      width: isExtra ? 'auto' : '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      zIndex: 4,
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      letterSpacing: '0.04em'
                    }}>
                      {isExtra ? (
                        <>
                          <Sparkles size={12} fill="#09090b" />
                          <span>+ Extra (${EXTRA_PHOTO_PRICE})</span>
                        </>
                      ) : (
                        <Check size={15} strokeWidth={3} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── VIDEO REEL SECTION (Gift Reel) ─── */}
      {activeMediaType === 'video' && (
        <VideoReelSection
          title="Reel Cinemático de Regalo"
          subtitle={`Edición conmemorativa de ${sessionTitle} para tus redes sociales`}
        />
      )}

      {/* ─── FLOATING CHECKOUT TICKET (Etapa 1: Selección) ─── */}
      {stage === 'selection' && (
        <FloatingCheckoutTicket
          totalSelected={totalSelected}
          includedLimit={packageLimit}
          hasCuadroUpsell={hasCuadroUpsell}
          setHasCuadroUpsell={setHasCuadroUpsell}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />
      )}

      {/* ─── FULLSCREEN LIGHTBOX (PORTAL AT ROOT BODY LEVEL) ─── */}
      {lightboxIndex !== null && typeof document !== 'undefined' && createPortal(
        <div 
          id="fullscreen-lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999, // Immune to parent stacking context, strictly above navbar
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
              padding: '1.25rem 2rem',
              position: 'relative',
              zIndex: 1000000,
              backgroundColor: 'rgba(9, 9, 11, 0.92)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#ffd402', fontWeight: '700', letterSpacing: '0.1em' }}>
                  {displayedPhotos[lightboxIndex].id} · {displayedPhotos[lightboxIndex].category.toUpperCase()}
                </span>
                {stage === 'selection' && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: selectedPhotos.indexOf(displayedPhotos[lightboxIndex].id) >= packageLimit
                      ? 'rgba(245, 158, 11, 0.2)'
                      : selectedPhotos.includes(displayedPhotos[lightboxIndex].id)
                        ? 'rgba(255, 212, 2, 0.2)'
                        : 'rgba(255, 255, 255, 0.08)',
                    color: selectedPhotos.indexOf(displayedPhotos[lightboxIndex].id) >= packageLimit
                      ? '#f59e0b'
                      : selectedPhotos.includes(displayedPhotos[lightboxIndex].id)
                        ? '#ffd402'
                        : '#a1a1aa'
                  }}>
                    {selectedPhotos.indexOf(displayedPhotos[lightboxIndex].id) >= packageLimit
                      ? `★ Foto Extra (+${EXTRA_PHOTO_PRICE} MXN)`
                      : selectedPhotos.includes(displayedPhotos[lightboxIndex].id)
                        ? '✓ Incluida en Paquete'
                        : 'Sin seleccionar'}
                  </span>
                )}
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: '600' }}>
                {displayedPhotos[lightboxIndex].title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                {lightboxIndex + 1} de {displayedPhotos.length}
              </span>

              {stage === 'selection' ? (
                <button
                  onClick={(e) => togglePhotoSelection(displayedPhotos[lightboxIndex].id, e)}
                  className="interactive"
                  style={{
                    backgroundColor: selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#ffd402' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#09090b' : '#ffffff',
                    padding: '0.55rem 1.2rem',
                    borderRadius: '25px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={16} fill={selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? '#09090b' : 'none'} />
                  {selectedPhotos.includes(displayedPhotos[lightboxIndex].id) ? 'Seleccionada' : 'Seleccionar'}
                </button>
              ) : (
                <button
                  onClick={(e) => handleDownloadSingle(displayedPhotos[lightboxIndex], e)}
                  className="interactive"
                  style={{
                    backgroundColor: '#ffd402',
                    border: 'none',
                    color: '#09090b',
                    padding: '0.55rem 1.2rem',
                    borderRadius: '25px',
                    fontSize: '0.84rem',
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

              {/* High-contrast Prominent Close Button */}
              <button
                id="lightbox-close-btn"
                onClick={() => setLightboxIndex(null)}
                className="interactive"
                title="Cerrar visualizador (Esc)"
                aria-label="Cerrar"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={22} strokeWidth={2.5} />
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
              padding: '0 4rem',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Anti-download protection shield */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 5,
                userSelect: 'none'
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setToastMessage('Fotografías protegidas por derechos de autor de Buena Toma Estudio.');
                setTimeout(() => setToastMessage(''), 3000);
              }}
            />

            {/* Proofing Watermark in Lightbox for Selection Stage */}
            {stage === 'selection' && (
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-25deg)',
                  pointerEvents: 'none',
                  zIndex: 6,
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(1.5rem, 4.5vw, 3.2rem)',
                  fontWeight: '900',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.22)',
                  textShadow: '0 0 25px rgba(0,0,0,0.85)',
                  userSelect: 'none'
                }}
              >
                BUENA TOMA · MUESTRA DE SELECCIÓN
              </div>
            )}

            {/* Prev Arrow */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + displayedPhotos.length) % displayedPhotos.length)}
              className="interactive"
              style={{
                position: 'absolute',
                left: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={26} />
            </button>

            {/* Main Lightbox Image */}
            <img
              src={displayedPhotos[lightboxIndex].url}
              alt={displayedPhotos[lightboxIndex].title}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                maxHeight: 'calc(80vh - 120px)',
                maxWidth: '90vw',
                objectFit: 'contain',
                borderRadius: '6px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />

            {/* Next Arrow */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % displayedPhotos.length)}
              className="interactive"
              style={{
                position: 'absolute',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {/* Bottom Filmstrip Thumbnails */}
          <div 
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              overflowX: 'auto',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {displayedPhotos.map((thumb, idx) => (
              <img
                key={thumb.id}
                src={thumb.thumb}
                alt={thumb.title}
                draggable={false}
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
        </div>,
        document.body
      )}

      {/* ─── FULLSCREEN SLIDESHOW PRESENTATION (Etapa 2 - PORTAL) ─── */}
      {isSlideshowOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="fullscreen-slideshow"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
          }}
        >
          {/* Top Slideshow controls */}
          <div style={{
            position: 'absolute',
            top: '25px',
            right: '25px',
            zIndex: 1000000,
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
              className="interactive"
              title={isSlideshowPlaying ? "Pausar presentación" : "Reproducir presentación"}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSlideshowPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              onClick={() => setIsSlideshowOpen(false)}
              className="interactive"
              title="Cerrar presentación (Esc)"
              aria-label="Cerrar"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Transparent Anti-Download Shield for Slideshow */}
          <div 
            style={{ position: 'absolute', inset: 0, zIndex: 5 }} 
            onContextMenu={(e) => {
              e.preventDefault();
              setToastMessage('Fotografías protegidas por derechos de autor de Buena Toma Estudio.');
              setTimeout(() => setToastMessage(''), 3000);
            }}
          />

          {/* Slideshow image with smooth fade transition */}
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              key={slideshowIndex}
              src={GALLERY_ITEMS[slideshowIndex].url}
              alt={GALLERY_ITEMS[slideshowIndex].title}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                maxHeight: '92vh',
                maxWidth: '92vw',
                objectFit: 'contain',
                animation: 'fadeIn 0.8s ease-in-out',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />

            {/* Bottom title banner */}
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '0.7rem 1.8rem',
              borderRadius: '30px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 10
            }}>
              <div style={{ fontSize: '0.75rem', color: '#ffd402', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                {GALLERY_ITEMS[slideshowIndex].id} · {slideshowIndex + 1} de {GALLERY_ITEMS.length}
              </div>
              <div style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: '600' }}>
                {GALLERY_ITEMS[slideshowIndex].title}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── NOTE EDITOR MODAL (Etapa 1 - PORTAL) ─── */}
      {activeNotePhoto && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
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
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img
                src={activeNotePhoto.thumb}
                alt={activeNotePhoto.title}
                draggable={false}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', pointerEvents: 'none' }}
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
                className="interactive"
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
        </div>,
        document.body
      )}

      {/* ─── SUBMIT SELECTION MODAL (Etapa 1 - PORTAL) ─── */}
      {isSubmitModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(14px)',
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
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#121214',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
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
                    className="interactive"
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={22} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                  Enviar {totalSelected} fotos a Edición
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  El laboratorio de Buena Toma procesará tus fotografías seleccionadas con calibración de color, suavizado de piel y formato de entrega en Ultra HD.
                </p>

                {/* Package and Extras Cost Breakdown Summary Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.2rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <span style={{ color: '#a1a1aa' }}>Paquete contratado:</span>
                    <strong style={{ color: '#ffffff' }}>{currentPackage.name} ({packageLimit} fotos incluidas)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <span style={{ color: '#a1a1aa' }}>Fotos incluidas utilizadas:</span>
                    <span style={{ color: '#ffd402', fontWeight: '700' }}>{includedCount} de {packageLimit}</span>
                  </div>
                  {extraCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                      <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={14} /> Fotos adicionales (extras):
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: '700' }}>
                        +{extraCount} fotos
                      </span>
                    </div>
                  )}
                  {hasCuadroUpsell && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                      <span style={{ color: '#ffd402' }}>
                        🖼️ Cuadro Fino Especial (+6 extras incluidas):
                      </span>
                      <span style={{ color: '#ffd402', fontWeight: '700' }}>
                        +$499 MXN
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>Total fotos a entregar editadas:</span>
                    <strong style={{ color: '#ffd402' }}>{totalSelected} fotos</strong>
                  </div>
                  {extraPhotosCost > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '0.4rem',
                      fontSize: '0.92rem'
                    }}>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>Inversión adicional a pagar:</span>
                      <strong style={{ color: '#ffd402' }}>+${extraPhotosCost.toLocaleString('es-MX')} MXN</strong>
                    </div>
                  )}
                </div>

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
                  {selectedPhotos.map((id, index) => {
                    const item = galleryPhotos.find(p => p.id === id);
                    const isExtra = index >= packageLimit;
                    if (!item) return null;
                    return (
                      <div key={id} style={{ position: 'relative', flexShrink: 0 }}>
                        <img 
                          src={item.thumb} 
                          alt={item.title} 
                          draggable={false}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: isExtra ? '2px solid #f59e0b' : '2px solid rgba(255, 212, 2, 0.4)',
                            pointerEvents: 'none'
                          }} 
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          backgroundColor: isExtra ? '#f59e0b' : 'rgba(0,0,0,0.85)',
                          fontSize: '0.62rem',
                          color: isExtra ? '#09090b' : '#ffd402',
                          fontWeight: '700',
                          padding: '1px 4px',
                          borderRadius: '3px'
                        }}>
                          {isExtra ? '+Extra' : `#${index + 1}`}
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
                    padding: '0.95rem',
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
                      Guardando en Wix CMS...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Confirmar y Enviar ({totalSelected} fotos{extraPhotosCost > 0 ? ` · +$${extraPhotosCost.toLocaleString('es-MX')} extras` : ''})
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
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>
                  ¡Fotos enviadas a Retoque!
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: '1.5', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                  Hemos registrado tus <strong>{totalSelected} fotografías</strong> en el sistema de Buena Toma ({includedCount} de tu {currentPackage.name}{extraCount > 0 ? ` + ${extraCount} extras` : ''}).
                </p>

                {/* Generated Links Box */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 212, 2, 0.25)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'block' }}>
                      🔗 Enlace Compartido para Invitados (Solo fotos elegidas):
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={`${window.location.origin}/compartir/${generatedShareSlug || `${sessionCode.toLowerCase()}-compartir`}`}
                        style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#ffd402', fontSize: '0.8rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/compartir/${generatedShareSlug || `${sessionCode.toLowerCase()}-compartir`}`);
                          setToastMessage('¡Enlace de compartir copiado!');
                          setTimeout(() => setToastMessage(''), 2500);
                        }}
                        style={{ backgroundColor: 'rgba(255, 212, 2, 0.15)', border: '1px solid #ffd402', color: '#ffd402', borderRadius: '6px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'block' }}>
                      📸 Enlace para Fotógrafo / Retocador:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={`${window.location.origin}/retocar/${generatedRetouchSlug || `${sessionCode.toLowerCase()}-retocar`}`}
                        style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#4ade80', fontSize: '0.8rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/retocar/${generatedRetouchSlug || `${sessionCode.toLowerCase()}-retocar`}`);
                          setToastMessage('¡Enlace de retoque copiado!');
                          setTimeout(() => setToastMessage(''), 2500);
                        }}
                        style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '6px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown if extras / Cuadro */}
                {extraPhotosCost > 0 && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 212, 2, 0.08)',
                    border: '1px solid #ffd402',
                    borderRadius: '10px',
                    marginBottom: '1.5rem',
                    fontSize: '0.88rem'
                  }}>
                    <div style={{ fontWeight: '700', color: '#ffd402', marginBottom: '4px' }}>
                      💳 Inversión adicional a pagar: ${extraPhotosCost.toLocaleString('es-MX')} MXN
                    </div>
                    <span style={{ color: '#d4d4d8', fontSize: '0.8rem' }}>
                      {hasCuadroUpsell ? 'Incluye Cuadro Fino de gala impreso + fotos extras.' : `${extraCount} fotos extras seleccionadas a $${EXTRA_PHOTO_PRICE} c/u.`}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hola Buena Toma, acabo de enviar mi selección de ${totalSelected} fotos para la sesión ${sessionCode} (${clientName}).\n` +
                        `Paquete: ${currentPackage.name} (${packageLimit} incluidas)\n` +
                        (hasCuadroUpsell ? `Cuadro Fino agregado: SÍ (+$${CUADRO_UPSELL_PRICE} MXN)\n` : '') +
                        (extraPhotosCost > 0 ? `Inversión adicional a pagar: $${extraPhotosCost.toLocaleString('es-MX')} MXN\n` : '') +
                        `Enlace compartido: ${window.location.origin}/compartir/${generatedShareSlug || `${sessionCode.toLowerCase()}-compartir`}`
                      );
                      window.open(`https://wa.me/525592441070?text=${msg}`, '_blank');
                    }}
                    className="interactive"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.85rem 1.6rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageCircle size={17} />
                    {extraPhotosCost > 0 ? 'Pagar Extras por WhatsApp' : 'Confirmar con Fotógrafo en WhatsApp'}
                  </button>

                  <button
                    onClick={() => { setIsSubmitModalOpen(false); setSubmissionSuccess(false); }}
                    className="interactive"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.85rem 1.5rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ─── DOWNLOAD MODAL (Etapa 2 - PORTAL) ─── */}
      {isDownloadModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(14px)',
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
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
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
                className="interactive"
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}
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
        </div>,
        document.body
      )}

      {/* ─── SHARE MODAL (PORTAL) ─── */}
      {isShareModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(14px)',
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
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                Compartir Galería
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)} 
                className="interactive"
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}
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
                className="interactive"
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
              className="interactive"
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
        </div>,
        document.body
      )}

    </div>
  );
}
