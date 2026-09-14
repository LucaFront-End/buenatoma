import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Cart from './components/Cart';
import FloatingWidget from './components/FloatingWidget';
import UserPortal from './components/UserPortal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Portfolio from './pages/Portfolio';
import Community from './pages/Community';
import Contact from './pages/Contact';
import ServicePage from './pages/ServicePage';

export default function App() {
  const [currentTab, setTab] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // States for Camera Shutter Page Transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab === currentTab) return;
    setIsTransitioning(true);
    
    // Shut blades closed
    setTimeout(() => {
      // Blades closed: update state and reset scroll to top of viewport
      setTab(newTab);
      window.scrollTo(0, 0);
      
      // Emit shutter flash effect on open
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 120);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 400);
  };

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true); // Automatically slide the cart open for feedback
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const renderActivePage = () => {
    if (currentTab.startsWith('service-')) {
      const serviceId = currentTab.replace('service-', '');
      return <ServicePage serviceId={serviceId} setTab={handleTabChange} addToCart={addToCart} />;
    }

    switch (currentTab) {
      case 'home':
        return <Home setTab={handleTabChange} />;
      case 'packages':
        return <ProductPage addToCart={addToCart} setTab={handleTabChange} />;
      case 'portfolio':
        return <Portfolio setTab={handleTabChange} />;
      case 'community':
        return <Community setTab={handleTabChange} />;
      case 'contact':
        return <Contact setTab={handleTabChange} />;
      default:
        return <Home setTab={handleTabChange} />;
    }
  };

  return (
    <>
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
      />

      {/* 6. Floating support & WhatsApp shortcuts */}
      <FloatingWidget />

      {/* 7. Footer */}
      <Footer setTab={handleTabChange} />
    </>
  );
}
