import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Zap, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home({ setTab }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // 3D Tilt angles
  const [flashActive, setFlashActive] = useState(false); // Viewport shutter flash
  const [dioramaParallax, setDioramaParallax] = useState({ x: 0, y: 0 }); // 3D diorama camera rot

  // New refs for Film Strip Parallax
  const filmSectionRef = useRef(null);
  const filmTrackRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const slidesSectionRef = useRef(null);

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [slideTilt, setSlideTilt] = useState({ x: 0, y: 0 });

  // Testimonials Scrapbook states
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [flipDirection, setFlipDirection] = useState(null); // 'forward', 'backward', or null
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      if (!slidesSectionRef.current) return;
      
      const rect = slidesSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollEnd = - (rect.height - windowHeight);
      
      let progress = 0;
      if (rect.top <= 0 && rect.top >= scrollEnd) {
        progress = rect.top / scrollEnd; 
      } else if (rect.top < scrollEnd) {
        progress = 1;
      }
      
      const slot = Math.min(3, Math.floor(progress * 4));
      setActiveSlideIdx((prev) => (prev !== slot ? slot : prev));
    };
    
    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSlideMouseMove = (e, isActive) => {
    if (!isActive) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    setSlideTilt({
      x: -normY * 18,
      y: normX * 18
    });
  };

  const handleSlideMouseLeave = () => {
    setSlideTilt({ x: 0, y: 0 });
  };

  const slidePillars = [
    {
      title: "Iluminación Artística",
      description: "Dominamos contrastes tridimensionales y luz difusa de estudio para esculpir volúmenes y crear atmósferas estéticas memorables. Cada haz de luz es una decisión artística pensada para ti.",
      icon: Zap,
      img: "/images/studio_setup.png"
    },
    {
      title: "Sets Únicos",
      description: "Diseñamos e integramos decoraciones modernas, minimalistas y elegantes adaptadas a la esencia de cada shoot. Nos alejamos de los fondos de lona planos y aburridos.",
      icon: Award,
      img: "/images/birthday_set.png"
    },
    {
      title: "Edición Selecta",
      description: "Retoque digital profesional de alta gama con paletas de color cinematográficas y tonalidades mate exclusivas que diferencian nuestras capturas de cualquier otra.",
      icon: Sparkles,
      img: "/images/couple_laugh.png"
    },
    {
      title: "Entrega Ágil",
      description: "Garantizamos la entrega de tu galería digital completa en un plazo de 10 a 12 días hábiles, incluyendo un visualizador premium para seleccionar tus cuadros físicos.",
      icon: Sparkles,
      img: "/images/maternity_session.png"
    }
  ];

  const dioramaCardsConfig = [
    { left: '16%', top: '15%', z: -200, rotation: -6, zIndex: 1 },
    { left: '72%', top: '12%', z: -400, rotation: 8, zIndex: 2 },
    { left: '12%', top: '56%', z: -300, rotation: -12, zIndex: 3 },
    { left: '76%', top: '58%', z: -450, rotation: 5, zIndex: 4 },
    { left: '44%', top: '65%', z: -250, rotation: -4, zIndex: 5 }
  ];

  const handleDioramaMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    setDioramaParallax({
      x: normX * 12,
      y: -normY * 12
    });
  };

  const handleDioramaMouseLeave = () => {
    setDioramaParallax({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  };

  const handleActiveCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    setTilt({
      x: -normY * 16,
      y: normX * 16
    });
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % heroCategories.length);
    setTilt({ x: 0, y: 0 });
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + heroCategories.length) % heroCategories.length);
    setTilt({ x: 0, y: 0 });
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);
  };

  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      if (!portfolioSectionRef.current) return;
      
      const rect = portfolioSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollEnd = - (rect.height - windowHeight);
      
      let progress = 0;
      if (rect.top <= 0 && rect.top >= scrollEnd) {
        progress = rect.top / scrollEnd; 
      } else if (rect.top < scrollEnd) {
        progress = 1;
      }
      
      // Update each 3D card's Z transform, opacity, and filter (blur)
      const cards = portfolioSectionRef.current.querySelectorAll('.portfolio-tunnel-card');
      
      cards.forEach((card) => {
        const startZ = parseFloat(card.getAttribute('data-start-z'));
        const endZ = parseFloat(card.getAttribute('data-end-z'));
        const rotation = parseFloat(card.getAttribute('data-rotation'));
        
        // Dynamic travel per card based on its custom final Z position
        const travelZ = endZ - startZ; 
        const currentZ = startZ + progress * travelZ;
        
        let opacity = 1;
        if (currentZ < -800) {
          opacity = 0;
        } else if (currentZ < -500) {
          opacity = (currentZ + 800) / 300;
        } else if (currentZ > 100) {
          opacity = Math.max(0, 1 - (currentZ - 100) / 200);
        }
        
        let blur = 0;
        if (currentZ < -500) {
          blur = Math.min(5, (-500 - currentZ) * 0.015);
        } else if (currentZ > 100) {
          blur = Math.min(4, (currentZ - 100) * 0.02);
        }
        
        card.style.transform = `translate3d(0, 0, ${currentZ}px) rotate(${rotation}deg)`;
        card.style.opacity = opacity;
        card.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
        
        if (currentZ > 150 || currentZ < -400) {
          card.style.pointerEvents = 'none';
        } else {
          card.style.pointerEvents = 'auto';
        }
      });

      // View all button fade-in at the end of tunnel scroll
      const actionBtn = portfolioSectionRef.current.querySelector('.portfolio-tunnel-action');
      if (actionBtn) {
        if (progress > 0.7) {
          actionBtn.style.opacity = (progress - 0.7) / 0.3;
          actionBtn.style.pointerEvents = 'auto';
        } else {
          actionBtn.style.opacity = 0;
          actionBtn.style.pointerEvents = 'none';
        }
      }
    };
    
    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      if (!filmSectionRef.current || !filmTrackRef.current) return;
      
      const rect = filmSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollEnd = - (rect.height - windowHeight);
      
      let progress = 0;
      if (rect.top <= 0 && rect.top >= scrollEnd) {
        progress = rect.top / scrollEnd; 
      } else if (rect.top < scrollEnd) {
        progress = 1;
      }
      
      // Calculate how far to move the track
      const maxScroll = filmTrackRef.current.scrollWidth - window.innerWidth;
      const xTranslate = -progress * maxScroll;
      
      filmTrackRef.current.style.transform = `translate3d(${xTranslate}px, 0, 0)`;

      // Upgraded effects: 3D Horizontal Text Shearing Parallax
      const line1 = document.querySelector('.film-strip-title-line-1');
      const line2 = document.querySelector('.film-strip-title-line-2');
      if (line1) {
        line1.style.transform = `translate3d(${-progress * 80}px, 0, 0)`;
      }
      if (line2) {
        line2.style.transform = `translate3d(${progress * 80}px, 0, 0)`;
      }

      // Upgraded effects: Film Roll timeline bar & frame counter
      const bar = document.querySelector('.timeline-bar-progress');
      const counter = document.querySelector('.timeline-frame-counter');
      if (bar) {
        bar.style.width = `${progress * 100}%`;
      }
      if (counter) {
        const frameNum = Math.min(6, Math.floor(progress * 5.99) + 1);
        counter.textContent = `FRAME 0${frameNum}/06`;
      }
    };
    
    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // initial layout
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const filmPhotos = [
    "/images/film_camera.png",
    "/images/studio_setup.png",
    "/images/xv_portrait.png",
    "/images/couple_laugh.png",
    "/images/birthday_set.png",
    "/images/maternity_session.png"
  ];

  const heroCategories = [
    {
      id: "cumple",
      title: "Cumpleaños 🎂",
      tagline: "Celebra la vida a todo color",
      description: "Sets decorados con globos, pasteles simulados y accesorios temáticos para capturar risas espontáneas.",
      price: "$2,799",
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      specs: "ISO 100 • 50MM • F/1.8 • SH-01"
    },
    {
      id: "xv",
      title: "XV Años 👑",
      tagline: "El inicio de tu propia historia",
      description: "Elegancia en locaciones al aire libre y sets en estudio que inmortalizan tu vestido y estilo con luz natural.",
      price: "$4,000",
      img: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
      specs: "ISO 64 • 85MM • F/1.4 • SH-02"
    },
    {
      id: "maternidad",
      title: "Maternidad 🍼",
      tagline: "La dulce espera en imágenes",
      description: "La emotividad de la espera retratada con vestidos de catálogo y luces suaves. Pareja e hijos incluidos.",
      price: "$3,000",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      specs: "ISO 200 • 35MM • F/2.0 • SH-03"
    },
    {
      id: "casual",
      title: "Sesiones Casuales ⚡",
      tagline: "Sé tú mismo, sin poses rígidas",
      description: "Fotografía de retrato libre en exteriores urbanos o estudio, ideal para proyectar tu esencia natural.",
      price: "$2,899",
      img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
      specs: "ISO 100 • 50MM • F/1.2 • SH-04"
    },
    {
      id: "parejas",
      title: "Parejas 💖",
      tagline: "Tu amor capturado en una toma",
      description: "Sesiones divertidas en exterior con dirección fotográfica natural para congelar tus miradas y complicidades.",
      price: "$2,999",
      img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
      specs: "ISO 160 • 85MM • F/1.8 • SH-05"
    }
  ];

  const activeCategory = heroCategories[activeIdx];

  const clientReviews = [
    {
      id: 1,
      name: "Pamela Oramas",
      session: "Sesión de Cumpleaños 🎂",
      quote: "Es una increíble experiencia, sin duda el mejor regalo que me he dado en mucho tiempo. El trato del fotógrafo te hace sentir súper cómodo y los resultados del retoque son espectaculares.",
      img: "/images/birthday_set.png"
    },
    {
      id: 2,
      name: "Guadalupe Gil",
      session: "Sesión de XV Años 👑",
      quote: "El paquete de XV años de mi hija superó nuestras expectativas. Desde el maquillaje profesional hasta los cuadros fotográficos de madera de excelente calidad. Todo el staff es sumamente profesional.",
      img: "/images/xv_portrait.png"
    },
    {
      id: 3,
      name: "Carlos y Jania",
      session: "Sesión de Pareja 💖",
      quote: "Súper recomendadas las fotos casuales. No sabíamos posar pero nos guiaron de una manera súper divertida y natural en el estudio. Todo quedó precioso.",
      img: "/images/couple_laugh.png"
    }
  ];

  const handleTestimonialNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('forward');
    
    const nextIdx = (testimonialIdx + 1) % clientReviews.length;
    setTargetIdx(nextIdx);

    // Halfway through the flip (400ms), update static background pages
    setTimeout(() => {
      // Static pages are updated while page is vertical (90deg)
      setTestimonialIdx(nextIdx);
    }, 400);

    // Complete the flip animation (800ms)
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };

  const handleTestimonialPrev = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('backward');
    
    const prevIdx = (testimonialIdx - 1 + clientReviews.length) % clientReviews.length;
    setTargetIdx(prevIdx);

    // Halfway through the flip (400ms), update static background pages
    setTimeout(() => {
      setTestimonialIdx(prevIdx);
    }, 400);

    // Complete the flip animation (800ms)
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };





  const tunnelCards = [
    { id: 1, left: '12%', top: '22%', startZ: -300, endZ: 1000, rotation: -6, caption: 'Pamela Oramas', tag: 'Cumpleaños 🎂', img: '/images/birthday_set.png' },
    { id: 2, left: '72%', top: '18%', startZ: -600, endZ: 1000, rotation: 8, caption: 'Sofía Gil', tag: 'XV Años 👑', img: '/images/xv_portrait.png' },
    { id: 3, left: '8%', top: '60%', startZ: -900, endZ: 1000, rotation: -10, caption: 'Dulce espera', tag: 'Maternidad 🍼', img: '/images/maternity_session.png' },
    { id: 4, left: '76%', top: '65%', startZ: -1200, endZ: 1000, rotation: 5, caption: 'Love shoot', tag: 'Parejas 💖', img: '/images/couple_laugh.png' },
    { id: 5, left: '12%', top: '15%', startZ: -1500, endZ: -120, rotation: -4, caption: 'Estudio setup', tag: 'Sets Únicos ⚡', img: '/images/studio_setup.png' },
    { id: 6, left: '8%', top: '50%', startZ: -1800, endZ: -180, rotation: 12, caption: 'Capturas', tag: 'Casual ⚡', img: '/images/film_camera.png' },
    { id: 7, left: '70%', top: '15%', startZ: -2100, endZ: 20, rotation: -7, caption: 'Cake smash', tag: 'Cumpleaños 🎂', img: '/images/birthday_set.png' },
    { id: 8, left: '66%', top: '50%', startZ: -2400, endZ: -60, rotation: 6, caption: 'Retratos', tag: 'Casual ⚡', img: '/images/xv_portrait.png' }
  ];

  return (
    <div 
      style={{ paddingTop: '75px' }} 
      className="fade-in"
    >
      {/* 1. Fullscreen Camera Shutter Flash Overlay */}
      <div className={`camera-flash-overlay ${flashActive ? 'active' : ''}`} />
      
      {/* 2. Polaroid Stack Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Dynamic ambient background glow */}
        <div style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 150, 104, 0.04) 0%, rgba(0,0,0,0) 70%)',
          top: '-10%',
          right: '-10%',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <div className="polaroid-hero-grid">
            
            {/* Left Column: Synced Info Text Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
              <div>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1rem'
                }}>
                  <Sparkles size={16} /> Buena Toma Estudio
                </span>
                
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                  lineHeight: '1.15',
                  marginBottom: '1.2rem',
                  fontWeight: '700'
                }}>
                  Fotografía que <br />
                  <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: '300', color: 'var(--accent-gold)' }}>
                    cuenta historias.
                  </span>
                </h1>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  maxWidth: '520px',
                  fontWeight: '300'
                }}>
                  <span className="desktop-only">Pasa el mouse sobre la foto para inclinarla en 3D. </span>
                  <span className="mobile-only">Toca o desliza sobre las fotos. </span>
                  Alterna los sets decorados de nuestro estudio en CDMX.
                </p>
              </div>

              {/* Dynamic Info Panel Card */}
              <div 
                className="glass fade-in" 
                key={activeCategory.id}
                style={{
                  padding: '2rem',
                  borderTop: '2px solid var(--accent-gold)',
                  maxWidth: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  boxShadow: '0 15px 35px rgba(28,27,26,0.03)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.15em', fontWeight: '600' }}>
                  {activeCategory.tagline}
                </span>
                <h3 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                  {activeCategory.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0.2rem 0' }}>
                  {activeCategory.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '6px' }}>Desde</span>
                    <span style={{ fontWeight: '700', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{activeCategory.price} MXN</span>
                  </div>
                  <button 
                    onClick={() => setTab(`service-${activeCategory.id}`)}
                    className="btn-premium btn-gold interactive"
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem' }}
                  >
                    Personalizar <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Suspended Diorama Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
              
              {/* Diorama Canvas Wrapper */}
              <div style={{ width: '100%', position: 'relative' }}>
                <div 
                  className="hero-diorama-container"
                  onMouseMove={handleDioramaMouseMove}
                  onMouseLeave={handleDioramaMouseLeave}
                  style={{
                    transform: `rotateX(${dioramaParallax.y}deg) rotateY(${dioramaParallax.x}deg)`
                  }}
                >
                  {heroCategories.map((cat, idx) => {
                    const isActive = idx === activeIdx;
                    const config = dioramaCardsConfig[idx];

                    return (
                      <div
                        key={cat.id}
                        onClick={() => !isActive && setActiveIdx(idx)}
                        className={`hero-diorama-card ${isActive ? 'active-card' : 'background-card'} interactive`}
                        onMouseMove={isActive ? handleActiveCardMouseMove : null}
                        style={{
                          left: isActive ? '50%' : config.left,
                          top: isActive ? '45%' : config.top,
                          transform: isActive
                            ? `translate(-50%, -50%) translate3d(0, 0, 160px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                            : `translate3d(0, 0, ${config.z}px) rotate(${config.rotation}deg)`,
                          opacity: isActive ? 1 : 0.6,
                          filter: isActive ? 'none' : 'blur(2px) grayscale(25%)',
                          zIndex: isActive ? 100 : config.zIndex
                        }}
                      >
                        {/* Photo Container */}
                        <div className="hero-diorama-photo-frame">
                          <img 
                            src={cat.img} 
                            alt={cat.title} 
                          />
                          {/* Typewriter metadata tag */}
                          <div className="hero-diorama-metadata">
                            {cat.specs}
                          </div>
                        </div>
                        
                        {/* Felt marker handwriting name */}
                        <div className="hero-diorama-handwritten">
                          {cat.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Left Floating Arrow */}
                <button 
                  onClick={handlePrev}
                  className="diorama-nav-btn diorama-nav-btn-left interactive"
                  title="Anterior"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right Floating Arrow */}
                <button 
                  onClick={handleNext}
                  className="diorama-nav-btn diorama-nav-btn-right interactive"
                  title="Siguiente"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Minimalist Golden Progress Bar Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', width: '120px', zIndex: 12 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.1em' }}>
                  0{activeIdx + 1} / 0{heroCategories.length}
                </span>
                <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(28, 27, 26, 0.08)', position: 'relative', borderRadius: '1px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      height: '100%', 
                      backgroundColor: 'var(--accent-gold)', 
                      width: `${((activeIdx + 1) / heroCategories.length) * 100}%`,
                      transition: 'width 0.6s var(--ease-custom)'
                    }} 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Film Strip Parallax Section (Darkroom) */}
      <section className="film-strip-section" ref={filmSectionRef}>
        {/* Red Room Atmosphere Glow */}
        <div className="darkroom-light-glow" />

        <div className="film-strip-sticky">
          
          {/* Centered Typography with mix-blend-mode & shearing split lines */}
          <div className="film-strip-title-overlay">
            <h2>
              <span className="film-strip-title-line-1">La belleza de lo</span>
              <span className="film-strip-title-line-2" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>espontáneo</span>
            </h2>
          </div>

          {/* Scrolling Film Track */}
          <div className="film-strip-track" ref={filmTrackRef}>
            {filmPhotos.map((img, i) => (
              <div key={i} className="film-frame" data-frame={`2${i + 1}A`}>
                <img src={img} alt={`Film frame ${i}`} />
              </div>
            ))}
          </div>

          {/* Film roll progress timeline */}
          <div className="film-roll-timeline">
            <span className="timeline-brand">TX 400</span>
            <div className="timeline-bar-wrapper">
              <div className="timeline-bar-progress"></div>
            </div>
            <span className="timeline-frame-counter">FRAME 01/06</span>
          </div>

        </div>
      </section>

      {/* 2.5 Brand Value Pillars - 3D Slide Projector Stack (Light Theme) */}
      <section className="slides-section" ref={slidesSectionRef}>
        <div className="slides-sticky">
          
          {/* Left Column: Brand Value Statement & Active Pillar Details */}
          <div className="slides-left-content">
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Nuestro Método
              </span>
              <h2 style={{ fontSize: '3rem', lineHeight: '1.1', color: 'var(--text-primary)', margin: 0 }}>
                Detrás de <br />
                <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>la lente</span>
              </h2>
            </div>

            {/* Active description panel with fade animation */}
            <div style={{ minHeight: '180px', position: 'relative' }}>
              {slidePillars.map((pillar, i) => {
                const PillarIcon = pillar.icon;
                const isActive = i === activeSlideIdx;
                return (
                  <div
                    key={i}
                    className="pillar-text-panel"
                    style={{
                      position: isActive ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(184, 150, 104, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                        <PillarIcon size={22} style={{ color: 'var(--accent-gold)' }} />
                      </div>
                      <h4 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>{pillar.title}</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem', margin: 0, fontWeight: 300 }}>
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Projector Slide Stack */}
          <div className="slides-right-content">
            {/* Ambient Projection Glow */}
            <div className="projector-beam" />

            {/* Render the 4 physical slides in a 3D Stack */}
            {slidePillars.map((slide, i) => {
              const diff = (i - activeSlideIdx + 4) % 4;
              const isActive = diff === 0;
              
              const staticRotations = [-4, 6, -8, 3];
              const rotation = staticRotations[i];

              return (
                <div
                  key={i}
                  className={`photo-slide slide-depth-${diff} ${isActive ? 'active-slide' : ''}`}
                  data-index={`0${i + 1}`}
                  onMouseMove={(e) => handleSlideMouseMove(e, isActive)}
                  onMouseLeave={handleSlideMouseLeave}
                  style={{
                    transform: isActive
                      ? `translate3d(0, 0, 80px) rotateX(${slideTilt.x}deg) rotateY(${slideTilt.y}deg) rotate(${rotation}deg)`
                      : undefined
                  }}
                >
                  <div className="photo-slide-img-wrapper">
                    <img src={slide.img} alt={slide.title} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Portfolio 3D Z-Axis Tunnel Showcase */}
      <section className="portfolio-tunnel-section" ref={portfolioSectionRef}>
        <div className="portfolio-tunnel-sticky">
          
          {/* Static Title Overlay */}
          <div className="portfolio-tunnel-title">
            <span>Portafolio Reciente</span>
            <h2>Tomas Capturadas</h2>
          </div>

          {/* 3D Perspective Card Container */}
          <div className="portfolio-tunnel-container">
            {tunnelCards.map((card) => (
              <div
                key={card.id}
                className="portfolio-tunnel-card"
                data-id={card.id}
                data-start-z={card.startZ}
                data-end-z={card.endZ}
                data-rotation={card.rotation}
                style={{
                  left: card.left,
                  top: card.top,
                  transform: `translate3d(0, 0, ${card.startZ}px) rotate(${card.rotation}deg)`,
                  opacity: 0,
                  pointerEvents: 'none'
                }}
              >
                <div className="portfolio-tunnel-card-photo">
                  <img src={card.img} alt={card.caption} />
                </div>
                <div className="portfolio-tunnel-card-caption">{card.caption}</div>
                <span className="portfolio-tunnel-card-tag">{card.tag}</span>
              </div>
            ))}
          </div>

          {/* Call-to-action that fades in at the end of the tunnel scroll */}
          <div className="portfolio-tunnel-action" style={{ opacity: 0, pointerEvents: 'none' }}>
            <button onClick={() => setTab('portfolio')} className="portfolio-btn-premium interactive">
              Ver Todo el Portafolio
            </button>
          </div>

        </div>
      </section>

      {/* 4. Client Testimonies (Scrapbook Guestbook 3D Album) */}
      <section className="testimonies-section">
        <div className="container">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '5rem', color: 'var(--text-primary)' }}>
            ¿Qué dicen de <span style={{ color: 'var(--accent-gold)' }}>nosotros</span>?
          </h2>

          <div className="album-container">
            <div className={`album-book ${flipDirection === 'forward' ? 'animating-forward' : ''} ${flipDirection === 'backward' ? 'animating-backward' : ''}`}>
              
              {/* Static Left Underlay Page (Portrait Image) */}
              <div className="album-page album-page-left">
                <div className="album-photo-frame">
                  <img 
                    src={clientReviews[flipDirection === 'backward' ? targetIdx : testimonialIdx].img} 
                    alt="Static underlay portrait" 
                  />
                  <div className="album-photo-tape-top-left" />
                  <div className="album-photo-tape-bottom-right" />
                </div>
              </div>

              {/* Depth shadows for realistic light oclusion during lift-off */}
              <div className="album-depth-shadow album-depth-shadow-left" />
              <div className="album-depth-shadow album-depth-shadow-right" />

              {/* Book Spine Seam */}
              <div className="album-spine" />

              {/* Static Right Underlay Page (Testimonial Text) */}
              <div className="album-page album-page-right">
                <span className="album-quote-mark">“</span>
                <p className="album-quote-text">
                  {clientReviews[flipDirection === 'forward' ? targetIdx : testimonialIdx].quote}
                </p>
                <div className="album-author-info">
                  <h4>{clientReviews[flipDirection === 'forward' ? targetIdx : testimonialIdx].name}</h4>
                  <span>{clientReviews[flipDirection === 'forward' ? targetIdx : testimonialIdx].session}</span>
                </div>
              </div>

              {/* Dynamic Double-Sided Flipping Leaf */}
              {flipDirection && (
                <div className={`album-flipping-page ${flipDirection === 'forward' ? 'flip-forward' : 'flip-backward'}`}>
                  {/* Front Face: Old Right page text in forward, New Right page text in backward */}
                  <div className="page-face page-face-front">
                    <span className="album-quote-mark">“</span>
                    <p className="album-quote-text">
                      {clientReviews[flipDirection === 'forward' ? testimonialIdx : targetIdx].quote}
                    </p>
                    <div className="album-author-info">
                      <h4>{clientReviews[flipDirection === 'forward' ? testimonialIdx : targetIdx].name}</h4>
                      <span>{clientReviews[flipDirection === 'forward' ? testimonialIdx : targetIdx].session}</span>
                    </div>
                  </div>

                  {/* Back Face: New Left page photo in forward, Old Left page photo in backward */}
                  <div className="page-face page-face-back">
                    <div className="album-photo-frame">
                      <img 
                        src={clientReviews[flipDirection === 'forward' ? targetIdx : testimonialIdx].img} 
                        alt="Flipping back portrait" 
                      />
                      <div className="album-photo-tape-top-left" />
                      <div className="album-photo-tape-bottom-right" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom slider navigation beneath book */}
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', justifyContent: 'center', marginTop: '2.5rem' }}>
              <button 
                onClick={handleTestimonialPrev}
                className="diorama-nav-btn interactive"
                style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', width: '48px', height: '48px' }}
                title="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '120px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.1em' }}>
                  0{testimonialIdx + 1} / 0{clientReviews.length}
                </span>
                <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(28, 27, 26, 0.08)', position: 'relative', borderRadius: '1px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      height: '100%', 
                      backgroundColor: 'var(--accent-gold)', 
                      width: `${((testimonialIdx + 1) / clientReviews.length) * 100}%`,
                      transition: 'width 0.6s var(--ease-custom)'
                    }} 
                  />
                </div>
              </div>

              <button 
                onClick={handleTestimonialNext}
                className="diorama-nav-btn interactive"
                style={{ position: 'relative', top: 'auto', right: 'auto', transform: 'none', width: '48px', height: '48px' }}
                title="Siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. High impact Call to Action */}
      <section style={{ padding: '10rem 0', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <div style={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 150, 104, 0.05) 0%, rgba(0,0,0,0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.1', marginBottom: '2.5rem' }}>
            ¿Listo para capturar tu <br />
            <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>próxima historia</span>?
          </h2>
          <button 
            onClick={() => setTab('contact')} 
            className="btn-premium btn-gold interactive"
            style={{ padding: '1.2rem 2.5rem', fontSize: '0.9rem' }}
          >
            Reservar Sesión Ahora
          </button>
        </div>
      </section>

    </div>
  );
}
