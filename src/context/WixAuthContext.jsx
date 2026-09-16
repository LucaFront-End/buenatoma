import React, { createContext, useContext, useState, useEffect } from 'react';

export const WixAuthContext = createContext(null);

const MEMBER_STORAGE_KEY = 'buenatoma_wix_member';

export const DEFAULT_FILMMAKER = {
  id: 'film-001',
  name: 'Isaac Ángel',
  email: 'isaac@buenatoma.mx',
  role: 'filmmaker',
  tags: ['Filmmaker', 'Staff', 'Editor'],
  phone: '55 9244 1070',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
};

export const DEFAULT_CLIENT = {
  id: 'client-001',
  name: 'Sofía Oramas',
  email: 'sofia.oramas@gmail.com',
  role: 'client',
  tags: ['Client'],
  phone: '55 1234 5678',
  sessionCode: 'BNTM-26001'
};

export function WixAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(MEMBER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default to Filmmaker for smooth staff access or null
    return DEFAULT_FILMMAKER;
  });

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(currentUser));
      } catch {}
    } else {
      localStorage.removeItem(MEMBER_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email, password) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (cleanEmail.includes('film') || cleanEmail.includes('isaac') || cleanEmail.includes('editor') || cleanEmail.includes('fotografo')) {
      setCurrentUser(DEFAULT_FILMMAKER);
      return { success: true, user: DEFAULT_FILMMAKER };
    }
    const clientUser = {
      ...DEFAULT_CLIENT,
      email: cleanEmail,
      name: cleanEmail.split('@')[0]
    };
    setCurrentUser(clientUser);
    return { success: true, user: clientUser };
  };

  const loginAsFilmmaker = () => {
    setCurrentUser(DEFAULT_FILMMAKER);
  };

  const loginAsClient = (sessionCode = 'BNTM-26001') => {
    setCurrentUser({
      ...DEFAULT_CLIENT,
      sessionCode
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasTag = (tag) => {
    return Boolean(currentUser?.tags?.includes(tag));
  };

  const isFilmmaker = Boolean(
    currentUser?.role === 'filmmaker' || 
    currentUser?.tags?.includes('Filmmaker')
  );

  return (
    <WixAuthContext.Provider value={{
      currentUser,
      isLoggedIn: Boolean(currentUser),
      isFilmmaker,
      hasTag,
      login,
      loginAsFilmmaker,
      loginAsClient,
      logout
    }}>
      {children}
    </WixAuthContext.Provider>
  );
}

export function useWixAuth() {
  const context = useContext(WixAuthContext);
  if (!context) {
    throw new Error('useWixAuth must be used within a WixAuthProvider');
  }
  return context;
}
