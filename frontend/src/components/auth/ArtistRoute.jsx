import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ArtistRoute({ children }) {
  const { isArtist, loading, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        addToast('Please sign in with an Artist account to access the Artist Studio.', 'info');
      } else if (!isArtist) {
        addToast('Access denied: Artist Studio is restricted to Artist accounts only.', 'error');
      }
    }
  }, [loading, isAuthenticated, isArtist, addToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isArtist) {
    return <Navigate to="/" replace />;
  }

  return children;
}
