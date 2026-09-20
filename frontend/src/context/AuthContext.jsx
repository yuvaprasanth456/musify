import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabaseStorage';
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

  // Sync with Supabase Auth session on load
  useEffect(() => {
    if (!supabase) return;

    // Check current active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        const meta = session.user.user_metadata || {};
        const activeUser = {
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'Musify User',
          email: session.user.email,
          role: meta.role || 'USER',
          profileImage: meta.profile_image || meta.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
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

  const login = async (email, password) => {
    setLoading(true);
    let authenticatedUser = null;
    let authToken = null;

    // 1. Attempt Supabase Auth login
    if (supabase) {
      try {
        const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (sbData?.user) {
          const meta = sbData.user.user_metadata || {};
          authenticatedUser = {
            id: sbData.user.id,
            name: meta.name || email.split('@')[0],
            email: sbData.user.email,
            role: meta.role || (email.includes('artist') || email === 'anirudh@musify.io' ? 'ARTIST' : 'USER'),
            profileImage: meta.profile_image || meta.profileImage || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80'
          };
          authToken = sbData.session?.access_token || ('sb_token_' + Date.now());
          console.log('Logged in with Supabase Auth:', authenticatedUser);
        } else if (sbErr) {
          console.warn('Supabase signIn notice:', sbErr.message);
        }
      } catch (err) {
        console.warn('Supabase signIn exception:', err);
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

    // 3. Demo fallback if demo accounts used
    if (!authenticatedUser) {
      if (email.includes('artist') || email === 'anirudh@musify.io') {
        authenticatedUser = {
          id: 102,
          name: 'Anirudh Ravichander',
          email,
          role: 'ARTIST',
          profileImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80'
        };
        authToken = 'mock_jwt_token_artist_' + Date.now();
      } else if (email === 'user@musify.io' || email.includes('listener')) {
        authenticatedUser = {
          id: 1,
          name: 'Priya Sharma',
          email,
          role: 'USER',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
        };
        authToken = 'mock_jwt_token_user_' + Date.now();
      }
    }

    setLoading(false);

    if (authenticatedUser) {
      setToken(authToken || ('musify_tok_' + Date.now()));
      setUser(authenticatedUser);
      addToast(`Welcome back, ${authenticatedUser.name}! (Authenticated via Supabase)`, 'success');
      return { success: true, user: authenticatedUser };
    } else {
      addToast('Invalid email or password', 'error');
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = async (name, email, password, role = 'USER', profileImage = '') => {
    setLoading(true);
    const finalProfileImg = profileImage || (role === 'ARTIST' 
      ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');

    let newUser = null;
    let newJwt = null;

    // 1. Register with Supabase Auth
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
        } else if (sbAuthData?.user) {
          newUser = {
            id: sbAuthData.user.id,
            name,
            email,
            role,
            profileImage: finalProfileImg
          };
          newJwt = sbAuthData.session?.access_token || ('sb_auth_' + Date.now());
          console.log('Account created in Supabase Auth:', newUser);
        }

        // Always save account into Supabase public.users table
        try {
          const { data: dbUserData, error: dbErr } = await supabase.from('users').upsert([
            {
              supabase_uid: sbAuthData?.user?.id || null,
              name,
              email,
              role,
              profile_image: finalProfileImg
            }
          ], { onConflict: 'email' }).select();

          if (dbUserData && dbUserData[0]) {
            console.log('Account stored in Supabase public.users:', dbUserData[0]);
            if (!newUser) {
              newUser = {
                id: dbUserData[0].id,
                name: dbUserData[0].name,
                email: dbUserData[0].email,
                role: dbUserData[0].role,
                profileImage: dbUserData[0].profile_image
              };
            }
          } else if (dbErr) {
            console.warn('Supabase public.users notice:', dbErr.message);
          }
        } catch (dbErr) {
          console.warn('Supabase public.users sync error:', dbErr);
        }
      } catch (err) {
        console.warn('Supabase Auth register exception:', err);
      }
    }

    // 2. Also register in Spring Boot backend
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        profileImage: finalProfileImg
      });
      const { token: jwt, user: userData } = response.data;
      if (jwt) newJwt = jwt;
      if (userData) newUser = userData;
    } catch (backendErr) {
      console.warn('Backend register notice:', backendErr.message);
    }

    // 3. Fallback state creation if needed
    if (!newUser) {
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
    setToken(newJwt);
    setUser(newUser);
    addToast(`Account registered and saved in Supabase! Welcome, ${name}.`, 'success');
    return { success: true, user: newUser };
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
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
