import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default: everyone is a guest. No automatic profile fetch = no 401 in console.
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Called only when the user explicitly tries to log in
  const login = async (email, password) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Invalid server response. Check backend logs.');
    }

    if (!res.ok) throw new Error(data.message || 'Login failed');

    setUserInfo(data);
    return data;
  };

  // Called only when accessing protected routes (/admin)
  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
        return data;
      }
      setUserInfo(null);
      return null;
    } catch {
      setUserInfo(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
    } catch { /* silent */ }
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
