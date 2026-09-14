import React, { useEffect } from 'react';
import { useWixLandingBySlug } from '../hooks/useWixCMS';
import { useSEO } from '../hooks/useSEO';
import Home from './Home';
import { Camera, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DynamicLanding({ slug, setTab, onLandingLoaded }) {
  const { landing, loading, error } = useWixLandingBySlug(slug);

  // Dynamic SEO injection
  useSEO({
    title: landing?.tituloSeo || (landing?.tituloPagina ? `${landing.tituloPagina} | Buena Toma` : 'Buena Toma Estudio'),
    description: landing?.metadescripcionSeo || landing?.excerptPagina || '',
    canonical: typeof window !== 'undefined' ? window.location.href : '',
  });

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Inform parent shell about the active landing data (e.g. for tailored WhatsApp links)
  useEffect(() => {
    if (landing && onLandingLoaded) {
      onLandingLoaded(landing);
    }
  }, [landing, onLandingLoaded]);

  // Loading State
  if (loading) {
    return (
      <div 
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.2rem',
          background: 'var(--bg-color)',
          color: 'var(--text-primary)',
          padding: '2rem'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.6s ease-in-out infinite'
        }}>
          <Camera size={30} style={{ color: 'var(--accent-gold)' }} />
        </div>
        <p style={{
          fontSize: '0.9rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          Cargando experiencia...
        </p>
      </div>
    );
  }

  // 404 / Error State
  if (error || !landing) {
    return (
      <div 
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          background: 'var(--bg-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(197, 168, 128, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <AlertCircle size={36} style={{ color: 'var(--accent-gold)' }} />
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '700',
          marginBottom: '0.8rem',
          letterSpacing: '-0.02em'
        }}>
          Página no encontrada
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          maxWidth: '480px',
          lineHeight: '1.6',
          marginBottom: '2rem',
          fontWeight: '300'
        }}>
          La landing page solicitada no existe o ha sido movida. Explora nuestros servicios disponibles desde la página principal.
        </p>
        <button
          onClick={() => {
            if (setTab) setTab('home');
          }}
          className="btn-premium btn-gold interactive"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.8rem 1.8rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>
      </div>
    );
  }

  // Render Home with dynamic CMS overrides
  return (
    <Home
      setTab={setTab}
      overrideTitle={landing.tituloPagina}
      overrideSubtitle={landing.excerptPagina}
      overrideBadge={landing.fraseAUtilizar}
      overrideWhatsapp={landing.whatsapp}
      overrideLocation={landing.ciudadYEstado}
      landingData={landing}
    />
  );
}
