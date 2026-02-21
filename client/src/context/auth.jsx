import { createContext, useContext, useCallback, useEffect, useState } from 'react';

import api from '../utils/client';

export const SESSION_KEY = 'elysian_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));

  const login = useCallback((newToken) => {
    sessionStorage.setItem(SESSION_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // best-effort — clear local state regardless
    }
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      sessionStorage.removeItem(SESSION_KEY);
      setToken(null);
    };
    window.addEventListener('elysian:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('elysian:unauthorized', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
