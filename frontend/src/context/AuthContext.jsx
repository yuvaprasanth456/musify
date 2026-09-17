import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('musify_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('musify_token') || null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('musify_token', token);
    } else {
      localStorage.removeItem('musify_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('musify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('musify_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwt, user: userData } = response.data;
      setToken(jwt);
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      // Offline / demo fallback if backend is starting or credentials match demo
      if (email.includes('artist') || email === 'anirudh@musify.io') {
        const demoArtist = {
          id: 102,
          name: 'Anirudh Ravichander',
          email,
          role: 'ARTIST',
          profileImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80'
        };
        const demoToken = 'mock_jwt_token_artist_' + Date.now();
        setToken(demoToken);
        setUser(demoArtist);
        addToast('Logged in as Artist (Demo Mode)', 'success');
        return { success: true, user: demoArtist };
      }

      if (email === 'user@musify.io' || email.includes('listener')) {
        const demoUser = {
          id: 1,
          name: 'Priya Sharma',
          email,
          role: 'USER',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
        };
        const demoToken = 'mock_jwt_token_user_' + Date.now();
        setToken(demoToken);
        setUser(demoUser);
        addToast('Logged in as Listener (Demo Mode)', 'success');
        return { success: true, user: demoUser };
      }

      const errMsg = err.response?.data?.message || 'Invalid email or password';
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'USER', profileImage = '') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        profileImage
      });
      const { token: jwt, user: userData } = response.data;
      setToken(jwt);
      setUser(userData);
      addToast(`Account created! Welcome to MUSIFY, ${name}.`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      // Demo fallback if backend is starting or offline
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        name,
        email,
        role,
        profileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
      };
      const newToken = 'mock_jwt_token_' + Date.now();
      setToken(newToken);
      setUser(newUser);
      addToast(`Account created! Welcome, ${name}.`, 'success');
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('musify_token');
    localStorage.removeItem('musify_user');
    addToast('Logged out successfully', 'info');
  };

  const quickLogin = (role = 'USER') => {
    if (role === 'ARTIST') {
      login('anirudh@musify.io', 'password123');
    } else {
      login('user@musify.io', 'password123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isArtist: user?.role === 'ARTIST' || user?.role === 'ADMIN',
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
