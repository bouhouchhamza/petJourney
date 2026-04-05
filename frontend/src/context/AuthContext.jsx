import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // 3-state loading: null = not checked yet, true = checking, false = done
  // This prevents ProtectedRoute from redirecting before the check completes.
  const [loading, setLoading] = useState(true);

  // ─── checkAuth ─────────────────────────────────────────────────────────────
  // Called automatically on every app mount (see useEffect below).
  // Hits /api/users/me with the HttpOnly cookie — if the cookie is valid,
  // the server returns the user object and we restore the session silently.
  // If the cookie is missing/expired, the server returns 401 and we set null.
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/me');
      setUserInfo(data);
      return data;
    } catch {
      // 401 = not logged in, just clear state silently (no console noise)
      setUserInfo(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once on app startup to restore session from cookie
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ─── login ─────────────────────────────────────────────────────────────────
  // Sends credentials, stores returned user in state.
  // The server sets the HttpOnly cookie — axios just receives it automatically.
  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUserInfo(data);
    return data;
  };

  // ─── logout ────────────────────────────────────────────────────────────────
  // Tells the server to clear the cookie, then clears local state.
  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch {
      // Even if the request fails, clear local state
    } finally {
      setUserInfo(null);
    }
  };

  // ─── register ──────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    setUserInfo(data);
    return data;
  };

  const value = {
    userInfo,
    loading,
    login,
    logout,
    register,
    checkAuth,
    isAdmin: userInfo?.role === 'admin',
    isLoggedIn: !!userInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
