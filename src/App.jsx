import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Cart from './components/Cart';
import FloatingWidget from './components/FloatingWidget';
import UserPortal from './components/UserPortal';
import Footer from './components/Footer';
import { WixContextProvider } from './context/WixContext';

// Pages
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Portfolio from './pages/Portfolio';
import Community from './pages/Community';
import Contact from './pages/Contact';
import ServicePage from './pages/ServicePage';
import ServicesPage from './pages/ServicesPage';
import ClientGallery from './pages/ClientGallery';
import DynamicLanding from './pages/DynamicLanding';
import ZonasPage from './pages/ZonasPage';
import RegistrationPromoPopup from './components/RegistrationPromoPopup';

// Route parser from browser pathname
function getRouteFromPath(pathname) {
  const cleanPath = (pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!cleanPath) return { tab: 'home', slug: null };

  // Static XML and text files should never be treated as dynamic landing pages
  if (cleanPath.endsWith('.xml') || cleanPath.endsWith('.txt')) {
    if (typeof window !== 'undefined') {
      window.location.replace(`/${cleanPath}`);
    }
    return { tab: 'home', slug: null };
  }

  if (cleanPath === 'pedidademano' || cleanPath === 'galeria' || cleanPath === 'gallery') {
    return { tab: 'gallery', slug: null };
  }
  if (cleanPath === 'seleccion' || cleanPath === 'galeria-seleccion' || cleanPath === 'proofing') {
    return { tab: 'gallery-selection', slug: null };
  }
  if (cleanPath === 'entrega' || cleanPath === 'ya-quedaron' || cleanPath === 'galeria-entrega') {
    return { tab: 'gallery-delivery', slug: null };
  }
  if (cleanPath === 'servicios' || cleanPath === 'services') {
    return { tab: 'services', slug: null };
  }
  if (cleanPath === 'cotizador' || cleanPath === 'cotizar' || cleanPath === 'paquetes' || cleanPath === 'packages') {
    return { tab: 'cotizador', slug: null };
  }
  if (cleanPath === 'portafolio' || cleanPath === 'portfolio') return { tab: 'portfolio', slug: null };
  if (cleanPath === 'comunidad' || cleanPath === 'community') return { tab: 'community', slug: null };
  if (cleanPath === 'contacto' || cleanPath === 'contact') return { tab: 'contact', slug: null };
  if (cleanPath === 'zonas' || cleanPath === 'zones') return { tab: 'zonas', slug: null };
  if (cleanPath.startsWith('servicio-') || cleanPath.startsWith('service-')) {
    const id = cleanPath.replace(/^(servicio|service)-/, '');
    return { tab: `service-${id}`, slug: null };
  }

  // Any other non-empty path is treated as dynamic landing slug
  return { tab: 'dynamic-landing', slug: cleanPath };
}

function getPathForTab(tab, slug) {
  if (tab === 'home') return '/';
  if (tab === 'gallery') return '/pedidademano';
  if (tab === 'gallery-selection' || tab === 'seleccion') return '/seleccion';
  if (tab === 'gallery-delivery' || tab === 'entrega') return '/entrega';
  if (tab === 'services' || tab === 'servicios') return '/servicios';
  if (tab === 'cotizador' || tab === 'packages') return '/cotizador';
  if (tab === 'portfolio') return '/portafolio';
  if (tab === 'community') return '/comunidad';
  if (tab === 'contact') return '/contacto';
  if (tab === 'zonas') return '/zonas';
  if (tab.startsWith('service-')) {
    const id = tab.replace('service-', '');
    return `/servicio-${id}`;
  }
  if (tab === 'dynamic-landing' && slug) return `/${slug}`;
  return '/';
}

export default function App() {
  const [routeState, setRouteState] = useState(() => getRouteFromPath(window.location.pathname));
  const currentTab = routeState.tab;
  const activeSlug = routeState.slug;

  const [activeLanding, setActiveLanding] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // States for Camera Shutter Page Transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteFromPath(window.location.pathname);
      setRouteState(nextRoute);
      if (nextRoute.tab !== 'dynamic-landing') {
        setActiveLanding(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = useCallback((target) => {
    let nextTab = target;
    let nextSlug = null;

    if (typeof target === 'string' && target.startsWith('landing:')) {
      nextSlug = target.replace('landing:', '');
      nextTab = 'dynamic-landing';
    } else if (target === 'home') {
      nextTab = 'home';
      nextSlug = null;
    }

    if (nextTab === currentTab && nextSlug === activeSlug) return;

    setIsTransitioning(true);

    setTimeout(() => {
      // Update browser URL
      const newPath = getPathForTab(nextTab, nextSlug);
      window.history.pushState({}, '', newPath);

      setRouteState({ tab: nextTab, slug: nextSlug });
      if (nextTab !== 'dynamic-landing') {
        setActiveLanding(null);
      }
      window.scrollTo(0, 0);

      // Shutter flash effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 120);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 400);
  }, [currentTab, activeSlug]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const renderActivePage = () => {
    if (currentTab === 'dynamic-landing' && activeSlug) {
      return (
        <DynamicLanding
          slug={activeSlug}
          setTab={handleTabChange}
          onLandingLoaded={(landing) => setActiveLanding(landing)}
        />
      );
    }

    if (currentTab === 'services' || currentTab === 'servicios') {
      return <ServicesPage setTab={handleTabChange} />;
    }

    if (currentTab.startsWith('service-')) {
      const serviceId = currentTab.replace('service-', '');
      return <ServicePage serviceId={serviceId} setTab={handleTabChange} addToCart={addToCart} />;
    }

    if (currentTab === 'gallery') {
      return <ClientGallery initialStage="selection" setTab={handleTabChange} />;
    }
    if (currentTab === 'gallery-selection' || currentTab === 'seleccion') {
      return <ClientGallery initialStage="selection" setTab={handleTabChange} />;
    }
    if (currentTab === 'gallery-delivery' || currentTab === 'entrega') {
      return <ClientGallery initialStage="delivery" setTab={handleTabChange} />;
    }

    switch (currentTab) {
      case 'home':
        return <Home setTab={handleTabChange} />;
      case 'gallery':
        return <ClientGallery initialStage="selection" setTab={handleTabChange} />;
      case 'gallery-selection':
      case 'seleccion':
        return <ClientGallery initialStage="selection" setTab={handleTabChange} />;
      case 'gallery-delivery':
      case 'entrega':
        return <ClientGallery initialStage="delivery" setTab={handleTabChange} />;
      case 'services':
      case 'servicios':
        return <ServicesPage setTab={handleTabChange} />;
      case 'cotizador':
      case 'packages':
        return <ProductPage addToCart={addToCart} setTab={handleTabChange} />;
      case 'portfolio':
        return <Portfolio setTab={handleTabChange} />;
      case 'community':
        return <Community setTab={handleTabChange} />;
      case 'contact':
        return <Contact setTab={handleTabChange} />;
      case 'zonas':
        return <ZonasPage setTab={handleTabChange} />;
      default:
        return <Home setTab={handleTabChange} />;
    }
  };

  return (
    <WixContextProvider>
      {/* Global Camera Shutter Page Transition Curtain */}
      <div className={`global-shutter-curtain ${isTransitioning ? 'active' : ''}`}>
        <div className="shutter-blade-top" />
        <div className="shutter-blade-bottom" />
      </div>
      <div className={`shutter-flash-flare ${flashActive ? 'flash' : ''}`} />

      {/* 1. Custom Cursor */}
      <CustomCursor />

      {/* 2. Header / Nav */}
      <Navbar 
        currentTab={currentTab} 
        setTab={handleTabChange} 
        cartCount={cartItems.length} 
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
        togglePortal={() => setIsPortalOpen(!isPortalOpen)}
      />

      {/* 3. Main View Area */}
      <main style={{ minHeight: '80vh' }}>
        {renderActivePage()}
      </main>

      {/* 4. Sliding Cart panel */}
      <Cart 
        isOpen={isCartOpen} 
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
        cartItems={cartItems} 
        removeFromCart={removeFromCart} 
        clearCart={clearCart} 
      />

      {/* 5. Portal client selection Dashboard */}
      <UserPortal 
        isOpen={isPortalOpen} 
        onClose={() => setIsPortalOpen(false)} 
        setTab={handleTabChange}
      />

      {/* 6. Floating support & WhatsApp shortcuts (dynamically linked when on CMS landing) */}
      <FloatingWidget customWhatsappUrl={activeLanding?.whatsapp} />

      {/* 7. Registration 10% OFF Promo Popup (triggers after 3s) */}
      <RegistrationPromoPopup />

      {/* 8. Footer */}
      <Footer setTab={handleTabChange} />
    </WixContextProvider>
  );
}
