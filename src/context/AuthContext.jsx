import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => getStoredAuth());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = () => {
      setAdminUser(getStoredAuth());
    };

    window.addEventListener('clubsphere_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    setIsLoading(false);

    return () => {
      window.removeEventListener('clubsphere_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'admin@clubsphere.com' && cleanPass === 'admin123') {
      const user = {
        name: 'Club Administrator',
        email: cleanEmail,
        role: 'Super Admin',
        loggedInAt: new Date().toISOString(),
      };
      setStoredAuth(user);
      setAdminUser(user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Use demo credentials: admin@clubsphere.com / admin123',
    };
  };

  const logout = () => {
    clearStoredAuth();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser),
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
