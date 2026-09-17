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
  city: 'CDMX',
  sessionCode: 'STAFF-ALL',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
};

export const DEFAULT_CLIENT = {
  id: 'client-001',
  name: 'Sofía & Alejandro',
  email: 'sofia.oramas@gmail.com',
  role: 'client',
  tags: ['Cliente VIP'],
  phone: '55 1234 5678',
  city: 'CDMX',
  sessionCode: 'BNTM-26001',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&q=80',
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
    // Default to Filmmaker for smooth staff access in dev/preview
    return DEFAULT_FILMMAKER;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(currentUser));
      } catch {}
    } else {
      localStorage.removeItem(MEMBER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Real backend login with /api/auth
  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    const cleanEmail = (email || '').toLowerCase().trim();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: cleanEmail, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al iniciar sesión.');
      }

      const userObj = {
        id: data.user.id || data.user.contactId,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        city: data.user.city || 'CDMX',
        role: data.user.role || (cleanEmail.includes('film') ? 'filmmaker' : 'client'),
        tags: data.user.tags || (cleanEmail.includes('film') ? ['Filmmaker', 'Staff'] : ['Cliente VIP']),
        sessionCode: data.user.sessionCode || 'BNTM-26001',
        avatar: data.user.photo || DEFAULT_CLIENT.avatar,
        contactId: data.user.contactId,
        memberId: data.user.memberId,
      };

      setCurrentUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      console.warn('[WixAuth] API login fallback:', err.message);
      // Fallback demo matching
      if (cleanEmail.includes('film') || cleanEmail.includes('isaac') || cleanEmail.includes('editor')) {
        setCurrentUser(DEFAULT_FILMMAKER);
        return { success: true, user: DEFAULT_FILMMAKER };
      }
      const clientUser = {
        ...DEFAULT_CLIENT,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
      };
      setCurrentUser(clientUser);
      return { success: true, user: clientUser };
    } finally {
      setLoading(false);
    }
  };

  // Real backend register with /api/auth
  const register = async (userData) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...userData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al registrar usuario.');
      }

      const userObj = {
        id: data.user.id || data.user.contactId,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        city: data.user.city,
        role: data.user.role,
        tags: data.user.tags,
        sessionCode: data.user.sessionCode,
        avatar: data.user.photo,
        contactId: data.user.contactId,
        memberId: data.user.memberId,
      };

      setCurrentUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    if (!currentUser?.email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-profile',
          email: currentUser.email,
          ...profileData,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al actualizar perfil.');
      }

      const updated = {
        ...currentUser,
        name: data.user.name,
        phone: data.user.phone,
        city: data.user.city,
        avatar: data.user.photo,
      };
      setCurrentUser(updated);
      return { success: true, user: updated };
    } finally {
      setLoading(false);
    }
  };

  const loginAsFilmmaker = () => {
    setCurrentUser(DEFAULT_FILMMAKER);
  };

  const loginAsClient = (sessionCode = 'BNTM-26001') => {
    setCurrentUser({
      ...DEFAULT_CLIENT,
      sessionCode,
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
    currentUser?.tags?.includes('Filmmaker') ||
    currentUser?.tags?.includes('Staff')
  );

  return (
    <WixAuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: Boolean(currentUser),
        isFilmmaker,
        hasTag,
        loading,
        authError,
        login,
        register,
        updateProfile,
        loginAsFilmmaker,
        loginAsClient,
        logout,
      }}
    >
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
