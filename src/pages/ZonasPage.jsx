import React, { useState, useEffect } from 'react';
import { useWixLandings } from '../hooks/useWixCMS';
import { useSEO } from '../hooks/useSEO';
import { MapPin, Search, ArrowRight, Camera, MessageCircle, Sparkles } from 'lucide-react';

export default function ZonasPage({ setTab }) {
  const { landings, loading, error } = useWixLandings();
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic SEO for Zonas Hub
  useSEO({
    title: 'Zonas y Cobertura Fotográfica | Buena Toma Estudio',
    description: 'Directorio completo de zonas y coberturas de fotografía profesional de Buena Toma. Sesiones para parejas, marcas, cumpleaños y eventos en tu ciudad.',
    canonical: typeof window !== 'undefined' ? `${window.location.origin}/zonas` : 'https://buenatoma.mx/zonas',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filtered landings based on user search
  const filteredLandings = landings.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const city = (item.ciudadYEstado || '').toLowerCase();
    const title = (item.tituloPagina || item.titulo || '').toLowerCase();
    const excerpt = (item.excerptPagina || '').toLowerCase();
    const phrase = (item.fraseAUtilizar || '').toLowerCase();
    return city.includes(query) || title.includes(query) || excerpt.includes(query) || phrase.includes(query);
  });

  return (
    <div className="zonas-hub-page" style={{ paddingTop: '110px', paddingBottom: '6rem', minHeight: '90vh' }}>
      
      {/* 1. Header Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 1.5rem 4rem', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--accent-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1.2rem'
          }}>
            <Sparkles size={16} /> DIRECTORIO DE COBERTURA
          </span>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            lineHeight: '1.15',
            fontWeight: '700',
            marginBottom: '1.2rem',
            letterSpacing: '-0.02em'
          }}>
            Nuestras Zonas de <br />
            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: '300', color: 'var(--accent-gold)' }}>
              Cobertura y Sesiones.
            </span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: '1.6',
            maxWidth: '620px',
            margin: '0 auto 2.5rem',
            fontWeight: '300'
          }}>
            Explora las páginas dinámicas y sesiones fotográficas disponibles por municipio y ciudad. Encuentra la experiencia ideal para tu marca o proyecto.
          </p>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--accent-gold)',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="text"
              placeholder="Buscar por ciudad, municipio o tipo de sesión..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                borderRadius: '50px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-gold)';
                e.target.style.boxShadow = '0 6px 25px rgba(197, 168, 128, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. Content Grid */}
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Loading Skeletons */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.8rem',
          }}>
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="glass" 
                style={{
                  height: '240px',
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              >
                <div style={{ width: '40%', height: '14px', backgroundColor: 'rgba(197, 168, 128, 0.15)', borderRadius: '4px' }} />
                <div style={{ width: '75%', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
                <div style={{ width: '100%', height: '60px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        )}

        {/* Loaded Cards Grid */}
        {!loading && !error && filteredLandings.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '1.8rem',
          }}>
            {filteredLandings.map((item) => (
              <article 
                key={item._id || item.slug}
                className="glass interactive zona-card-item"
                style={{
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '2px solid var(--accent-gold)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s'
                }}
              >
                <div>
                  {/* Top Eyebrow badge with Pin */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-gold)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '0.9rem'
                  }}>
                    <MapPin size={14} />
                    <span>{item.ciudadYEstado || item.estado || 'México'}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    marginBottom: '0.8rem',
                    color: 'var(--text-primary)'
                  }}>
                    {item.tituloPagina || item.titulo}
                  </h3>

                  {/* Excerpt */}
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.55',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.excerptPagina}
                  </p>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button
                    onClick={() => {
                      if (setTab) setTab(`landing:${item.slug}`);
                    }}
                    className="btn-premium btn-gold interactive"
                    style={{
                      padding: '0.55rem 1.2rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Ver Landing <ArrowRight size={13} />
                  </button>

                  {item.whatsapp && (
                    <a
                      href={item.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive"
                      title="Consultar por WhatsApp"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(37, 211, 102, 0.12)',
                        color: 'var(--accent-green, #25D366)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        transition: 'background-color 0.2s, transform 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-green, #25D366)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.08)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.12)';
                        e.currentTarget.style.color = 'var(--accent-green, #25D366)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <MessageCircle size={17} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !error && filteredLandings.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '5rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '20px',
            border: '1px dashed var(--border-color)'
          }}>
            <Camera size={42} style={{ color: 'var(--accent-gold)', opacity: 0.7, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              No se encontraron zonas con "{searchTerm}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Intenta con otra ciudad, municipio o servicio fotográfico.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-premium btn-gold interactive"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.8rem' }}
            >
              Ver todas las zonas
            </button>
          </div>
        )}

      </div>

      <style>{`
        .zona-card-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 35px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  );
}
