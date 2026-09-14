import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Clock, 
  Camera, 
  Image as ImageIcon, 
  ShoppingBag, 
  MessageCircle, 
  ChevronRight
} from 'lucide-react';

// Reusable SVG props and studio set graphics
const StudioLightSVG = ({ side }) => (
  <svg 
    viewBox="0 0 80 180" 
    style={{
      position: 'absolute',
      [side]: '15px',
      bottom: '25px',
      width: '45px',
      height: '115px',
      zIndex: 3,
      pointerEvents: 'none'
    }}
  >
    <ellipse cx="40" cy="170" rx="15" ry="3.5" fill="rgba(0,0,0,0.12)" />
    <line x1="40" y1="45" x2="40" y2="170" stroke="#27272a" strokeWidth="3" />
    <line x1="40" y1="100" x2="40" y2="105" stroke="#ffd402" strokeWidth="4.5" />
    <path d="M40,170 L24,179" stroke="#27272a" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M40,170 L56,179" stroke="#27272a" strokeWidth="3.5" strokeLinecap="round" />
    <g transform={`rotate(${side === 'left' ? 18 : -18} 40 45)`}>
      <path d="M22,25 L58,25 L65,50 L15,50 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
      <ellipse cx="40" cy="50" rx="22" ry="3.5" fill="#ffffff" />
      <ellipse cx="40" cy="50" rx="17" ry="1.8" fill="#e0f2fe" />
      <polygon points="18,50 62,50 85,120 -5,120" fill="url(#studioLightBeam)" opacity="0.16" />
    </g>
    <defs>
      <linearGradient id="studioLightBeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffd402" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const CakeSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{
      position: 'absolute',
      bottom: '30px',
      left: '52%',
      transform: 'translateX(-50%)',
      width: '58px',
      height: '70px',
      zIndex: 5,
      animation: 'fadeInScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}
  >
    <ellipse cx="50" cy="98" rx="32" ry="5.5" fill="#e4e4e7" stroke="#d4d4d8" />
    <line x1="50" y1="98" x2="50" y2="120" stroke="#a1a1aa" strokeWidth="5.5" />
    <ellipse cx="50" cy="78" rx="26" ry="4.5" fill="#f4f4f5" stroke="#e4e4e7" />
    <line x1="50" y1="78" x2="50" y2="98" stroke="#d4d4d8" strokeWidth="4" />
    <rect x="29" y="52" width="42" height="24" rx="4" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
    <path d="M29,62 Q34,65 39,62 Q44,58 49,62 Q54,65 59,62 Q64,58 71,62 L71,52 L29,52 Z" fill="#f43f5e" opacity="0.35" />
    <rect x="34" y="34" width="32" height="18" rx="3" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
    <path d="M34,42 Q39,45 43,42 Q47,39 51,42 Q55,45 59,42 Q63,39 66,42 L66,34 L34,34 Z" fill="#f43f5e" opacity="0.35" />
    <line x1="50" y1="18" x2="50" y2="34" stroke="#ffd402" strokeWidth="1.8" />
    <polygon points="50,10 53,16 60,17 55,21 57,28 50,24 43,28 45,21 40,17 47,16" fill="#ffd402" stroke="#d1ad00" strokeWidth="0.5" />
  </svg>
);

const XvDressSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{ 
      position: 'absolute', 
      bottom: '30px', 
      left: '52%', 
      transform: 'translateX(-50%)', 
      width: '65px', 
      height: '92px', 
      zIndex: 4, 
      animation: 'fadeInScale 0.4s ease' 
    }}
  >
    <defs>
      <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d8b4fe" />
        <stop offset="60%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="tulleGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e879f9" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="116" rx="20" ry="4.5" fill="rgba(0,0,0,0.18)" />
    <line x1="50" y1="80" x2="50" y2="116" stroke="#2d2d30" strokeWidth="2.5" />
    <path d="M50,116 L35,120 M50,116 L65,120 M50,116 L50,121" stroke="#2d2d30" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M42,50 L58,50 C65,70 78,88 84,98 L16,98 C22,88 35,70 42,50 Z" fill="url(#dressGrad)" stroke="#a78bfa" strokeWidth="0.5" />
    <path d="M42,50 Q50,75 18,98 L48,98 Q50,65 42,50 Z" fill="url(#tulleGrad)" />
    <path d="M58,50 Q50,75 82,98 L52,98 Q50,65 58,50 Z" fill="url(#tulleGrad)" />
    <path d="M42,32 L58,32 L58,50 L42,50 Z" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
    <path d="M46,35 L54,42 M54,35 L46,42 M46,42 L54,49 M54,42 L46,49" stroke="#7c3aed" strokeWidth="1.2" />
    <ellipse cx="50" cy="27" rx="3.5" ry="5.5" fill="#b45309" />
    <line x1="50" y1="22" x2="50" y2="25" stroke="#2d2d30" strokeWidth="1.5" />
    <path d="M46,24 L48,22 L50,25 L52,22 L54,24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
  </svg>
);

const MaternidadMoonSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{ 
      position: 'absolute', 
      bottom: '32px', 
      left: '52%', 
      transform: 'translateX(-50%)', 
      width: '68px', 
      height: '92px', 
      zIndex: 4, 
      animation: 'fadeInScale 0.4s ease' 
    }}
  >
    <defs>
      <linearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
    </defs>
    <path d="M52,12 C72,12 80,26 80,48 C80,68 66,78 52,78 C60,72 64,61 64,48 C64,34 60,22 52,12 Z" fill="url(#moonGrad)" filter="drop-shadow(0 0 6px #fef08a)" />
    <line x1="32" y1="15" x2="32" y2="40" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
    <polygon points="32,40 34,44 38,45 35,48 36,52 32,50 28,52 29,48 26,45 30,44" fill="#fde047" />
    <line x1="72" y1="20" x2="72" y2="55" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
    <polygon points="72,55 74,59 78,60 75,63 76,67 72,65 68,67 69,63 66,60 70,59" fill="#fde047" />
    <path d="M34,70 Q42,62 50,67 Q58,62 64,70 Q69,67 72,72 L28,72 Z" fill="#ffffff" opacity="0.95" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.06))" />
  </svg>
);

const CasualSeatSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{ 
      position: 'absolute', 
      bottom: '30px', 
      left: '52%', 
      transform: 'translateX(-50%)', 
      width: '60px', 
      height: '84px', 
      zIndex: 4, 
      animation: 'fadeInScale 0.4s ease' 
    }}
  >
    <ellipse cx="50" cy="114" rx="22" ry="5.5" fill="rgba(0,0,0,0.2)" />
    <line x1="50" y1="95" x2="50" y2="114" stroke="#27272a" strokeWidth="4.5" />
    <path d="M50,114 L30,119 M50,114 L70,119 M50,114 L50,121" stroke="#27272a" strokeWidth="5" strokeLinecap="round" />
    <path d="M22,50 C22,35 78,35 78,50 C78,65 72,95 50,95 C28,95 22,65 22,50 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    <path d="M28,52 C28,42 72,42 72,52 C72,62 66,90 50,90 C34,90 28,62 28,52 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
  </svg>
);

const GradCapSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{ 
      position: 'absolute', 
      bottom: '30px', 
      left: '52%', 
      transform: 'translateX(-50%)', 
      width: '64px', 
      height: '86px', 
      zIndex: 4, 
      animation: 'fadeInScale 0.4s ease' 
    }}
  >
    <ellipse cx="50" cy="116" rx="26" ry="4" fill="rgba(0,0,0,0.15)" />
    <rect x="25" y="105" width="50" height="12" fill="#e4e4e7" stroke="#cbd5e1" strokeWidth="1.2" />
    <rect x="30" y="85" width="40" height="20" fill="#f4f4f5" stroke="#cbd5e1" strokeWidth="1.2" />
    <rect x="22" y="76" width="56" height="10" fill="#1e3a8a" rx="1.5" stroke="#172554" strokeWidth="0.5" />
    <rect x="26" y="67" width="48" height="9" fill="#991b1b" rx="1.5" stroke="#450a0a" strokeWidth="0.5" />
    <polygon points="50,38 78,44 50,50 22,44" fill="#111827" stroke="#374151" strokeWidth="0.8" />
    <rect x="42" y="48" width="16" height="11" fill="#111827" rx="1.5" />
    <path d="M50,44 Q68,48 70,54 L70,66" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const CouplesBenchSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{ 
      position: 'absolute', 
      bottom: '30px', 
      left: '52%', 
      transform: 'translateX(-50%)', 
      width: '68px', 
      height: '86px', 
      zIndex: 4, 
      animation: 'fadeInScale 0.4s ease' 
    }}
  >
    <path d="M5,10 Q28,20 50,10 Q72,20 95,10" stroke="#3f3f46" strokeWidth="1.2" fill="none" />
    <g filter="drop-shadow(0 0 5px #f59e0b)">
      <circle cx="20" cy="20" r="4.5" fill="#fef08a" opacity="0.9" />
      <circle cx="50" cy="22" r="4.5" fill="#fef08a" opacity="0.9" />
      <circle cx="80" cy="20" r="4.5" fill="#fef08a" opacity="0.9" />
    </g>
    <ellipse cx="50" cy="116" rx="30" ry="3.5" fill="rgba(0,0,0,0.15)" />
    <rect x="22" y="80" width="56" height="4" rx="1" fill="#1c1b1a" />
    <rect x="22" y="88" width="56" height="4" rx="1" fill="#1c1b1a" />
    <rect x="18" y="93" width="64" height="5" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
  </svg>
);

const RealSofaSVG = () => (
  <svg 
    viewBox="0 0 400 160" 
    style={{
      position: 'absolute',
      bottom: '8px',
      width: '85%',
      height: '95px',
      zIndex: 2
    }}
  >
    <ellipse cx="200" cy="150" rx="165" ry="11" fill="rgba(28,27,26,0.16)" filter="blur(6px)" />
    <rect x="32" y="115" width="336" height="17" rx="3.5" fill="#ffd402" /> 
    <rect x="34" y="108" width="332" height="10" rx="2" fill="#4a4947" />
    <rect x="42" y="79" width="102" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="148" y="79" width="104" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="256" y="79" width="102" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="43" y="26" width="101" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="149" y="26" width="102" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="256" y="26" width="101" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
  </svg>
);

// Catalog of Services Data
const SERVICES_DATA = {
  cumple: {
    id: "cumple",
    name: "Sesión de Cumpleaños",
    badge: "Celebración & Fiesta",
    price: 2799,
    tagline: "Celebra la vida a todo color y un año más con estilo inolvidable.",
    description: "Diseñada para capturar risas espontáneas, colores vivos y la auténtica alegría de celebrar. Incluye sets decorativos exclusivos con globos, pastel simulado para fotos y asesoría creativa.",
    duration: "1 Hora",
    photosCount: "15 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 100 • 50MM • F/1.8 • SH-01",
    gallery: [
      "/images/birthday_set.png",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "1 Hora de sesión en estudio profesional",
      "Set decorado con globos a elección de color",
      "15 Fotografías digitales retocadas en alta definición",
      "Pastel simulado artístico para la sesión",
      "Galería digital privada para selección",
      "Hasta 2 cambios de outfit",
      "Asesoría de estilo y poses dinámicas"
    ],
    hasTopper: true,
    tips: [
      "Trae tus cambios de ropa limpios y planchados en gancho.",
      "Recomendamos usar colores contrastantes con la paleta de globos elegida.",
      "Si traes accesorios temáticos propios, con gusto los integramos al set."
    ]
  },
  xv: {
    id: "xv",
    name: "Sesión de XV Años",
    badge: "Gala & Juventud",
    price: 4000,
    tagline: "El inicio de tu propia historia inmortalizado con elegancia cinematográfica.",
    description: "Una experiencia mágica donde cada detalle de tu vestido, maquillaje y porte son retratados con iluminación de alta gama. Combinamos estudio fotográfico y locaciones al aire libre.",
    duration: "2 Horas",
    photosCount: "25 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 64 • 85MM • F/1.4 • SH-02",
    gallery: [
      "/images/xv_portrait.png",
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520854221256-174b1ec358ef?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "2 Horas completas de sesión (Estudio + Locación de jardín)",
      "3 Cambios de vestuario (Vestido de gala + 2 casuales)",
      "25 Fotografías digitales retocadas con piel de porcelana",
      "1 Cuadro impreso de madera 16x20\" incluido de obsequio",
      "Galería online privada con contraseña",
      "Acompañamiento y dirección continua de poses",
      "Asistencia de iluminación móvil en locación"
    ],
    hasTopper: false,
    tips: [
      "El vestido de XV debe colocarse en el camerino del estudio.",
      "Te sugerimos agendar la sesión 3 a 4 semanas antes de tu evento.",
      "Puedes incluir tomas con tus papás o chambelán de honor."
    ]
  },
  maternidad: {
    id: "maternidad",
    name: "Sesión de Maternidad",
    badge: "Emoción & Ternura",
    price: 3000,
    tagline: "La dulce espera retratada con sutileza, luz suave y amor genuino.",
    description: "Capturamos la calidez y emoción de esperar a tu bebé. Un ambiente cálido, íntimo y relajado con acceso a vestuario exclusivo del estudio para hacerte sentir cómoda y radiante.",
    duration: "1.5 Horas",
    photosCount: "18 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 200 • 35MM • F/2.0 • SH-03",
    gallery: [
      "/images/maternity_session.png",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "1.5 Horas de sesión en estudio con temperatura controlada",
      "Acceso libre a la colección de batas y vestidos de maternidad",
      "18 Fotografías digitales con retoque estético suave",
      "Pareja e hijos mayores incluidos sin costo extra",
      "Fondos orgánicos y set celestial suave",
      "Galería digital de selección interactiva"
    ],
    hasTopper: false,
    tips: [
      "La mejor etapa para el shoot es entre las semanas 28 y 34 de embarazo.",
      "Usa ropa interior neutra sin costuras marcada antes de la sesión.",
      "Trae ultrasonidos o zapatitos para fotos de detalle."
    ]
  },
  casual: {
    id: "casual",
    name: "Sesiones Casuales & Retrato",
    badge: "Autenticidad & Estilo",
    price: 2899,
    tagline: "Fotografía de retrato libre, fresca y contemporánea para tu marca o perfil.",
    description: "Retratos individuales o casuales con estilo editorial urbano o minimalismo en estudio. Perfecto para marcas personales, redes sociales o simplemente para consentirte.",
    duration: "1 Hora",
    photosCount: "15 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 100 • 50MM • F/1.2 • SH-04",
    gallery: [
      "/images/film_camera.png",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "1 Hora de sesión en estudio o exterior urbano en Paseo de la Reforma",
      "2 Cambios de outfit completos",
      "15 Fotografías digitales con etalonaje cinematográfico",
      "Dirección dinámica de poses (cero poses rígidas)",
      "Optimización de archivos para redes y alta resolución para impresión",
      "Galería privada de previsualización"
    ],
    hasTopper: false,
    tips: [
      "Elige ropa que refleje tu personalidad cotidiana y profesional.",
      "Los colores sólidos y texturas de algodón o lino lucen increíbles.",
      "Te ayudamos a seleccionar los mejores ángulos en vivo en pantalla."
    ]
  },
  graduacion: {
    id: "graduacion",
    name: "Sesión de Graduación",
    badge: "Logro & Triunfo",
    price: 3799,
    tagline: "El triunfo de tu esfuerzo retratado con porte, orgullo y excelencia.",
    description: "Celebra el cierre de una etapa trascendental. Sesión con toga, birrete, estola y tomas en traje formal o casual, acompañados por tu familia en un ambiente de orgullo compartido.",
    duration: "1.5 Horas",
    photosCount: "20 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 100 • 85MM • F/2.8 • SH-05",
    gallery: [
      "/images/studio_setup.png",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "1.5 Horas de sesión en estudio con iluminación de graduación",
      "Préstamo de toga, birrete y estola de gala para la sesión",
      "20 Fotografías digitales con retoque de alta fidelidad",
      "Tomas individuales y con familia (hasta 4 acompañantes incluidos)",
      "1 Retrato impreso 8x10\" con marco de madera institucional",
      "Diploma simulado para fotos y atril de estudio",
      "Galería online para entrega ágil"
    ],
    hasTopper: false,
    tips: [
      "Trae tu camisa formal o vestido para usar debajo de la toga.",
      "Los familiares pueden vestirse en armonía con una paleta formal neutra.",
      "Si tienes anillo o título/diploma, tráelo para tomas de detalle."
    ]
  },
  parejas: {
    id: "parejas",
    name: "Sesión de Parejas",
    badge: "Amor & Conexión",
    price: 2999,
    tagline: "Miradas y complicidades congeladas en una atmósfera cinematográfica.",
    description: "Una sesión íntima y divertida que captura la química natural entre ustedes. Sin poses forzadas ni tensión, creamos un espacio para que sean ustedes mismos ante la cámara.",
    duration: "1.5 Horas",
    photosCount: "20 Fotos Editadas",
    heroImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    specs: "ISO 160 • 85MM • F/1.8 • SH-06",
    gallery: [
      "/images/couple_laugh.png",
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
    ],
    includes: [
      "1.5 Horas en exteriores o estudio con ambientación cálida",
      "20 Fotografías digitales retocadas con coloración cinematográfica",
      "2 Cambios de atuendo por persona",
      "Guía y juegos de interacción para lograr sonrisas naturales",
      "Asistencia de iluminación suave",
      "Galería digital de alta velocidad"
    ],
    hasTopper: false,
    tips: [
      "Combinen sus outfits en texturas y gamas de color sin ir vestidos idénticos.",
      "La hora del atardecer (Golden Hour) ofrece tonos dorados mágicos.",
      "Pueden traer su música favorita para reproducirla durante el shoot."
    ]
  }
};

export default function ServicePage({ serviceId = 'cumple', setTab, addToCart }) {
  const service = SERVICES_DATA[serviceId] || SERVICES_DATA.cumple;

  // Dedicated Form State for this specific service
  const [makeup, setMakeup] = useState(false);
  const [frame, setFrame] = useState('none'); // 'none', 'resumen', 'mediano', 'grande'
  const [extraPhotos, setExtraPhotos] = useState('none'); // 'none', 'single', 'pack'
  const [cakeTopper, setCakeTopper] = useState(false); // Only for cumple
  const [preferredDate, setPreferredDate] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(service.price);
  const [addedMessage, setAddedMessage] = useState(false);

  // Dynamic price calculation
  useEffect(() => {
    let price = service.price;
    if (makeup) price += 800;
    if (frame === 'resumen') price += 799;
    else if (frame === 'mediano') price += 1599;
    else if (frame === 'grande') price += 2599;

    if (extraPhotos === 'single') price += 150;
    else if (extraPhotos === 'pack') price += 499;

    if (cakeTopper && service.hasTopper) price += 150;

    setTotalPrice(price);
  }, [service.price, service.hasTopper, makeup, frame, extraPhotos, cakeTopper]);

  // Reset extras when serviceId changes
  useEffect(() => {
    setMakeup(false);
    setFrame('none');
    setExtraPhotos('none');
    setCakeTopper(false);
    setPreferredDate('');
    setClientNotes('');
    setAddedMessage(false);
    window.scrollTo(0, 0);
  }, [serviceId]);

  const handleAddToCart = () => {
    const options = [];
    if (makeup) options.push("Peinado y Maquillaje ($800)");
    if (frame !== 'none') {
      const frameNames = { 
        resumen: "Cuadro Resumen 61x23cm ($799)", 
        mediano: "Cuadro Mediano 50x65cm ($1,599)", 
        grande: "Cuadro Grande 61x76cm ($2,599)" 
      };
      options.push(frameNames[frame]);
    }
    if (extraPhotos === 'single') options.push("1 Foto Digital Extra ($150)");
    else if (extraPhotos === 'pack') options.push("Pack 6 Fotos Extras ($499)");
    if (cakeTopper && service.hasTopper) options.push("Cake Topper Personalizado ($150)");
    if (preferredDate) options.push(`Fecha sugerida: ${preferredDate}`);

    const item = {
      id: `${service.id}-${Date.now()}`,
      type: 'package',
      name: service.name,
      category: service.name,
      price: totalPrice,
      options: options
    };

    addToCart(item);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const handleWhatsAppBooking = () => {
    const phoneNumber = "5662914092";
    let text = `Hola me interesa reservar la *${service.name}* en su estudio en Reforma 284, CDMX.\n\n`;
    text += `*Precio base:* $${service.price.toLocaleString('es-MX')} MXN\n`;
    text += `*Incluye:* ${service.duration} de sesión con ${service.photosCount}.\n`;

    const complements = [];
    if (makeup) complements.push("Peinado y Maquillaje Profesional (+$800 MXN)");
    if (frame !== 'none') {
      const frameNames = { 
        resumen: "Cuadro Resumen (+$799 MXN)", 
        mediano: "Cuadro Mediano (+$1,599 MXN)", 
        grande: "Cuadro Grande (+$2,599 MXN)" 
      };
      complements.push(frameNames[frame]);
    }
    if (extraPhotos === 'single') complements.push("1 Foto Extra (+$150 MXN)");
    else if (extraPhotos === 'pack') complements.push("Pack 6 Fotos Extras (+$499 MXN)");
    if (cakeTopper && service.hasTopper) complements.push("Cake Topper Personalizado (+$150 MXN)");

    if (complements.length > 0) {
      text += `\n*Complementos seleccionados:*\n- ${complements.join('\n- ')}\n`;
    }

    if (preferredDate) {
      text += `\n*Fecha deseada:* ${preferredDate}\n`;
    }
    if (clientNotes.trim()) {
      text += `*Notas:* ${clientNotes.trim()}\n`;
    }

    text += `\n*Total estimado:* $${totalPrice.toLocaleString('es-MX')} MXN\n\n`;
    text += `¿Tienen disponibilidad de agenda para esta sesión?`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/52${phoneNumber}?text=${encoded}`, '_blank');
  };

  // Render the tailored prop SVG in the live set simulator
  const renderSimulatorProp = () => {
    switch (service.id) {
      case 'cumple':
        return <CakeSVG />;
      case 'xv':
        return <XvDressSVG />;
      case 'maternidad':
        return <MaternidadMoonSVG />;
      case 'casual':
        return <CasualSeatSVG />;
      case 'graduacion':
        return <GradCapSVG />;
      case 'parejas':
        return <CouplesBenchSVG />;
      default:
        return <CakeSVG />;
    }
  };

  return (
    <div style={{ paddingTop: '85px', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} className="fade-in">
      
      {/* Top Breadcrumb navigation */}
      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <button 
            onClick={() => setTab('home')} 
            className="interactive" 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
          >
            Inicio
          </button>
          <ChevronRight size={14} />
          <button 
            onClick={() => setTab('packages')} 
            className="interactive" 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
          >
            Servicios
          </button>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>{service.name}</span>
        </div>
      </div>

      {/* Hero Section of the Specific Service */}
      <section style={{ padding: '2rem 0 3.5rem 0', position: 'relative' }}>
        <div className="container">
          <div 
            className="service-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Text, specs and pricing */}
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.4rem 1rem',
                backgroundColor: 'rgba(255, 212, 2, 0.12)',
                color: 'var(--text-primary)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem'
              }}>
                <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                {service.badge}
              </span>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                lineHeight: '1.1',
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                {service.name}
              </h1>

              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: 'var(--accent-gold)',
                marginBottom: '1.2rem'
              }}>
                "{service.tagline}"
              </p>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: '1.7',
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                {service.description}
              </p>

              {/* Quick Specs Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.2rem',
                marginBottom: '2.5rem',
                padding: '1.2rem 1.5rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duración</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{service.duration}</div>
                  </div>
                </div>

                <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Camera size={18} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entrega</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{service.photosCount}</div>
                  </div>
                </div>

                <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={18} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estudio</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>Reforma 284, CDMX</div>
                  </div>
                </div>
              </div>

              {/* Price Callout */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Paquete base desde
                </span>
                <span style={{ fontSize: '2.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  ${service.price.toLocaleString('es-MX')}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>MXN</span>
              </div>
            </div>

            {/* Right: Featured Hero Photo with Film Aesthetic */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-color)'
              }}>
                <img 
                  className="service-hero-img"
                  src={service.heroImage} 
                  alt={service.name} 
                  style={{
                    width: '100%',
                    height: '480px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  right: '15px',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(28, 27, 26, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em'
                }}>
                  <span>BUENA TOMA • ESTUDIO CDMX</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{service.specs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Form & Configurator Section */}
      <section style={{
        padding: '4rem 0 5rem 0',
        backgroundColor: 'var(--bg-input)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
              Configura tu sesión ideal
            </span>
            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
              Personaliza tu paquete de <span style={{ color: 'var(--accent-gold)' }}>{service.name}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Selecciona los complementos exclusivos que deseas añadir para tu shoot. El precio y simulador se actualizan al instante.
            </p>
          </div>

          <div 
            className="service-customizer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.35fr 1fr',
              gap: '3.5rem',
              alignItems: 'start'
            }}
          >

            {/* Left Column: The Tailored Form Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Box 1: Included Features in Base Package */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={20} style={{ color: 'var(--accent-gold)' }} />
                  Lo que incluye tu paquete base ($ {service.price.toLocaleString('es-MX')} MXN)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                  {service.includes.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Styling & Makeup Option */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                  1. Peinado y Maquillaje Profesional en Estudio
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                  Garantiza un acabado mate impecable y resistente a las luces de estudio, realizado por maquillistas especializadas.
                </p>

                <div 
                  onClick={() => setMakeup(!makeup)}
                  className="interactive"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.2rem 1.5rem',
                    border: makeup ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    backgroundColor: makeup ? 'rgba(255, 212, 2, 0.08)' : 'var(--bg-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: makeup ? '2px solid var(--accent-gold)' : '2px solid var(--text-muted)',
                      backgroundColor: makeup ? 'var(--accent-gold)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-color)'
                    }}>
                      {makeup && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Agregar Maquillaje & Peinado Profesional</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1 Hora antes del shoot en camerino privado</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                    +$800 <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>MXN</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Printed Frames / Cuadros Físicos */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                  2. Cuadro Físico en Madera y Acabado Mate
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                  Inmortaliza tu foto favorita con impresión de laboratorio montada sobre bastidor de madera maciza.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { id: 'none', name: 'Sin Cuadro Físico', desc: 'Solo archivos digitales', price: 0 },
                    { id: 'resumen', name: 'Cuadro Resumen', desc: '61 x 23 cm (Panorámico)', price: 799 },
                    { id: 'mediano', name: 'Cuadro Mediano', desc: '50 x 65 cm (Clásico sala)', price: 1599 },
                    { id: 'grande', name: 'Cuadro Grande', desc: '61 x 76 cm (Gala estelar)', price: 2599 }
                  ].map((f) => {
                    const isSelected = frame === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setFrame(f.id)}
                        className="interactive"
                        style={{
                          padding: '1.2rem',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(255, 212, 2, 0.08)' : 'var(--bg-color)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{f.name}</span>
                          {isSelected && <Check size={16} style={{ color: 'var(--accent-gold)' }} />}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>{f.desc}</div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: f.price > 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                          {f.price > 0 ? `+$${f.price.toLocaleString('es-MX')} MXN` : 'Incluido'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 4: Extra Retouched Photos */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                  3. Fotos Digitales Extras con Retoque
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                  ¿No puedes decidirte por pocas fotos? Amplía el paquete con fotos retocadas adicionales.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[
                    { id: 'none', label: 'Sin fotos extras', count: `Base (${service.photosCount})`, price: 0 },
                    { id: 'single', label: '+1 Foto Retocada', count: 'Retoque individual', price: 150 },
                    { id: 'pack', label: '+6 Fotos Retocadas', count: 'Pack especial ahorro', price: 499 }
                  ].map((p) => {
                    const isSelected = extraPhotos === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setExtraPhotos(p.id)}
                        className="interactive"
                        style={{
                          padding: '1.2rem',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(255, 212, 2, 0.08)' : 'var(--bg-color)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{p.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>{p.count}</div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: p.price > 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                          {p.price > 0 ? `+$${p.price.toLocaleString('es-MX')} MXN` : 'Sin costo'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 5: Service Specific Addons (e.g. Cake Topper for Cumpleaños) */}
              {service.hasTopper && (
                <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    4. Decoración Temática Especial
                  </h3>
                  <div 
                    onClick={() => setCakeTopper(!cakeTopper)}
                    className="interactive"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.2rem 1.5rem',
                      border: cakeTopper ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      backgroundColor: cakeTopper ? 'rgba(255, 212, 2, 0.08)' : 'var(--bg-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: cakeTopper ? '2px solid var(--accent-gold)' : '2px solid var(--text-muted)',
                        backgroundColor: cakeTopper ? 'var(--accent-gold)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-color)'
                      }}>
                        {cakeTopper && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Cake Topper Acrílico / Madera Personalizado</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Con tu nombre o número de cumpleaños para el pastel simulado</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                      +$150 <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>MXN</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Box 6: Date & Client Notes */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                  {service.hasTopper ? '5' : '4'}. Agenda y Notas Especiales (Opcional)
                </h3>
                <div 
                  className="service-inputs-grid"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.2rem', marginTop: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Fecha sugerida:
                    </label>
                    <input 
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-color)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      ¿Tienes alguna idea o petición especial?
                    </label>
                    <input 
                      type="text"
                      placeholder="Ej. Colores preferidos, temáticas, etc."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-color)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Studio Simulator & Order Summary Sticky Card */}
            <div 
              className="service-sticky-sidebar"
              style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              
              {/* Mini Studio Simulator Card */}
              <div className="glass" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.4)'
                }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    Simulador del Set en Vivo
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                    {service.name}
                  </span>
                </div>

                {/* Studio Set Stage */}
                <div style={{
                  height: '210px',
                  position: 'relative',
                  backgroundColor: '#f8fafc',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Backdrop */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '20px',
                    right: '20px',
                    bottom: '25px',
                    background: service.id === 'xv' ? 'linear-gradient(to bottom, #f3e8ff, #ddd6fe)' :
                                service.id === 'maternidad' ? 'linear-gradient(to bottom, #fdf4ff, #fae8ff)' :
                                service.id === 'cumple' ? 'linear-gradient(to bottom, #fff1f2, #bae6fd)' :
                                service.id === 'graduacion' ? 'linear-gradient(to bottom, #f1f5f9, #cbd5e1)' :
                                service.id === 'parejas' ? 'linear-gradient(to bottom, #fef3c7, #fde68a)' :
                                'linear-gradient(to bottom, #fafafa, #f1f5f9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }} />

                  {/* Softbox Studio Lights */}
                  <StudioLightSVG side="left" />
                  <StudioLightSVG side="right" />

                  {/* Sofa Base */}
                  {service.id !== 'xv' && service.id !== 'casual' && <RealSofaSVG />}

                  {/* Prop SVG tailored to this service */}
                  {renderSimulatorProp()}

                  {/* Frame preview tag if frame selected */}
                  {frame !== 'none' && (
                    <div style={{
                      position: 'absolute',
                      top: '25px',
                      right: '30px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(28,27,26,0.85)',
                      color: '#fff',
                      fontSize: '0.68rem',
                      borderRadius: '4px',
                      zIndex: 10,
                      backdropFilter: 'blur(4px)'
                    }}>
                      🖼️ Cuadro {frame.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary & Booking Card */}
              <div className="glass" style={{
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
              }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', fontWeight: '600' }}>
                  Resumen de tu Cotización
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{service.name} (Base)</span>
                    <span style={{ fontWeight: '600' }}>${service.price.toLocaleString('es-MX')} MXN</span>
                  </div>

                  {makeup && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>+ Peinado y Maquillaje</span>
                      <span>+$800 MXN</span>
                    </div>
                  )}

                  {frame !== 'none' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>+ Cuadro {frame.charAt(0).toUpperCase() + frame.slice(1)}</span>
                      <span>+${frame === 'resumen' ? '799' : frame === 'mediano' ? '1,599' : '2,599'} MXN</span>
                    </div>
                  )}

                  {extraPhotos !== 'none' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>+ Fotos extras ({extraPhotos === 'single' ? '1 foto' : 'Pack 6'})</span>
                      <span>+${extraPhotos === 'single' ? '150' : '499'} MXN</span>
                    </div>
                  )}

                  {cakeTopper && service.hasTopper && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>+ Cake Topper Personalizado</span>
                      <span>+$150 MXN</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.8rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Total Configurado:</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                      ${totalPrice.toLocaleString('es-MX')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>MXN</span>
                  </div>
                </div>

                {/* Feedback pill when added to cart */}
                {addedMessage && (
                  <div style={{
                    padding: '0.8rem',
                    backgroundColor: 'rgba(30, 189, 91, 0.1)',
                    border: '1px solid #1ebd5b',
                    color: '#1ebd5b',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    ✓ ¡Agregado a tu selección! Abriendo carrito...
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <button
                    onClick={handleAddToCart}
                    className="btn-premium btn-gold interactive"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}
                  >
                    <ShoppingBag size={18} />
                    Agregar al Carrito de Reservas
                  </button>

                  <button
                    onClick={handleWhatsAppBooking}
                    className="btn-premium interactive"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--accent-green)',
                      borderColor: 'var(--accent-green)',
                      color: '#ffffff'
                    }}
                  >
                    <MessageCircle size={18} />
                    Cotizar Directo por WhatsApp
                  </button>
                </div>

                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Estudio en Paseo de la Reforma 284, CDMX • Pagos con tarjeta y transferencia
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Gallery of Sample Photos from This Specific Service */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
              Muestras Reales
            </span>
            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
              Galería de <span style={{ color: 'var(--accent-gold)' }}>{service.name}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
              Tomas capturadas en nuestros sets con iluminación profesional y edición cinematográfica de autor.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {service.gallery.map((imgUrl, i) => (
              <div 
                key={i}
                className="interactive glass interactive-card"
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '380px',
                  position: 'relative'
                }}
              >
                <img 
                  src={imgUrl} 
                  alt={`${service.name} toma ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>{service.name}</span> • Fotografía Buena Toma
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Recommendations Section */}
      <section style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-input)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div 
            className="service-tips-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
                Preparación para tu shoot
              </span>
              <h3 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1.5rem 0' }}>
                Tips para aprovechar al máximo tu sesión
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {service.tips.map((tip, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-gold)',
                      color: 'var(--bg-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Services Navigation Box */}
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
                Explorar otros servicios
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Descubre los demás paquetes temáticos y sets especiales disponibles en nuestro estudio de CDMX:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {Object.values(SERVICES_DATA).filter(s => s.id !== service.id).map(other => (
                  <button
                    key={other.id}
                    onClick={() => setTab(`service-${other.id}`)}
                    className="interactive"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.8rem 1.2rem',
                      backgroundColor: 'var(--bg-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{other.name}</span>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>Desde ${other.price.toLocaleString('es-MX')} →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
