import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabaseStorage';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('musify_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.email === 'user@musify.io' || parsed?.email === 'anirudh@musify.io') {
        localStorage.removeItem('musify_user');
        localStorage.removeItem('musify_token');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
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

  // Sync with Supabase Auth session on load
  useEffect(() => {
    if (!supabase) return;

    // Check current active Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && !user) {
        const meta = session.user.user_metadata || {};
        let role = (meta.role || '').toUpperCase();
        if (!role || role === 'USER') {
          try {
            const { data: dbUser } = await supabase.from('users').select('role').eq('email', session.user.email).maybeSingle();
            if (dbUser?.role) role = dbUser.role.toUpperCase();
          } catch { }
        }
        if (!role) role = 'USER';

        const activeUser = {
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'Musify User',
          email: session.user.email,
          role,
          profileImage: meta.profile_image || meta.profileImage || (role === 'ARTIST' ? 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')
        };
        setUser(activeUser);
        setToken(session.access_token);
      }
    }).catch(err => {
      console.warn('Supabase getSession error:', err);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const meta = session.user.user_metadata || {};
        const signedUser = {
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'Musify User',
          email: session.user.email,
          role: meta.role || 'USER',
          profileImage: meta.profile_image || meta.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
        };
        setUser(signedUser);
        setToken(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (rawEmail, password) => {
    setLoading(true);
    const email = (rawEmail || '').trim();
    let authenticatedUser = null;
    let authToken = null;
    let authErrorMessage = null;

    // 1. Try Supabase Auth SignIn first
    if (supabase) {
      try {
        const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (sbData?.user) {
          const meta = sbData.user.user_metadata || {};
          let role = (meta.role || '').toUpperCase();
          if (!role || role === 'USER') {
            try {
              const { data: dbUser } = await supabase.from('users').select('role').eq('email', sbData.user.email).maybeSingle();
              if (dbUser?.role) role = dbUser.role.toUpperCase();
            } catch { }
          }
          if (!role) role = 'USER';

          authenticatedUser = {
            id: sbData.user.id,
            name: meta.name || email.split('@')[0],
            email: sbData.user.email,
            role,
            profileImage: meta.profile_image || meta.profileImage || (role === 'ARTIST' ? 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')
          };
          authToken = sbData.session?.access_token || ('sb_token_' + Date.now());
          console.log('Logged in with Supabase Auth:', authenticatedUser);
        } else if (sbErr) {
          console.warn('Supabase signIn notice:', sbErr.message);
          if (sbErr.message?.toLowerCase().includes('email not confirmed')) {
            authErrorMessage = 'Email not confirmed. Please check your inbox or sign up again.';
          } else if (sbErr.message?.toLowerCase().includes('invalid login credentials')) {
            authErrorMessage = 'Invalid email or password. If you registered during the earlier rate-limit error, please create your account again on the Sign Up page.';
          } else {
            authErrorMessage = sbErr.message;
          }
        }
      } catch (err) {
        console.warn('Supabase signIn exception:', err);
        authErrorMessage = err.message;
      }
    }

    // 2. Also authenticate with Spring Boot Backend API
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwt, user: userData } = response.data;
      if (jwt) authToken = jwt;
      if (userData) authenticatedUser = userData;
    } catch (backendErr) {
      console.warn('Backend login notice:', backendErr.message);
    }

    setLoading(false);

    if (authenticatedUser) {
      setToken(authToken || ('musify_tok_' + Date.now()));
      setUser(authenticatedUser);
      addToast(`Welcome back, ${authenticatedUser.name}! (Authenticated via Supabase)`, 'success');
      return { success: true, user: authenticatedUser };
    } else {
      const finalMsg = authErrorMessage || 'Invalid email or password';
      addToast(finalMsg, 'error');
      return { success: false, message: finalMsg };
    }
  };

  const register = async (name, rawEmail, password, role = 'USER', profileImage = '') => {
    setLoading(true);
    const email = (rawEmail || '').trim();
    const finalProfileImg = (profileImage && profileImage.startsWith('http'))
      ? profileImage
      : (role === 'ARTIST'
        ? 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');

    let newUser = null;
    let newJwt = null;
    let errorMessage = null;

    // 1. Register with Spring Boot Backend API
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        profileImage: finalProfileImg
      });
      if (response.data?.token) {
        newJwt = response.data.token;
        newUser = response.data.user;
        console.log('Registered with backend API:', newUser);
      }
    } catch (backendErr) {
      console.warn('Backend register notice:', backendErr.response?.data?.message || backendErr.message);
      if (backendErr.response?.data?.message) {
        errorMessage = backendErr.response.data.message;
      }
    }

    // 2. Also register with Supabase Auth
    if (supabase) {
      try {
        const { data: sbAuthData, error: sbAuthErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              profile_image: finalProfileImg
            }
          }
        });

        if (sbAuthErr) {
          console.warn('Supabase Auth signUp notice:', sbAuthErr.message);
          if (!errorMessage) errorMessage = sbAuthErr.message;
        } else if (sbAuthData?.user) {
          if (!newUser) {
            newUser = {
              id: sbAuthData.user.id,
              name,
              email,
              role,
              profileImage: finalProfileImg
            };
          }
          if (!newJwt && sbAuthData.session?.access_token) {
            newJwt = sbAuthData.session.access_token;
          }
          console.log('Registered with Supabase Auth:', sbAuthData.user);
        }

        // Sync into public.users table if it exists
        try {
          await supabase.from('users').upsert([
            {
              name,
              email,
              role,
              profile_image: finalProfileImg
            }
          ], { onConflict: 'email' });
        } catch (dbErr) {
          console.warn('Supabase public.users notice:', dbErr);
        }
      } catch (err) {
        console.warn('Supabase Auth register exception:', err);
      }
    }

    // 3. Fallback state creation if needed
    if (!newUser && !errorMessage) {
      newUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        name,
        email,
        role,
        profileImage: finalProfileImg
      };
      newJwt = 'jwt_' + Date.now();
    }

    setLoading(false);

    if (newUser) {
      const activeToken = newJwt || ('musify_jwt_' + Date.now());
      setToken(activeToken);
      setUser(newUser);
      addToast(`Account created successfully! Welcome, ${name}.`, 'success');
      return { success: true, user: newUser };
    } else {
      addToast(errorMessage || 'Failed to create account. Please try again.', 'error');
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut().catch(() => { });
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('musify_token');
    localStorage.removeItem('musify_user');
    addToast('Logged out successfully', 'info');
  };

  const quickLogin = () => { };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isArtist: Boolean(user && ((user.role || '').toUpperCase() === 'ARTIST' || (user.role || '').toUpperCase() === 'ADMIN')),
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
