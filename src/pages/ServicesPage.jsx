import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Sliders, 
  MapPin, 
  MessageCircle,
  Award,
  Layers
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { sendLeadToWix } from '../lib/wixLeads';

const SERVICES_DATA = [
  {
    id: 'cumple',
    name: 'Sesión de Cumpleaños 🎂',
    tagline: 'Celebración y Espontaneidad',
    badge: 'Más Popular',
    description: 'Capturamos la alegría, las risas y la emoción de festejar una vuelta más al sol. Diseñado para todas las edades con sets dinámicos, globos y opción de smash cake.',
    price: 2799,
    duration: '60 - 90 min',
    photos: '20 fotos HD editadas',
    sets: '2 sets temáticos a elegir',
    features: [
      'Sets con globos, confetti y números gigantes',
      'Opción de tarta o Smash Cake',
      'Galería digital privada descargable en alta resolución',
      'Asesoría de estilismo y cambios de ropa ilimitados'
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80',
    category: 'Celebraciones'
  },
  {
    id: 'xv',
    name: 'XV Años de Gala 👑',
    tagline: 'Magia y Sofisticación Editorial',
    badge: 'Experiencia Premium',
    description: 'Una experiencia fotográfica digna de pasarela. Espacio amplio para tu vestido de gala, esquemas de iluminación teatral y dirección de poses profesional.',
    price: 4000,
    duration: '90 - 120 min',
    photos: '35 fotos HD editadas',
    sets: '3 sets cinematográficos',
    features: [
      'Espacio climatizado para vestidos de gran volumen',
      'Esquemas de luz de alta costura / editorial',
      'Fotografía con familiares o chambelanes',
      'Retoque facial de alta gama piel perfecta'
    ],
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=700&q=80',
    category: 'Celebraciones'
  },
  {
    id: 'maternidad',
    name: 'Maternidad y Dulce Espera 🍼',
    tagline: 'Luz, Vida y Ternura',
    badge: 'Sesión Íntima',
    description: 'Celebra la belleza de dar vida. Diseñamos un ambiente cálido, íntimo y elegante con telas vaporosas y siluetas sutiles que inmortalizan tu embarazo.',
    price: 3000,
    duration: '60 - 80 min',
    photos: '25 fotos HD editadas',
    sets: 'Set lunar & Telas etéreas',
    features: [
      'Telas de seda, batas y tules disponibles en estudio',
      'Iluminación suave que resalta la silueta maternal',
      'Participación de pareja e hijos mayores sin costo adicional',
      'Guía postural con máxima comodidad y pausas de descanso'
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    category: 'Momentos Especiales'
  },
  {
    id: 'casual',
    name: 'Sesión Casual & Editorial ⚡',
    tagline: 'Tu Estilo, Tu Esencia Pura',
    badge: 'Retrato Moderno',
    description: 'Sin poses forzadas. Una sesión relajada de estilo editorial para renovar tu imagen personal, redes sociales, portafolio profesional o simplemente quererte.',
    price: 2899,
    duration: '60 min',
    photos: '20 fotos HD editadas',
    sets: '2 fondos minimalistas',
    features: [
      'Estilo contemporáneo: fondo blanco, negro o texturizado',
      'Dirección dinámica de poses naturales',
      'Ideal para LinkedIn, Instagram y marcas personales',
      'Entrega rápida digital en 3 a 5 días hábiles'
    ],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80',
    category: 'Retratos'
  },
  {
    id: 'graduacion',
    name: 'Graduación Universitaria 🎓',
    tagline: 'El Orgullo de una Meta Cumplida',
    badge: 'Logro Académico',
    description: 'Conmemora tus años de esfuerzo y desvelo. Retratos individuales solemnes y modernos con toga y birrete, además de emotivas tomas con tu familia.',
    price: 3799,
    duration: '60 - 90 min',
    photos: '30 fotos HD editadas',
    sets: 'Set clásico y contemporáneo',
    features: [
      'Toga, birrete y estola disponibles en estudio',
      'Tomas individuales de perfil profesional + familiares',
      'Retoque fino para enmarcar en cuadros de honor',
      'Fotos listas para solicitudes de titulación y recuerdo'
    ],
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=700&q=80',
    category: 'Momentos Especiales'
  },
  {
    id: 'parejas',
    name: 'Sesión de Parejas & Aniversario 💖',
    tagline: 'Conexión, Complicidad y Amor',
    badge: 'Romance & Amor',
    description: 'Un homenaje visual a su complicidad. Creamos una atmósfera de confianza y música ambiental para capturar miradas genuinas, caricias y risas compartidas.',
    price: 2999,
    duration: '60 - 90 min',
    photos: '25 fotos HD editadas',
    sets: '2 ambientes cálidos',
    features: [
      'Atmósfera relajada con música elegida por la pareja',
      'Luz cálida dorada o estilo analógico vintage',
      'Ideal para compromisos, aniversarios o San Valentín',
      'Edición estética con paleta cinematográfica'
    ],
    image: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=700&q=80',
    category: 'Momentos Especiales'
  }
];

export default function ServicesPage({ setTab }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useSEO({
    title: 'Servicios de Fotografía Profesional en CDMX | Buena Toma',
    description: 'Conoce nuestros servicios de fotografía en estudio en Paseo de la Reforma, Ciudad de México. Cumpleaños, XV Años, Maternidad, Retrato Casual, Graduaciones y Parejas.',
    canonical: typeof window !== 'undefined' ? `${window.location.origin}/servicios` : 'https://buenatoma.mx/servicios',
  });

  const categories = ['Todos', 'Celebraciones', 'Momentos Especiales', 'Retratos'];

  const filteredServices = selectedCategory === 'Todos'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === selectedCategory);

  const handleWhatsappInquiry = (serviceName) => {
    sendLeadToWix({
      origen: `Servicios Hub (${serviceName})`,
      mensaje: `Solicitud de información sobre el servicio ${serviceName} desde /servicios`,
      title: `Consulta Servicio: ${serviceName}`
    });
    const phoneNumber = "5662914092";
    const text = encodeURIComponent(`Hola Buena Toma, me interesa agendar o cotizar información sobre el servicio de ${serviceName} en su estudio de Paseo de la Reforma 284.`);
    window.open(`https://wa.me/52${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div style={{ paddingTop: '85px', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} className="fade-in">
      
      {/* Breadcrumbs */}
      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <button 
            onClick={() => setTab('home')} 
            className="interactive" 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
          >
            Inicio
          </button>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>Servicios</span>
        </div>
      </div>

      {/* Hero Header */}
      <section style={{ padding: '2rem 0 3.5rem 0', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '0.4rem 1rem', 
            borderRadius: '50px', 
            backgroundColor: 'rgba(197, 168, 128, 0.1)', 
            border: '1px solid var(--border-color)', 
            color: 'var(--accent-gold)', 
            fontSize: '0.78rem', 
            fontWeight: '600', 
            letterSpacing: '0.12em', 
            textTransform: 'uppercase',
            marginBottom: '1.2rem'
          }}>
            <Sparkles size={14} />
            Estudio Profesional CDMX · Paseo de la Reforma 284
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', 
            fontWeight: '800', 
            letterSpacing: '-0.02em', 
            lineHeight: '1.15', 
            marginBottom: '1.2rem',
            color: 'var(--text-primary)'
          }}>
            Nuestros Servicios de <span style={{ color: 'var(--accent-gold)' }}>Fotografía</span>
          </h1>

          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem', 
            lineHeight: '1.7', 
            maxWidth: '680px', 
            margin: '0 auto 2.5rem auto' 
          }}>
            Experiencias visuales diseñadas a la medida. Sets profesionales con ciclorama, iluminación de cine, dirección de poses y entrega garantizada en alta resolución.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="interactive"
                style={{
                  padding: '0.55rem 1.3rem',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? '600' : '400',
                  border: selectedCategory === cat ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                  backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'transparent',
                  color: selectedCategory === cat ? '#121214' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch'
          }}>
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="glass interactive"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Service Image Header */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12, 12, 14, 0.95) 0%, rgba(12, 12, 14, 0.2) 60%, transparent 100%)'
                  }} />

                  {/* Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: 'rgba(12, 12, 14, 0.85)',
                    border: '1px solid var(--accent-gold)',
                    color: 'var(--accent-gold)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    backdropFilter: 'blur(8px)'
                  }}>
                    {service.badge}
                  </span>

                  {/* Category Pill */}
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px'
                  }}>
                    {service.category}
                  </span>

                  {/* Title overlay */}
                  <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
                      {service.tagline}
                    </span>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '4px 0 0 0', color: '#ffffff' }}>
                      {service.name}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    minHeight: '66px'
                  }}>
                    {service.description}
                  </p>

                  {/* Quick Specs Pills */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div>
                      <Clock size={15} style={{ color: 'var(--accent-gold)', margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>{service.duration}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Duración</div>
                    </div>
                    <div>
                      <Camera size={15} style={{ color: 'var(--accent-gold)', margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>{service.photos}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Entregables</div>
                    </div>
                    <div>
                      <Layers size={15} style={{ color: 'var(--accent-gold)', margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>{service.sets}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sets / Fondos</div>
                    </div>
                  </div>

                  {/* Included features checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.8rem', flex: 1 }}>
                    {service.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                        <Check size={15} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div style={{
                    paddingTop: '1.2rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Inversión desde
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ${service.price.toLocaleString('es-MX')}{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>MXN</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleWhatsappInquiry(service.name)}
                        className="interactive"
                        title="Cotizar por WhatsApp"
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <MessageCircle size={18} />
                      </button>

                      <button
                        onClick={() => setTab(`service-${service.id}`)}
                        className="btn-premium btn-gold interactive"
                        style={{
                          padding: '0.65rem 1.25rem',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Personalizar <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Simulator Callout Banner */}
      <section style={{ padding: '0 0 5rem 0' }}>
        <div className="container">
          <div 
            className="glass"
            style={{
              padding: '3.5rem 3rem',
              borderRadius: '20px',
              border: '1px solid var(--accent-gold)',
              background: 'linear-gradient(135deg, rgba(197,168,128,0.08) 0%, rgba(12,12,14,0.95) 100%)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                <Sliders size={16} />
                Cotizador Interactivo en Tiempo Real
              </div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                ¿Deseas armar un paquete con extras, marcos y catering?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '520px' }}>
                Calcula al instante el costo de tu sesión incluyendo extras como maquillaje profesional, topper de acrílico personalizado, copias impresas fine art y catering de celebración.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <button
                onClick={() => setTab('cotizador')}
                className="btn-premium btn-gold interactive"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Abrir Cotizador de Paquetes <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ✨ Sin compromiso. Personaliza tus opciones y descarga tu cotización en PDF o resérvala en línea.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Studio Guarantee Badges */}
      <section style={{ padding: '0 0 5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem'
          }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(197,168,128,0.1)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={22} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  Ubicación Inmejorable
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Paseo de la Reforma 284, CDMX. Fácil acceso, estacionamiento cercano y seguridad 24/7.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(197,168,128,0.1)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Award size={22} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  Fotógrafos Certificados
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Más de 8 años de experiencia en retrato editorial y eventos familiares de alto nivel.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(197,168,128,0.1)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  Garantía de Satisfacción
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Revisión previa de fotos en vivo en monitor de estudio para asegurar que ames cada toma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
