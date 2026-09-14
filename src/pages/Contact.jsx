import React, { useState, useEffect } from 'react';
import { Send, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { sendLeadToWix } from '../lib/wixLeads';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('cumple');
  const [hours, setHours] = useState(1);
  const [photos, setPhotos] = useState(15);
  const [makeup, setMakeup] = useState(false);
  const [frame, setFrame] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Recompute estimated price dynamically
  useEffect(() => {
    let price = 0;
    
    // Core base hours ($1,200 MXN per hour)
    price += hours * 1200;
    
    // Core base photos ($80 MXN per edited photo)
    price += photos * 80;
    
    // Add-on complements
    if (makeup) price += 800;
    if (frame) price += 1599; // Medium size frame price
    
    setEstimatedPrice(price);
  }, [hours, photos, makeup, frame]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    setIsSubmitting(true);

    const phoneNumber = "5662914092";
    const categoryLabels = {
      cumple: "Cumpleaños",
      xv: "XV Años",
      maternidad: "Maternidad",
      casual: "Casual / Retrato",
      parejas: "Pareja",
      comercial: "Comercial / Producto"
    };

    let text = `Hola me interesa información de su servicio de Fotografía. He calculado una cotización en su web:\n\n`;
    text += `*Nombre:* ${name}\n`;
    text += `*Correo:* ${email}\n`;
    if (phone) text += `*Teléfono:* ${phone}\n`;
    if (date) text += `*Fecha sugerida:* ${date}\n`;
    text += `*Categoría:* Sesión de ${categoryLabels[category]}\n`;
    text += `*Especificaciones:* ${hours} hora(s) de sesión con ${photos} fotos retocadas.\n`;
    
    const complements = [];
    if (makeup) complements.push("Peinado y Maquillaje ($800)");
    if (frame) complements.push("Cuadro Físico Mediano ($1,599)");
    
    if (complements.length > 0) {
      text += `*Extras agregados:* ${complements.join(', ')}\n`;
    }
    
    text += `\n*Total Estimado:* $${estimatedPrice.toLocaleString('es-MX')} MXN\n\n`;
    text += `¿Tienen disponibilidad para esta fecha?`;

    // Send lead to Wix CMS Contacto collection with clear origin and await
    try {
      await sendLeadToWix({
        title: `${name} — [Formulario de Contacto]`,
        nombre: name,
        email: email,
        telefono: phone,
        mensaje: `Categoría: ${categoryLabels[category]} | Fecha sugerida: ${date || 'No especificada'} | Horas: ${hours} | Fotos: ${photos} | Extras: ${complements.join(', ') || 'Ninguno'} | Total Estimado: $${estimatedPrice.toLocaleString('es-MX')} MXN`,
        origen: 'Formulario de Contacto (Cotizador)'
      });
    } catch (err) {
      console.error('Error enviando contacto a Wix CMS:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/52${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="fade-in">
      
      {/* Title */}
      <section style={{ padding: '3rem 0 1rem 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Hablemos hoy
          </span>
          <h2 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>Cotiza y <span style={{ color: 'var(--accent-gold)' }}>Reserva</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Calcula el presupuesto estimado de tu shoot ideal y envíanos la solicitud de reserva directa a nuestro WhatsApp de forma inmediata.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <div className="container contact-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '4rem',
        paddingTop: '2.5rem',
        paddingBottom: '6rem'
      }}>
        
        {/* LEFT COLUMN: Configurator & Booking Form */}
        <div className="glass" style={{ padding: '3rem 2.5rem', borderRadius: '8px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Section: Basic info */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>1. Datos Personales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Nombre Completo *</label>
                  <input type="text" placeholder="Ej. Sofia Oramas" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Correo Electrónico *</label>
                  <input type="email" placeholder="Ej. sofia@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Teléfono / WhatsApp</label>
                  <input type="tel" placeholder="Ej. 55 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section: Project selection */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>2. Detalles del Shoot</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Categoría de Sesión</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="cumple">Cumpleaños</option>
                    <option value="xv">XV Años</option>
                    <option value="maternidad">Maternidad</option>
                    <option value="casual">Casual / Retrato</option>
                    <option value="parejas">Parejas</option>
                    <option value="comercial">Comercial / Producto</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Fecha Deseada</label>
                  <input 
                    type="date" 
                    value={date} 
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)} 
                    onClick={(e) => {
                      try {
                        if (typeof e.target.showPicker === 'function') {
                          e.target.showPicker();
                        }
                      } catch (err) {}
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section: Sliders quote */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>3. Diseña a Medida</h3>
              
              {/* Slider 1: Hours */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <span>Duración de la Sesión</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>{hours} hora(s)</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>1 Hora</span>
                  <span>5 Horas (Completa)</span>
                </div>
              </div>

              {/* Slider 2: Photos */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <span>Fotografías Retocadas Incluidas</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>{photos} imágenes digitales</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  step="5"
                  value={photos}
                  onChange={(e) => setPhotos(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>10 imágenes</span>
                  <span>50 imágenes</span>
                </div>
              </div>
            </div>

            {/* Section: Toggles */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>4. Agregar Servicios Extras</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="interactive">
                  <input 
                    type="checkbox" 
                    checked={makeup} 
                    onChange={(e) => setMakeup(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Agregar Peinado y Maquillaje Profesional (+ $800 MXN)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="interactive">
                  <input 
                    type="checkbox" 
                    checked={frame} 
                    onChange={(e) => setFrame(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Agregar 1 Cuadro Físico Mediano de Madera 50x65 cm (+ $1,599 MXN)</span>
                </label>

              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-premium btn-gold interactive"
              style={{ justifyContent: 'center', padding: '1rem', fontSize: '0.9rem', marginTop: '1rem' }}
            >
              {isSubmitting ? (
                <span>Enviando al estudio...</span>
              ) : isSuccess ? (
                <span>✅ ¡Solicitud Enviada a WhatsApp!</span>
              ) : (
                <>
                  <Send size={16} /> Enviar Presupuesto por WhatsApp
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: Contact Details & Visual Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Quick Quote Summary Card */}
          <div className="glass" style={{
            padding: '2.5rem',
            borderRadius: '8px',
            borderTop: '2px solid var(--accent-gold)'
          }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.2rem' }}>
              Tu Presupuesto Estimado
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Sesión ({hours}h):</span>
                <span>${(hours * 1200).toLocaleString('es-MX')} MXN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Fotos digitales ({photos}):</span>
                <span>${(photos * 80).toLocaleString('es-MX')} MXN</span>
              </div>
              {makeup && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>+ Peinado y Maquillaje:</span>
                  <span>+$800 MXN</span>
                </div>
              )}
              {frame && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>+ Cuadro Mediano:</span>
                  <span>+$1,599 MXN</span>
                </div>
              )}
              
              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.2rem',
                marginTop: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Total Estimado:</span>
                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                  ${estimatedPrice.toLocaleString('es-MX')} MXN
                </span>
              </div>
            </div>
          </div>

          {/* Studio Contact details card */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Información de Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Ubicación del Estudio</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Paseo de la Reforma 284, Ciudad de México, Ciudad de México, 06600, MEX
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Llámanos o escríbenos</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    566 291 4092
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Email directo</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    hola@buenatoma.mx
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '20px', display: 'flex', justifyContent: 'center', color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1' }}>
                  @
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Redes Sociales</h5>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a 
                      href="http://instagram.com/buenatoma.mx" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textDecoration: 'none' }}
                      className="interactive"
                    >
                      Instagram
                    </a>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <a 
                      href="https://www.facebook.com/buenatoma.mx" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textDecoration: 'none' }}
                      className="interactive"
                    >
                      Facebook
                    </a>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      (@buenatoma.mx)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.4fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>

    </div>
  );
}
