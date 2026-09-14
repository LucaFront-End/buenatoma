import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { sendLeadToWix } from '../lib/wixLeads';

export default function Community() {
  const [memberEmail, setMemberEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const posts = [
    {
      id: 1,
      user: "@sofia.oramas",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      content: "¡Súper enamorada del resultado de mis fotos de XV años en el jardín botánico! El set de globos de @buenatoma estuvo increíble. Gracias por capturar cada sonrisa ✨💖",
      likes: 142,
      comments: 18,
      img: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      user: "@andrea_cabrera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      content: "Nuestra sesión de maternidad fue una experiencia hermosa. Muy pacientes y atentos a cada detalle. ¡Súper recomendados! 🍼🤰",
      likes: 98,
      comments: 5,
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      user: "@jania_m",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
      content: "¡Mis fotos de cumple de 25 quedaron irreales! El pastel decorativo del estudio y el maquillaje profesional de $800 fueron la clave. ¡Son los mejores! 🎂🎈",
      likes: 215,
      comments: 24,
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const forumTopics = [
    { title: "Tips de vestuario para sesiones casuales en exterior", replies: 32, category: "Guías" },
    { title: "¿Cómo preparar a tus niños para un shoot infantil sin que se estresen?", replies: 19, category: "Consejos" },
    { title: "Nuestros spots preferidos para fotos en Ciudad de México", replies: 45, category: "Locaciones" },
    { title: "Tendencias de maquillaje para XV Años en este 2026", replies: 28, category: "Tendencias" }
  ];

  const handleJoin = async (e) => {
    e.preventDefault();
    if (memberEmail.trim()) {
      const emailToSend = memberEmail.trim();
      setJoined(true);
      setMemberEmail('');
      try {
        await sendLeadToWix({
          email: emailToSend,
          origen: 'Club Comunidad Exclusiva (Cupón 10% VIP)',
          title: `Comunidad VIP: ${emailToSend} — [Comunidad]`
        });
      } catch (err) {
        console.error('Error enviando registro de comunidad a CMS:', err);
      }
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="fade-in">
      
      {/* Title */}
      <section style={{ padding: '3rem 0 1rem 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Comunidad Buena Toma
          </span>
          <h2 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>Conecta y <span style={{ color: 'var(--accent-gold)' }}>Comparte</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Únete a nuestra red de clientes. Mira sus experiencias, comparte tus fotos finales y accede a guías de estilo exclusivas de nuestro estudio.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <div className="container community-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '4rem',
        paddingTop: '2rem',
        paddingBottom: '5rem'
      }}>
        
        {/* LEFT COLUMN: Social Wall Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} style={{ color: 'var(--accent-gold)' }} />
            Momentos de la Comunidad
          </h3>

          {posts.map((post) => (
            <div 
              key={post.id} 
              className="glass"
              style={{
                borderRadius: '8px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem'
              }}
            >
              {/* User row */}
              <div style={{ display: 'flex', justifySelf: 'flex-start', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={post.avatar} 
                  alt={post.user}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{post.user}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cliente Buena Toma</span>
                </div>
              </div>

              {/* Text content */}
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {post.content}
              </p>

              {/* Post photo card */}
              <div style={{
                aspectRatio: '1.6',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
              }}>
                <img 
                  src={post.img} 
                  alt="Post attachment" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Actions row */}
              <div style={{
                display: 'flex',
                gap: '20px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="interactive">
                  <Heart size={16} style={{ color: 'var(--accent-gold)' }} fill="var(--accent-gold)" />
                  <span>{post.likes} Likes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="interactive">
                  <MessageCircle size={16} />
                  <span>{post.comments} Comentarios</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Discussion Topics & Signup Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Discussion board */}
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={20} style={{ color: 'var(--accent-gold)' }} />
              Foro de Clientes
            </h3>
            
            <div className="glass" style={{
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}>
              {forumTopics.map((topic, i) => (
                <div 
                  key={i} 
                  className="interactive"
                  style={{
                    paddingBottom: '1rem',
                    borderBottom: i < forumTopics.length - 1 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(197, 168, 128, 0.1)',
                    color: 'var(--accent-gold)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    alignSelf: 'flex-start',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {topic.category}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '500', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    {topic.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {topic.replies} respuestas activas
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Join Club Signup Card */}
          <div className="glass" style={{
            padding: '2.5rem',
            borderRadius: '8px',
            borderTop: '2px solid var(--accent-gold)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
              <Sparkles size={20} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Club Exclusivo</span>
            </div>
            
            <h3 style={{ fontSize: '1.6rem', margin: 0 }}>Sé Parte de Buena Toma</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Únete a la comunidad de clientes VIP y recibe de regalo un <strong>10% de descuento</strong> en tu siguiente sesión, guías de outfits para exteriores y acceso a preventas de sets temáticos navideños.
            </p>

            {!joined ? (
              <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  style={{ fontSize: '0.85rem', padding: '0.8rem' }}
                />
                <button 
                  type="submit" 
                  className="btn-premium btn-gold interactive"
                  style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.8rem' }}
                >
                  Unirse y Obtener Cupón
                </button>
              </form>
            ) : (
              <div style={{
                padding: '1.2rem',
                backgroundColor: 'rgba(37,211,102,0.05)',
                border: '1px solid var(--accent-green)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: '700', color: 'var(--accent-green)', marginBottom: '4px' }}>¡Bienvenido al Club! 🎉</p>
                Tu código de 10% es: <strong>TOMACOMM10</strong>. Lo hemos enviado a tu bandeja.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Responsive details */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.6fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          div[style*="position: sticky"] {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>

    </div>
  );
}
