import React, { useState } from 'react';
import { X, ZoomIn, Heart } from 'lucide-react';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [zoomImage, setZoomImage] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState([]);

  const filters = [
    { name: 'Todos', value: 'all' },
    { name: 'Cumpleaños', value: 'cumple' },
    { name: 'XV Años', value: 'xv' },
    { name: 'Maternidad', value: 'maternidad' },
    { name: 'Casual', value: 'casual' },
    { name: 'Parejas', value: 'parejas' }
  ];

  const photos = [
    {
      id: 1,
      category: 'cumple',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      title: 'Globos en Estudio - Jania 25',
      client: 'Jania Méndez'
    },
    {
      id: 2,
      category: 'xv',
      url: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80',
      title: 'Sesión Jardín - Sofia',
      client: 'Sofia Oramas'
    },
    {
      id: 3,
      category: 'maternidad',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      title: 'Maternidad Luz Suave',
      client: 'Andrea Cabrera'
    },
    {
      id: 4,
      category: 'casual',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      title: 'Casual Urbano - Retrato',
      client: 'Eduardo Gil'
    },
    {
      id: 5,
      category: 'parejas',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      title: 'Pareja en Atardecer',
      client: 'Luisa & Ricardo'
    },
    {
      id: 6,
      category: 'cumple',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      title: 'Detalles Cumpleaños - Neon Shoot',
      client: 'Marcos Rovirosa'
    },
    {
      id: 7,
      category: 'xv',
      url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80',
      title: 'Retrato de Gala XV',
      client: 'Ivanna Castellanos'
    },
    {
      id: 8,
      category: 'maternidad',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      title: 'Silueta Maternidad',
      client: 'Guadalupe Gil'
    },
    {
      id: 9,
      category: 'casual',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      title: 'Estilo Profesional Headshot',
      client: 'Alejandro Ocampo'
    }
  ];

  const filteredPhotos = activeFilter === 'all' 
    ? photos 
    : photos.filter(p => p.category === activeFilter);

  const handleLike = (e, id) => {
    e.stopPropagation();
    if (likedPhotos.includes(id)) {
      setLikedPhotos(prev => prev.filter(pId => pId !== id));
    } else {
      setLikedPhotos(prev => [...prev, id]);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="fade-in">
      
      {/* Page Title */}
      <section style={{ padding: '3rem 0 1rem 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Nuestra Galería
          </span>
          <h2 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>Portafolio de <span style={{ color: 'var(--accent-gold)' }}>Tomas</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Explora una selección de nuestras sesiones preferidas. Creando contrastes, iluminaciones espontáneas y decoraciones que asombran.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        margin: '2rem auto 3rem auto'
      }}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className="interactive"
            style={{
              padding: '0.6rem 1.4rem',
              backgroundColor: activeFilter === filter.value ? 'var(--accent-gold)' : 'rgba(255,255,255,0.02)',
              border: activeFilter === filter.value ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
              color: activeFilter === filter.value ? 'var(--bg-color)' : 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: activeFilter === filter.value ? '600' : '400',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
              borderRadius: '20px'
            }}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="container" style={{
        columns: '3 280px',
        columnGap: '1.5rem',
        paddingBottom: '5rem'
      }}>
        {filteredPhotos.map((photo) => {
          const isLiked = likedPhotos.includes(photo.id);
          return (
            <div 
              key={photo.id}
              onClick={() => setZoomImage(photo)}
              className="interactive glass interactive-card"
              style={{
                breakInside: 'avoid',
                marginBottom: '1.5rem',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                display: 'block'
              }}
            >
              {/* Photo Image */}
              <img 
                src={photo.url} 
                alt={photo.title}
                style={{
                  width: '100%',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />

              {/* Cover Overlay Info on hover */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem'
                }}
                className="gallery-hover"
              >
                {/* Top Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    onClick={(e) => handleLike(e, photo.id)}
                    className="interactive"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      border: 'none',
                      color: isLiked ? 'var(--accent-gold)' : '#ffffff',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <ZoomIn size={16} />
                  </div>
                </div>

                {/* Bottom Details */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', color: '#ffffff' }}>{photo.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Cliente: {photo.client}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded CSS rules for hover effects */}
      <style>{`
        .interactive-card:hover .gallery-hover {
          opacity: 1 !important;
        }
      `}</style>

      {/* Lightbox zoom modal */}
      {zoomImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }} onClick={() => setZoomImage(null)}>
          <button 
            onClick={() => setZoomImage(null)}
            className="interactive"
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: '#ffffff'
            }}
          >
            <X size={32} />
          </button>
          
          <img 
            src={zoomImage.url} 
            alt={zoomImage.title}
            style={{
              maxWidth: '90%',
              maxHeight: '85vh',
              objectFit: 'contain',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <div style={{
            position: 'absolute',
            bottom: '30px',
            color: '#ffffff',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{zoomImage.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cliente: {zoomImage.client}</p>
          </div>
        </div>
      )}

    </div>
  );
}
