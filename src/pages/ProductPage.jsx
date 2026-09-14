import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, MessageCircle } from 'lucide-react';

const getBackdropColor = (id) => {
  switch (id) {
    case 'cumple': return 'linear-gradient(to bottom, #ffe4e6, #bae6fd)';
    case 'xv': return 'linear-gradient(to bottom, #6d28d9, #1e1b4b)';
    case 'maternidad': return 'linear-gradient(to bottom, #fae8ff, #f3e8ff)';
    case 'casual': return 'linear-gradient(to bottom, #f1f5f9, #cbd5e1)';
    case 'graduacion': return 'linear-gradient(to bottom, #334155, #0f172a)';
    case 'parejas': return 'linear-gradient(to bottom, #fef3c7, #fcd34d)';
    default: return 'linear-gradient(to bottom, #fafafa, #f4f4f5)';
  }
};

const getFrameImage = (id) => {
  switch(id) {
    case 'cumple': return 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80';
    case 'xv': return 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=400&q=80';
    case 'maternidad': return 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';
    case 'casual': return 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80';
    case 'graduacion': return 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80';
    case 'parejas': return 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=400&q=80';
    default: return 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=400&q=80';
  }
};

// Realistic SVG softbox light
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

// Realistic SVG vanity mirror with lights
const VanityMirrorSVG = () => (
  <svg 
    viewBox="0 0 100 120" 
    style={{
      position: 'absolute',
      bottom: '30px',
      left: '20%',
      width: '52px',
      height: '62px',
      zIndex: 4,
      animation: 'fadeInScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}
  >
    <rect x="10" y="98" width="80" height="6" rx="2" fill="#52525b" />
    <line x1="28" y1="104" x2="24" y2="120" stroke="#52525b" strokeWidth="3.5" />
    <line x1="72" y1="104" x2="76" y2="120" stroke="#52525b" strokeWidth="3.5" />
    <rect x="22" y="15" width="56" height="83" rx="6" fill="#18181b" stroke="#ffd402" strokeWidth="2.5" />
    <rect x="27" y="20" width="46" height="73" rx="3" fill="#e0f2fe" />
    <polygon points="27,20 54,20 27,65" fill="rgba(255,255,255,0.35)" />
    <ellipse cx="50" cy="115" rx="14" ry="4" fill="rgba(0,0,0,0.1)" />
    <rect x="42" y="112" width="16" height="4" rx="1.5" fill="#991b1b" />
    <line x1="50" y1="116" x2="50" y2="120" stroke="#52525b" strokeWidth="2" />
    <circle cx="24.5" cy="26" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="24.5" cy="46" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="24.5" cy="66" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="24.5" cy="86" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="75.5" cy="26" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="75.5" cy="46" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="75.5" cy="66" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="75.5" cy="86" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
    <circle cx="50" cy="17.5" r="2.5" fill="#fff" filter="drop-shadow(0 0 3px #ffd700)" />
  </svg>
);

// Realistic SVG birthday cake and stand
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

// High-Fidelity Category Signature Visual Previews

// XV Años princess ballgown mannequin with lace, layered tulle and glitters
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
    
    {/* Princess Ballgown skirt layers */}
    <path d="M42,50 L58,50 C65,70 78,88 84,98 L16,98 C22,88 35,70 42,50 Z" fill="url(#dressGrad)" stroke="#a78bfa" strokeWidth="0.5" />
    <path d="M42,50 Q50,75 18,98 L48,98 Q50,65 42,50 Z" fill="url(#tulleGrad)" />
    <path d="M58,50 Q50,75 82,98 L52,98 Q50,65 58,50 Z" fill="url(#tulleGrad)" />
    
    {/* Lace Bodice Corset */}
    <path d="M42,32 L58,32 L58,50 L42,50 Z" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
    <path d="M46,35 L54,42 M54,35 L46,42 M46,42 L54,49 M54,42 L46,49" stroke="#7c3aed" strokeWidth="1.2" />
    
    {/* Wooden neck hanger */}
    <ellipse cx="50" cy="27" rx="3.5" ry="5.5" fill="#b45309" />
    <line x1="50" y1="22" x2="50" y2="25" stroke="#2d2d30" strokeWidth="1.5" />
    
    {/* Golden Tiara */}
    <path d="M46,24 L48,22 L50,25 L52,22 L54,24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
    
    {/* Sparkling glints */}
    <circle cx="28" cy="65" r="1.5" fill="#fff" opacity="0.8" />
    <circle cx="72" cy="75" r="1" fill="#fff" opacity="0.9" />
    <circle cx="48" cy="90" r="1.2" fill="#fff" opacity="0.75" />
    <polygon points="65,58 66,61 69,62 66,63 65,66 64,63 61,62 64,61" fill="#fde047" />
  </svg>
);

// Maternidad Moon & Cloud backdrop scene
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
    <path d="M60,44 Q62,47 64,44" stroke="#d97706" strokeWidth="1" fill="none" strokeLinecap="round" />
    
    {/* Hanging stars */}
    <line x1="32" y1="15" x2="32" y2="40" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
    <polygon points="32,40 34,44 38,45 35,48 36,52 32,50 28,52 29,48 26,45 30,44" fill="#fde047" />
    
    <line x1="72" y1="20" x2="72" y2="55" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
    <polygon points="72,55 74,59 78,60 75,63 76,67 72,65 68,67 69,63 66,60 70,59" fill="#fde047" />
    
    {/* Double layered fluffy clouds */}
    <path d="M26,72 Q32,64 42,67 Q52,62 58,68 Q65,64 68,72 L22,72 Z" fill="#e2e8f0" opacity="0.6" />
    <path d="M34,70 Q42,62 50,67 Q58,62 64,70 Q69,67 72,72 L28,72 Z" fill="#ffffff" opacity="0.95" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.06))" />
  </svg>
);

// Casual Retro Egg Armchair & detailed camera
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
    
    {/* Retro Egg Chair Casing */}
    <path d="M22,50 C22,35 78,35 78,50 C78,65 72,95 50,95 C28,95 22,65 22,50 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    <path d="M28,52 C28,42 72,42 72,52 C72,62 66,90 50,90 C34,90 28,62 28,52 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
    
    {/* Camera */}
    <g transform="translate(38 68)">
      <rect x="0" y="0" width="24" height="15" rx="2" fill="#1f2937" stroke="#ffffff" strokeWidth="1" />
      <rect x="2" y="-3" width="7" height="3" fill="#9ca3af" />
      <circle cx="20" cy="-2" r="1.5" fill="#ef4444" />
      <circle cx="12" cy="7.5" r="5.5" fill="#4b5563" stroke="#d1d5db" strokeWidth="1.2" />
      <circle cx="12" cy="7.5" r="2.5" fill="#111827" />
      <path d="M9,5 Q11,3 13,5" stroke="#ffffff" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// Graduacion stack of books, diploma & cap
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
    
    {/* Books stack */}
    <rect x="22" y="76" width="56" height="10" fill="#1e3a8a" rx="1.5" stroke="#172554" strokeWidth="0.5" />
    <rect x="74" y="78" width="4" height="6" fill="#fff" />
    <rect x="26" y="67" width="48" height="9" fill="#991b1b" rx="1.5" stroke="#450a0a" strokeWidth="0.5" />
    <rect x="70" y="69" width="4" height="5" fill="#fff" />
    <rect x="24" y="59" width="50" height="8" fill="#0f766e" rx="1.5" stroke="#042f2e" strokeWidth="0.5" />
    <rect x="70" y="61" width="4" height="4" fill="#fff" />
    
    {/* Diploma scroll */}
    <g transform="translate(18 80) rotate(-10)">
      <rect x="0" y="0" width="22" height="6" rx="1" fill="#fffef0" stroke="#d1d5db" strokeWidth="0.5" />
      <rect x="9" y="-0.5" width="4" height="7" fill="#dc2626" />
    </g>

    {/* Cap */}
    <polygon points="50,38 78,44 50,50 22,44" fill="#111827" stroke="#374151" strokeWidth="0.8" />
    <rect x="42" y="48" width="16" height="11" fill="#111827" rx="1.5" />
    <path d="M50,44 Q68,48 70,54 L70,66" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <polygon points="70,66 67,71 73,71" fill="#f59e0b" />
  </svg>
);

// Couples/Matrimonio Hanging Edison Bulbs & Bench
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
    <rect x="18.5" y="14" width="3" height="4" fill="#27272a" />
    <rect x="38.5" y="13" width="3" height="4" fill="#27272a" />
    <rect x="58.5" y="13" width="3" height="4" fill="#27272a" />
    <rect x="78.5" y="14" width="3" height="4" fill="#27272a" />
    
    <g filter="drop-shadow(0 0 5px #f59e0b)">
      <circle cx="20" cy="20" r="4.5" fill="#fef08a" opacity="0.9" />
      <line x1="20" y1="16" x2="20" y2="21" stroke="#ea580c" strokeWidth="0.8" />
      <circle cx="40" cy="19" r="4.5" fill="#fef08a" opacity="0.9" />
      <line x1="40" y1="15" x2="40" y2="20" stroke="#ea580c" strokeWidth="0.8" />
      <circle cx="60" cy="19" r="4.5" fill="#fef08a" opacity="0.9" />
      <line x1="60" y1="15" x2="60" y2="20" stroke="#ea580c" strokeWidth="0.8" />
      <circle cx="80" cy="20" r="4.5" fill="#fef08a" opacity="0.9" />
      <line x1="80" y1="16" x2="80" y2="21" stroke="#ea580c" strokeWidth="0.8" />
    </g>

    <path d="M50,42 Q56,33 62,42 Q68,50 50,65 Q32,50 38,42 Q44,33 50,42 Z" fill="none" stroke="#f43f5e" strokeWidth="2.5" filter="drop-shadow(0 0 6px #f43f5e)" opacity="0.9" />
    <path d="M50,42 Q56,33 62,42 Q68,50 50,65 Q32,50 38,42 Q44,33 50,42 Z" fill="none" stroke="#ffe4e6" strokeWidth="0.8" opacity="0.95" />

    <ellipse cx="50" cy="116" rx="30" ry="3.5" fill="rgba(0,0,0,0.15)" />
    
    {/* Garden bench */}
    <path d="M16,92 Q22,86 28,92" stroke="#1c1b1a" strokeWidth="2" fill="none" />
    <path d="M72,92 Q78,86 84,92" stroke="#1c1b1a" strokeWidth="2" fill="none" />
    <line x1="24" y1="95" x2="20" y2="120" stroke="#1c1b1a" strokeWidth="3.5" />
    <line x1="76" y1="95" x2="80" y2="120" stroke="#1c1b1a" strokeWidth="3.5" />
    <line x1="32" y1="98" x2="34" y2="120" stroke="#1c1b1a" strokeWidth="2.5" />
    <line x1="68" y1="98" x2="66" y2="120" stroke="#1c1b1a" strokeWidth="2.5" />
    <rect x="22" y="80" width="56" height="4" rx="1" fill="#1c1b1a" />
    <rect x="22" y="88" width="56" height="4" rx="1" fill="#1c1b1a" />
    <rect x="18" y="93" width="64" height="5" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
  </svg>
);

// Beautiful SVG Mid-Century Sofa
const RealSofaSVG = () => (
  <svg 
    viewBox="0 0 400 160" 
    style={{
      position: 'absolute',
      bottom: '8px',
      width: '88%',
      height: '100px',
      zIndex: 2
    }}
  >
    <ellipse cx="200" cy="150" rx="165" ry="11" fill="rgba(28,27,26,0.16)" filter="blur(6px)" />
    <ellipse cx="50" cy="149" rx="10" ry="3" fill="rgba(28,27,26,0.25)" filter="blur(2px)" />
    <ellipse cx="350" cy="149" rx="10" ry="3" fill="rgba(28,27,26,0.25)" filter="blur(2px)" />
    <path d="M46,132 L38,151" stroke="#2d1c08" strokeWidth="7" strokeLinecap="round" />
    <path d="M354,132 L362,151" stroke="#2d1c08" strokeWidth="7" strokeLinecap="round" />
    <path d="M125,132 L125,148" stroke="#3a2512" strokeWidth="4.5" />
    <path d="M275,132 L275,148" stroke="#3a2512" strokeWidth="4.5" />
    <rect x="32" y="115" width="336" height="17" rx="3.5" fill="#ffd402" /> 
    <rect x="34" y="108" width="332" height="10" rx="2" fill="#4a4947" />
    <rect x="42" y="79" width="102" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="148" y="79" width="104" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="256" y="79" width="102" height="29" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
    <rect x="43" y="26" width="101" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="149" y="26" width="102" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="256" y="26" width="101" height="53" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="20" y="58" width="24" height="50" rx="8.5" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
    <rect x="356" y="58" width="24" height="50" rx="8.5" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
    <rect x="52" y="62" width="28" height="28" rx="6" fill="#ffd402" transform="rotate(-15 52 62)" opacity="0.95" />
    <rect x="320" y="62" width="28" height="28" rx="6" fill="#475569" transform="rotate(15 320 62)" opacity="0.95" />
  </svg>
);

export default function ProductPage({ addToCart, setTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedMakeup, setSelectedMakeup] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('none'); // 'none', 'resumen', 'mediano', 'grande'
  const [extraPhotos, setExtraPhotos] = useState('none'); // 'none', 'single', 'pack'
  const [cakeTopper, setCakeTopper] = useState(false); // Cumpleaños only
  const [totalPrice, setTotalPrice] = useState(2799);

  const categories = [
    {
      id: "cumple",
      name: "Cumpleaños",
      price: 2799,
      tagline: "Un año más retratado con estilo.",
      includes: [
        "1 Hora de sesión en estudio",
        "Set decorado con globos a elegir",
        "15 Fotografías digitales retocadas",
        "Galería digital de selección",
        "Pastel simulado para shoot"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos', 'topper']
    },
    {
      id: "xv",
      name: "XV Años",
      price: 4000,
      tagline: "Inmortaliza tu juventud eterna.",
      includes: [
        "2 Horas de sesión (Estudio + Exterior)",
        "3 Cambios de atuendo",
        "25 Fotografías digitales retocadas",
        "1 Cuadro Impreso Mediano de regalo",
        "Galería de selección activa"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos']
    },
    {
      id: "maternidad",
      name: "Maternidad",
      price: 3000,
      tagline: "La dulce espera inmortalizada.",
      includes: [
        "1.5 Horas de sesión en estudio",
        "Uso de vestidos del catálogo",
        "18 Fotografías digitales retocadas",
        "Maquillaje de vientre opcional",
        "Pareja e hijos incluidos sin costo"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos']
    },
    {
      id: "casual",
      name: "Casual",
      price: 2899,
      tagline: "Fotografía de retrato libre y moderna.",
      includes: [
        "1 Hora de sesión en locación urbana",
        "2 Cambios de ropa",
        "15 Fotografías digitales retocadas",
        "Asesoría de estilo y poses",
        "Entrega en formato alta resolución"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos']
    },
    {
      id: "graduacion",
      name: "Graduación",
      price: 3799,
      tagline: "El triunfo retratado con orgullo.",
      includes: [
        "1 Hora de sesión individual en estudio",
        "Renta de toga, birrete y estola",
        "12 Fotografías digitales retocadas",
        "1 Retrato impreso 8x10\"",
        "Acompañantes de familia incluidos"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos']
    },
    {
      id: "parejas",
      name: "Parejas",
      price: 2999,
      tagline: "Capturando miradas y risas reales.",
      includes: [
        "1.5 Horas en exteriores naturales",
        "20 Fotografías digitales retocadas",
        "Entrega en 10 días hábiles",
        "Dirección fotográfica divertida",
        "Asistencia de iluminación"
      ],
      complementsAllowed: ['makeup', 'frame', 'photos']
    }
  ];

  const activeCategory = categories[activeCategoryIndex];

  // Calculate pricing
  useEffect(() => {
    let price = activeCategory.price;

    if (selectedMakeup) {
      price += 800;
    }

    if (selectedFrame === 'resumen') price += 799;
    else if (selectedFrame === 'mediano') price += 1599;
    else if (selectedFrame === 'grande') price += 2599;

    if (extraPhotos === 'single') price += 150;
    else if (extraPhotos === 'pack') price += 499;

    if (cakeTopper && activeCategory.id === 'cumple') {
      price += 150;
    }

    setTotalPrice(price);
  }, [activeCategory.price, activeCategory.id, selectedMakeup, selectedFrame, extraPhotos, cakeTopper]);

  const handleCategoryChange = (index) => {
    setActiveCategoryIndex(index);
    setSelectedMakeup(false);
    setSelectedFrame('none');
    setExtraPhotos('none');
    setCakeTopper(false);
  };

  const handleAddToCart = () => {
    const options = [];
    if (selectedMakeup) options.push("Peinado y Maquillaje ($800)");
    if (selectedFrame !== 'none') {
      const frameNames = { resumen: "Cuadro Resumen (61x23cm)", mediano: "Cuadro Mediano (50x65cm)", grande: "Cuadro Grande (61x76cm)" };
      options.push(frameNames[selectedFrame]);
    }
    if (extraPhotos === 'single') options.push("1 Foto Digital Extra ($150)");
    else if (extraPhotos === 'pack') options.push("6 Fotos Digitales Extras ($499)");
    if (cakeTopper && activeCategory.id === 'cumple') options.push("Cake Topper Personalizado ($150)");

    const item = {
      id: `${activeCategory.id}-${Date.now()}`,
      type: 'package',
      name: `Sesión de ${activeCategory.name}`,
      category: activeCategory.name,
      price: totalPrice,
      options: options
    };

    addToCart(item);
  };

  const handleQuickWhatsapp = () => {
    const phoneNumber = "5662914092";
    let text = `Hola me interesa información del servicio de Sesión de ${activeCategory.name} de $${activeCategory.price.toLocaleString('es-MX')} MXN.`;
    
    const additions = [];
    if (selectedMakeup) additions.push("Peinado y Maquillaje (+ $800 MXN)");
    if (selectedFrame !== 'none') {
      const frameNames = { resumen: "Cuadro Resumen (+ $799 MXN)", mediano: "Cuadro Mediano (+ $1,599 MXN)", grande: "Cuadro Grande (+ $2,599 MXN)" };
      additions.push(frameNames[selectedFrame]);
    }
    if (extraPhotos === 'single') additions.push("1 Foto Digital Extra (+ $150 MXN)");
    else if (extraPhotos === 'pack') additions.push("6 Fotos Digitales Extras (+ $499 MXN)");
    if (cakeTopper && activeCategory.id === 'cumple') additions.push("Cake Topper Personalizado (+ $150 MXN)");

    if (additions.length > 0) {
      text += ` Me gustaría agregar los siguientes complementos:\n- ${additions.join('\n- ')}\n`;
      text += `Total configurado: $${totalPrice.toLocaleString('es-MX')} MXN.`;
    }
    
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/52${phoneNumber}?text=${encoded}`, '_blank');
  };

  const getStepSubtitle = (step) => {
    switch(step) {
      case 1: return 'Selección de la Temática';
      case 2: return 'Estilo y Maquillaje';
      case 3: return 'Producción y Fotos Extras';
      case 4: return 'Formato Impreso (Cuadros)';
      case 5: return 'Resumen y Ficha Técnica';
      default: return '';
    }
  };

  const getStepTitle = (step) => {
    switch(step) {
      case 1: return '¿Qué historia contaremos hoy?';
      case 2: return 'Luce impecable frente a los reflectores';
      case 3: return 'Agrega más magia y recuerdos digitales';
      case 4: return 'Inmortaliza tus obras en tu hogar';
      case 5: return 'Ficha Técnica de tu Sesión';
      default: return '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '110px',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-primary)',
      paddingLeft: '4vw',
      paddingRight: '4vw',
      paddingBottom: '5vh'
    }} className="fade-in">
      
      {/* Top progress bar */}
      <div style={{ width: '100%', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
          <span>PASO 0{currentStep} / 05</span>
          <span style={{ color: 'var(--accent-gold)' }}>{getStepSubtitle(currentStep).toUpperCase()}</span>
        </div>
        <div style={{ width: '100%', height: '3px', backgroundColor: 'var(--border-color)', borderRadius: '1.5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--accent-gold)',
            width: `${(currentStep / 5) * 100}%`,
            transition: 'width 0.6s var(--ease-custom)'
          }} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }} className="configurator-grid">
        
        {/* LEFT COLUMN: Workflow content */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 280px)', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
                  {activeCategory.tagline}
                </span>
                {setTab && (
                  <button 
                    onClick={() => setTab(`service-${activeCategory.id}`)}
                    className="interactive"
                    style={{
                      background: 'none',
                      border: '1px solid var(--accent-gold)',
                      borderRadius: '20px',
                      padding: '0.3rem 0.8rem',
                      color: 'var(--accent-gold)',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                      e.currentTarget.style.color = 'var(--bg-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--accent-gold)';
                    }}
                  >
                    Ver página exclusiva de {activeCategory.name} →
                  </button>
                )}
              </div>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', margin: '0.4rem 0', color: 'var(--text-primary)' }}>
                {getStepTitle(currentStep)}
              </h2>
            </div>

            {/* Step 1: Category lists */}
            {currentStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {categories.map((cat, index) => {
                  const isActive = index === activeCategoryIndex;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryChange(index)}
                      className="interactive glass"
                      style={{
                        padding: '1.5rem',
                        border: isActive ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'rgba(255, 212, 2, 0.06)' : 'var(--bg-card)',
                        transition: 'all 0.3s var(--ease-custom)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '160px'
                      }}
                    >
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.4rem', color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{cat.name}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{cat.tagline}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRECIO BASE</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>${cat.price.toLocaleString('es-MX')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 2: Makeup */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Asegura un acabado fotogénico impecable y siéntete como una estrella en nuestro tocador privado antes de la sesión.
                </p>
                <div
                  onClick={() => setSelectedMakeup(!selectedMakeup)}
                  className="interactive glass"
                  style={{
                    padding: '2rem',
                    borderRadius: '8px',
                    border: selectedMakeup ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: selectedMakeup ? 'rgba(255, 212, 2, 0.06)' : 'var(--bg-card)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s var(--ease-custom)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontWeight: '600' }}>Peinado y Maquillaje Profesional</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sesión de estilismo en estudio realizada por maquillistas de moda premium.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-gold)' }}>+$800 MXN</span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid var(--border-color)',
                      backgroundColor: selectedMakeup ? 'var(--accent-gold)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      {selectedMakeup && <Check size={18} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Props / Extras */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {activeCategory.id === 'cumple' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Props de Cumpleaños</h4>
                    <div
                      onClick={() => setCakeTopper(!cakeTopper)}
                      className="interactive glass"
                      style={{
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: cakeTopper ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        backgroundColor: cakeTopper ? 'rgba(255, 212, 2, 0.06)' : 'var(--bg-card)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s var(--ease-custom)'
                      }}
                    >
                      <div>
                        <h5 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Cake Topper Acrílico Personalizado</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Grabado láser con tu nombre y edad para decorar el pastel real/simulado en escena.</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>+$150 MXN</span>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: cakeTopper ? 'var(--accent-gold)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          {cakeTopper && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Imágenes Digitales Adicionales</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    Agrega archivos digitales adicionales retocados en alta resolución listos para descarga.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.2rem' }}>
                    {[
                      { id: 'none', label: 'Ninguna Extra', price: '+$0' },
                      { id: 'single', label: '1 Foto Extra', price: '+$150' },
                      { id: 'pack', label: 'Paquete de 6', price: '+$499' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setExtraPhotos(opt.id)}
                        className="interactive glass"
                        style={{
                          padding: '1.5rem 1rem',
                          border: extraPhotos === opt.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                          background: extraPhotos === opt.id ? 'rgba(255, 212, 2, 0.06)' : 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s var(--ease-custom)'
                        }}
                      >
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '700' }}>{opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Frame size choices */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                  Decora tus paredes con imágenes impresas profesionales. Nuestros marcos están hechos a mano en madera fina e incluyen cristal antirreflejante de museo.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  {[
                    { id: 'none', label: 'Ninguno', price: '+$0', desc: 'Mantener entrega únicamente en formato digital.' },
                    { id: 'resumen', label: 'Resumen (61x23 cm)', price: '+$799', desc: 'Diseño horizontal alargado perfecto para collages.' },
                    { id: 'mediano', label: 'Mediano (50x65 cm)', price: '+$1,599', desc: 'Excelente retrato clásico para pasillos o repisas.' },
                    { id: 'grande', label: 'Grande (61x76 cm)', price: '+$2,599', desc: 'Impacto visual majestuoso para tu sala principal.' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedFrame(opt.id)}
                      className="interactive glass"
                      style={{
                        padding: '1.5rem',
                        border: selectedFrame === opt.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        background: selectedFrame === opt.id ? 'rgba(255, 212, 2, 0.06)' : 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s var(--ease-custom)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '150px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{opt.desc}</div>
                      </div>
                      <div style={{ fontSize: '1rem', color: 'var(--accent-gold)', fontWeight: '700', marginTop: '10px' }}>{opt.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Summary */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Tu sesión de fotos ha sido configurada. Revisa la ficha técnica a la derecha para verificar que todo esté correcto. Agrégalo al carrito o inicia una cotización express por WhatsApp con un fotógrafo.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    onClick={handleAddToCart}
                    className="btn-premium btn-gold interactive"
                    style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <ShoppingCart size={18} /> Confirmar y Añadir a Mi Selección
                  </button>
                  <button
                    onClick={handleQuickWhatsapp}
                    className="interactive"
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--accent-green)',
                      color: 'var(--accent-green)',
                      padding: '1.2rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s',
                      borderRadius: '4px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(37,211,102,0.08)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MessageCircle size={18} /> Enviar Cotización por WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="interactive btn-premium"
              style={{
                padding: '0.8rem 2.2rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                color: currentStep === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
            >
              Atrás
            </button>

            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                className="interactive btn-premium btn-gold"
                style={{
                  padding: '0.8rem 2.2rem',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderRadius: '4px'
                }}
              >
                Continuar
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: High-Fidelity Studio diorama preview */}
        <div 
          className="configurator-preview-col"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            position: 'sticky',
            top: '100px',
            height: 'calc(100vh - 150px)',
            justifyContent: 'flex-start'
          }}
        >
          
          {/* Visual viewport wrapper */}
          {currentStep < 5 ? (
            <div className="glass" style={{
              padding: '1.5rem',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontWeight: '700' }}>
                {currentStep === 4 ? 'Simulación de Montaje en Sala' : 'Vista de Cámara en Vivo (Set del Shoot)'}
              </h4>
              
              {/* Studio Backdrop diorama */}
              {currentStep <= 3 && (
                <div style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: 'var(--bg-input)',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.04)'
                }}>
                  {/* Backdrop roll crossbar hanger */}
                  <div style={{ position: 'absolute', top: '30px', width: '80%', height: '3px', backgroundColor: '#52525b', zIndex: 1 }} />
                  <div style={{ position: 'absolute', left: '10%', top: '30px', width: '2px', height: '180px', backgroundColor: '#71717a', zIndex: 1 }} />
                  <div style={{ position: 'absolute', right: '10%', top: '30px', width: '2px', height: '180px', backgroundColor: '#71717a', zIndex: 1 }} />

                  {/* Softbox studio lights */}
                  <StudioLightSVG side="left" />
                  <StudioLightSVG side="right" />

                  {/* Colored studio backdrop roll paper */}
                  <div style={{
                    position: 'absolute',
                    bottom: '32px',
                    width: '74%',
                    height: '172px',
                    background: getBackdropColor(activeCategory.id),
                    borderRadius: '8px 8px 0 0',
                    boxShadow: 'inset 0 -12px 25px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.1)',
                    transition: 'background 0.8s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    zIndex: 2
                  }}>
                    {/* High-Fidelity Category Signature Visual Previews */}
                    {activeCategory.id === 'xv' && <XvDressSVG />}
                    {activeCategory.id === 'maternidad' && <MaternidadMoonSVG />}
                    {activeCategory.id === 'casual' && <CasualSeatSVG />}
                    {activeCategory.id === 'graduacion' && <GradCapSVG />}
                    {activeCategory.id === 'parejas' && <CouplesBenchSVG />}

                    {/* Volumetric Balloons with Highlights & Strings for Cumpleaños */}
                    {activeCategory.id === 'cumple' && (
                      <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {/* Balloon 1 */}
                        <div className="balloon gold-bal" style={{ position: 'absolute', left: '12%', bottom: '25px', width: '18px', height: '22px', backgroundColor: '#ffd700', borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15)', animation: 'floatBalloon 4s ease-in-out infinite' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '4px', width: '3px', height: '6px', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                          <div style={{ position: 'absolute', bottom: '-15px', left: '8px', width: '0.8px', height: '25px', backgroundColor: 'rgba(28,27,26,0.3)' }} />
                        </div>
                        {/* Balloon 2 */}
                        <div className="balloon silver-bal" style={{ position: 'absolute', left: '22%', bottom: '45px', width: '16px', height: '20px', backgroundColor: '#cbd5e1', borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)', animation: 'floatBalloon 4s ease-in-out infinite 0.7s' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', width: '2.5px', height: '5px', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                          <div style={{ position: 'absolute', bottom: '-18px', left: '7px', width: '0.8px', height: '30px', backgroundColor: 'rgba(28,27,26,0.3)' }} />
                        </div>
                        {/* Balloon 3 */}
                        <div className="balloon gold-bal" style={{ position: 'absolute', right: '12%', bottom: '18px', width: '18px', height: '22px', backgroundColor: '#ffd700', borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15)', animation: 'floatBalloon 4s ease-in-out infinite 1.2s' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '4px', width: '3px', height: '6px', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                          <div style={{ position: 'absolute', bottom: '-15px', left: '8px', width: '0.8px', height: '25px', backgroundColor: 'rgba(28,27,26,0.3)' }} />
                        </div>
                        {/* Balloon 4 */}
                        <div className="balloon silver-bal" style={{ position: 'absolute', right: '22%', bottom: '38px', width: '16px', height: '20px', backgroundColor: '#cbd5e1', borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)', animation: 'floatBalloon 4s ease-in-out infinite 0.3s' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', width: '2.5px', height: '5px', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                          <div style={{ position: 'absolute', bottom: '-18px', left: '7px', width: '0.8px', height: '30px', backgroundColor: 'rgba(28,27,26,0.3)' }} />
                        </div>
                      </div>
                    )}

                    {/* Lighting flare */}
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.4)',
                      filter: 'blur(30px)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* Interactive Props overlay */}
                  {cakeTopper && activeCategory.id === 'cumple' && <CakeSVG />}
                  {selectedMakeup && <VanityMirrorSVG />}

                  {/* Concrete studio floor base */}
                  <div style={{
                    width: '100%',
                    height: '32px',
                    backgroundColor: '#d6d3d1',
                    borderTop: '2px solid rgba(255,255,255,0.6)',
                    zIndex: 2,
                    position: 'relative',
                    boxShadow: '0 -4px 10px rgba(0,0,0,0.06)'
                  }} />

                  {/* Camera viewfinder display with Rule of Thirds grid */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 10,
                    border: '1px solid var(--border-color)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '6px'
                  }}>
                    {/* Viewfinder Grid overlay */}
                    <div style={{ position: 'absolute', top: 0, left: '33%', bottom: 0, width: '0.5px', backgroundColor: 'rgba(255, 212, 2, 0.12)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', top: 0, left: '66%', bottom: 0, width: '0.5px', backgroundColor: 'rgba(255, 212, 2, 0.12)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: '0.5px', backgroundColor: 'rgba(255, 212, 2, 0.12)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: '0.5px', backgroundColor: 'rgba(255, 212, 2, 0.12)', zIndex: 1 }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.55rem', color: '#ffd402', fontFamily: 'monospace', fontWeight: 'bold', zIndex: 2 }}>
                      <span>[VIEWFINDER]</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} /> REC
                      </span>
                    </div>

                    {/* DSLR Focus Target Bracket */}
                    <div style={{
                      position: 'absolute',
                      top: '46%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '40px',
                      border: '1px dashed rgba(255, 212, 2, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'var(--accent-gold)',
                        borderRadius: '50%',
                        boxShadow: '0 0 5px var(--accent-gold)'
                      }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '4px', borderTop: '1px solid var(--accent-gold)', borderLeft: '1px solid var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', borderTop: '1px solid var(--accent-gold)', borderRight: '1px solid var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '4px', height: '4px', borderBottom: '1px solid var(--accent-gold)', borderLeft: '1px solid var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '4px', borderBottom: '1px solid var(--accent-gold)', borderRight: '1px solid var(--accent-gold)' }} />
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      backgroundColor: '#1c1b1a',
                      color: '#fafafa',
                      padding: '3px 0',
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                      width: 'calc(100% + 12px)',
                      marginLeft: '-6px',
                      marginBottom: '-6px',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      zIndex: 2
                    }}>
                      <span>ISO <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{activeCategory.price}</span></span>
                      <span>f/2.8</span>
                      <span>-1..0..+1</span>
                      <span style={{ color: '#1eb55b' }}>● LOCK</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sofa / Wall Frame Visualizer */}
              {currentStep === 4 && (
                <div style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: 'var(--bg-input)',
                  position: 'relative',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    width: '100%',
                    height: '60px',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.02), transparent)',
                    pointerEvents: 'none'
                  }} />

                  <RealSofaSVG />

                  {/* Framed photo */}
                  {selectedFrame !== 'none' ? (
                    <div style={{
                      position: 'absolute',
                      bottom: '95px',
                      backgroundColor: '#ffffff',
                      border: '6px solid #4a3319',
                      boxShadow: '0 12px 30px rgba(28,27,26,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.5s var(--ease-custom)',
                      backgroundImage: `url("${getFrameImage(activeCategory.id)}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 3,
                      width: selectedFrame === 'resumen' ? '120px' : selectedFrame === 'mediano' ? '85px' : '110px',
                      height: selectedFrame === 'resumen' ? '45px' : selectedFrame === 'mediano' ? '110px' : '140px',
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        padding: '2px 6px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '0.55rem',
                        letterSpacing: '0.02em',
                        color: '#1c1b1a',
                        transform: 'scale(0.85)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}>
                        {selectedFrame === 'resumen' ? '61x23 cm' : selectedFrame === 'mediano' ? '50x65 cm' : '61x76 cm'}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', zIndex: 1, paddingBottom: '30px' }}>
                      Selecciona un cuadro para verlo montado.
                    </p>
                  )}
                </div>
              )}
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4', margin: '10px 0 0 0' }}>
                {currentStep === 4 
                  ? 'Visualización a escala estimada en una sala residencial sobre un sofá estándar.' 
                  : 'Diorama interactivo del estudio fotográfico con los elementos seleccionados.'}
              </p>
            </div>
          ) : null}

          {/* Technical Invoice Receipt (Shown in step 5) */}
          {currentStep === 5 ? (
            <div style={{
              position: 'relative',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '12px 12px 8px 8px',
              boxShadow: '0 15px 35px rgba(28,27,26,0.08)',
              border: '1px solid var(--border-color)',
              paddingTop: '20px',
              overflow: 'hidden'
            }}>
              {/* Printer slit */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '14px',
                backgroundColor: '#cbd5e1',
                borderBottom: '3px solid #94a3b8',
                boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.1)',
                zIndex: 5
              }} />

              {/* Rolling paper receipt */}
              <div 
                className="receipt-paper"
                key={totalPrice}
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--text-primary)',
                  padding: '2rem 1.5rem',
                  fontFamily: 'monospace',
                  position: 'relative',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.03)',
                  margin: '0 12px 12px 12px',
                  borderRadius: '2px',
                  animation: 'printReceipt 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  backgroundImage: 'linear-gradient(-45deg, var(--bg-input) 5px, transparent 0), linear-gradient(45deg, var(--bg-input) 5px, transparent 0)',
                  backgroundSize: '10px 10px',
                  backgroundPosition: 'bottom left',
                  paddingBottom: '2.5rem'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>BUENA TOMA STUDIO</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>FECHA: {new Date().toLocaleDateString('es-MX')}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>TICKET DE REGISTRO TECNICO</div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.5rem 0' }} />

                <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                    <span>SESION {activeCategory.name.toUpperCase()}</span>
                    <span>${activeCategory.price.toLocaleString('es-MX')}</span>
                  </div>
                  
                  {selectedMakeup && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>+ MAQUILLAJE Y PEINADO</span>
                      <span>+$800</span>
                    </div>
                  )}
                  {selectedFrame !== 'none' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>+ CUADRO ({selectedFrame.toUpperCase()})</span>
                      <span>
                        +{selectedFrame === 'resumen' ? '799' : selectedFrame === 'mediano' ? '1,599' : '2,599'}
                      </span>
                    </div>
                  )}
                  {extraPhotos !== 'none' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>+ FOTOS EXTRA ({extraPhotos.toUpperCase()})</span>
                      <span>+{extraPhotos === 'single' ? '150' : '499'}</span>
                    </div>
                  )}
                  {cakeTopper && activeCategory.id === 'cumple' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>+ CAKE TOPPER AC.</span>
                      <span>+$150</span>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.8rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold' }}>
                  <span style={{ fontSize: '0.85rem' }}>TOTAL IMPORTE:</span>
                  <span style={{ fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
                    ${totalPrice.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                {/* Barcode SVG */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.2rem', gap: '4px' }}>
                  <svg width="120" height="24" style={{ opacity: 0.85 }}>
                    <rect x="5" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="9" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="12" y="0" width="3" height="24" fill="#1c1b1a" />
                    <rect x="17" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="21" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="24" y="0" width="4" height="24" fill="#1c1b1a" />
                    <rect x="30" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="34" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="37" y="0" width="3" height="24" fill="#1c1b1a" />
                    <rect x="42" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="46" y="0" width="4" height="24" fill="#1c1b1a" />
                    <rect x="52" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="55" y="0" width="3" height="24" fill="#1c1b1a" />
                    <rect x="60" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="64" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="67" y="0" width="4" height="24" fill="#1c1b1a" />
                    <rect x="73" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="77" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="80" y="0" width="3" height="24" fill="#1c1b1a" />
                    <rect x="85" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="89" y="0" width="4" height="24" fill="#1c1b1a" />
                    <rect x="95" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="98" y="0" width="3" height="24" fill="#1c1b1a" />
                    <rect x="103" y="0" width="2" height="24" fill="#1c1b1a" />
                    <rect x="107" y="0" width="1" height="24" fill="#1c1b1a" />
                    <rect x="110" y="0" width="4" height="24" fill="#1c1b1a" />
                  </svg>
                  <span style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                    BT-{activeCategory.id.toUpperCase()}-{totalPrice}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Compact side drawer subtotal */
            <div className="glass" style={{
              padding: '1.5rem',
              borderRadius: '8px',
              borderTop: '2px solid var(--accent-gold)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'var(--bg-card)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
                  Resumen Acumulado
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span>Sesión {activeCategory.name}</span>
                  <span>${activeCategory.price.toLocaleString('es-MX')} MXN</span>
                </div>
                {selectedMakeup && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    <span>+ Maquillaje y Peinado</span>
                    <span>+$800 MXN</span>
                  </div>
                )}
                {cakeTopper && activeCategory.id === 'cumple' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    <span>+ Cake Topper</span>
                    <span>+$150 MXN</span>
                  </div>
                )}
                {extraPhotos !== 'none' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    <span>+ Fotos Extras ({extraPhotos === 'single' ? '1 foto' : 'paquete 6'})</span>
                    <span>{extraPhotos === 'single' ? '+$150' : '+$499'} MXN</span>
                  </div>
                )}
                {selectedFrame !== 'none' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    <span>+ Cuadro ({selectedFrame})</span>
                    <span>
                      {selectedFrame === 'resumen' ? '+$799' : selectedFrame === 'mediano' ? '+$1,599' : '+$2,599'} MXN
                    </span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Subtotal:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                  ${totalPrice.toLocaleString('es-MX')} MXN
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes floatBalloon {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes printReceipt {
          from { transform: translateY(-40px); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .configurator-grid {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: relative !important;
            top: 0 !important;
            height: auto !important;
          }
        }
      `}</style>

    </div>
  );
}
