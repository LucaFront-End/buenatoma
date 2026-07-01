import React, { useState } from 'react';
import { X, Lock, Download, CheckCircle, RefreshCw, Star } from 'lucide-react';

export default function UserPortal({ isOpen, onClose }) {
  const [bookingId, setBookingId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [error, setError] = useState('');

  // Mock booking data
  const mockBooking = {
    id: "BT-2026",
    clientName: "Sofia Oramas",
    serviceName: "Sesión de XV Años (Plus)",
    date: "18 de Junio, 2026",
    status: "Selección de Fotos",
    progress: 75,
    deliveryCountdown: "5 días restantes",
    totalImages: 24,
    limitSelection: 15,
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80", title: "Retrato Principal" },
      { id: 2, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80", title: "Enfoque Vestido" },
      { id: 3, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80", title: "Sonrisa Casual" },
      { id: 4, url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", title: "Ángulo Contraluz" },
      { id: 5, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", title: "Detalle Corona" },
      { id: 6, url: "https://images.unsplash.com/photo-1520854221256-174b1ec358ef?auto=format&fit=crop&w=600&q=80", title: "Retrato Familiar" },
      { id: 7, url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=600&q=80", title: "Salón Principal" },
      { id: 8, url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80", title: "Brindis XV" }
    ]
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (bookingId.trim().toUpperCase() === "BT-2026") {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Código de sesión inválido. Prueba con: BT-2026');
    }
  };

  const toggleSelectPhoto = (id) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(prev => prev.filter(pId => pId !== id));
    } else {
      if (selectedPhotos.length >= mockBooking.limitSelection) {
        alert(`Has alcanzado el límite de selección de tu paquete (${mockBooking.limitSelection} fotos).`);
        return;
      }
      setSelectedPhotos(prev => [...prev, id]);
    }
  };

  const handleSaveSelection = () => {
    alert(`¡Selección guardada con éxito! Se han enviado ${selectedPhotos.length} fotos al editor.`);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} onClick={onClose}>
      
      <div style={{
        width: '100%',
        maxWidth: isLoggedIn ? '1000px' : '450px',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.3s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: 'var(--accent-gold)' }} />
              Portal de <span style={{ color: 'var(--accent-gold)' }}>Clientes</span>
            </h3>
            {isLoggedIn && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Código activo: {mockBooking.id}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="interactive"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Box */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {!isLoggedIn ? (
            /* Login Form */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5' }}>
                Introduce el código de reserva de 6 dígitos que te enviamos por correo o WhatsApp para acceder a tus pruebas de fotografía.
              </p>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                  Código de Reserva (Booking ID)
                </label>
                <input 
                  type="text" 
                  placeholder="Ej. BT-2026"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  style={{
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}
                />
                {error && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    {error}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-premium btn-gold interactive"
                style={{ justifyContent: 'center', padding: '1rem', fontSize: '0.85rem' }}
              >
                Ingresar al Portal
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ¿Problemas para acceder? <a href="https://wa.me/525662914092" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)' }} className="interactive">Soporte en WhatsApp</a>
              </div>
            </form>
          ) : (
            /* Logged In Dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Profile summary row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cliente</span>
                  <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{mockBooking.clientName}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Servicio contratado</span>
                  <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem', color: 'var(--accent-gold)' }}>{mockBooking.serviceName}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Fecha del evento</span>
                  <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{mockBooking.date}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Estatus de entrega</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.2rem' }}>
                    <RefreshCw size={14} style={{ color: 'var(--accent-gold)', animation: 'spin 4s linear infinite' }} />
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{mockBooking.status}</h4>
                  </div>
                </div>
              </div>

              {/* Progress and countdown info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Progreso de edición</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{mockBooking.progress}% completed ({mockBooking.deliveryCountdown})</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(28, 27, 26, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${mockBooking.progress}%`, height: '100%', backgroundColor: 'var(--accent-gold)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Instructions grid */}
              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Selecciona tus {mockBooking.limitSelection} fotos favoritas</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Haz clic sobre las estrellas en las fotos que más te gusten. El retoque final se aplicará únicamente a las fotos seleccionadas. Llevas <strong>{selectedPhotos.length} de {mockBooking.limitSelection}</strong> elegidas.
                </p>
              </div>

              {/* Masonry Mock Gallery */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.2rem',
                marginTop: '1rem'
              }}>
                {mockBooking.photos.map(photo => {
                  const isSelected = selectedPhotos.includes(photo.id);
                  return (
                    <div 
                      key={photo.id}
                      onClick={() => toggleSelectPhoto(photo.id)}
                      className="interactive"
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      {/* Photo Image */}
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: isSelected ? 0.9 : 0.6,
                          filter: 'grayscale(30%)',
                          transition: 'opacity 0.2s, filter 0.2s'
                        }}
                      />

                      {/* Watermark */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        color: 'rgba(255, 255, 255, 0.12)',
                        fontSize: '1rem',
                        fontWeight: '700',
                        pointerEvents: 'none',
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap'
                      }}>
                        BUENA TOMA MOCKUP
                      </div>

                      {/* Selectable icon overlays */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--accent-gold)' : 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'var(--bg-color)' : '#ffffff',
                        transition: 'background-color 0.2s'
                      }}>
                        <Star size={14} fill={isSelected ? "currentColor" : "none"} />
                      </div>
                      
                      {/* Title display */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '10px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        fontSize: '0.75rem',
                        color: 'var(--text-primary)'
                      }}>
                        {photo.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.5rem',
                marginTop: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fotos Seleccionadas:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-gold)', marginLeft: '10px' }}>
                    {selectedPhotos.length} / {mockBooking.limitSelection}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleSaveSelection}
                    className="btn-premium btn-gold interactive"
                    disabled={selectedPhotos.length === 0}
                    style={{
                      padding: '0.8rem 1.5rem',
                      fontSize: '0.75rem',
                      opacity: selectedPhotos.length === 0 ? 0.5 : 1
                    }}
                  >
                    Guardar Selección
                  </button>
                  <button
                    onClick={() => {
                      alert("Tus archivos finales de alta resolución se están procesando. Podrás descargarlos cuando el estatus cambie a 'Completado'.");
                    }}
                    className="btn-premium interactive"
                    style={{
                      padding: '0.8rem 1.5rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={14} /> Descargar Finales
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
