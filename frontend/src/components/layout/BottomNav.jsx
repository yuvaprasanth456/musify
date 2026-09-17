import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="mobile-nav-container">
      <NavLink 
        to="/" 
        className={({ isActive }) => `btn-icon ${isActive ? 'active' : ''}`}
        style={{ flexDirection: 'column', gap: '3px', height: '100%', fontSize: '10px' }}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/search" 
        className={({ isActive }) => `btn-icon ${isActive ? 'active' : ''}`}
        style={{ flexDirection: 'column', gap: '3px', height: '100%', fontSize: '10px' }}
      >
        <Search size={20} />
        <span>Search</span>
      </NavLink>

      <NavLink 
        to="/library" 
        className={({ isActive }) => `btn-icon ${isActive ? 'active' : ''}`}
        style={{ flexDirection: 'column', gap: '3px', height: '100%', fontSize: '10px' }}
      >
        <Library size={20} />
        <span>Library</span>
      </NavLink>

      <NavLink 
        to="/liked" 
        className={({ isActive }) => `btn-icon ${isActive ? 'active' : ''}`}
        style={{ flexDirection: 'column', gap: '3px', height: '100%', fontSize: '10px' }}
      >
        <Heart size={20} />
        <span>Liked</span>
      </NavLink>

      <NavLink 
        to={isAuthenticated ? '/settings' : '/login'} 
        className={({ isActive }) => `btn-icon ${isActive ? 'active' : ''}`}
        style={{ flexDirection: 'column', gap: '3px', height: '100%', fontSize: '10px' }}
      >
        <User size={20} />
        <span>{isAuthenticated ? 'Account' : 'Login'}</span>
      </NavLink>
    </nav>
  );
}
