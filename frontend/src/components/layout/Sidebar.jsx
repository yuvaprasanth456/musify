import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  Clock, 
  PlusSquare, 
  Mic2, 
  Settings, 
  Music2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseStorage';
import CreatePlaylistModal from '../playlist/CreatePlaylistModal';

export default function Sidebar() {
  const { user, isArtist } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function loadPlaylists() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('playlists').select('*').order('id', { ascending: false });
        if (data && !error) {
          setPlaylists(data);
        }
      } catch (err) {
        console.warn('Load playlists notice:', err);
      }
    }
    loadPlaylists();
  }, []);

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  return (
    <>
      <aside className="sidebar-container">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '24px 24px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer' 
          }}
        >
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-accent)'
            }}
          >
            <Music2 size={22} color="#181510" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              MUSIFY
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-primary-dark)', marginLeft: '4px', textTransform: 'uppercase' }}>
              PRO
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/search" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Search size={20} />
            <span>Search</span>
          </NavLink>

          <NavLink to="/library" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Library size={20} />
            <span>Your Library</span>
          </NavLink>
        </div>

        {/* Library Sub-section */}
        <div style={{ marginTop: '12px', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/liked" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <div 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '6px', 
                background: 'linear-gradient(135deg, #e5be49 0%, #aa7c11 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(180, 140, 30, 0.25)'
              }}
            >
              <Heart size={14} fill="#fff" color="#fff" />
            </div>
            <span>Liked Songs</span>
          </NavLink>

          <NavLink to="/recently-played" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <div 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '6px', 
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={14} color="var(--text-primary)" />
            </div>
            <span>Recently Played</span>
          </NavLink>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="nav-link-item"
            style={{ width: '100%', textAlign: 'left' }}
          >
            <div 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '6px', 
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PlusSquare size={16} color="var(--text-primary)" />
            </div>
            <span>Create Playlist</span>
          </button>

          {/* Artist Dashboard Link - Only visible to Artist accounts */}
          {isArtist && (
            <NavLink 
              to="/artist/dashboard" 
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              style={{ color: 'var(--accent-primary-dark)' }}
            >
              <div 
                style={{ 
                  width: '26px', 
                  height: '26px', 
                  borderRadius: '6px', 
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mic2 size={14} color="#181510" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Artist Studio</span>
                <Sparkles size={12} color="var(--accent-primary-dark)" />
              </div>
            </NavLink>
          )}
        </div>

        {/* Separator */}
        <div style={{ margin: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }} />

        {/* Scrollable Playlists List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', padding: '0 12px 8px', display: 'block' }}>
            Playlists
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {playlists.map(pl => (
              <NavLink 
                key={pl.id}
                to={`/playlist/${pl.id}`}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                style={{ fontSize: '13px', padding: '8px 12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {pl.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom Settings Link */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <NavLink to="/settings" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      <CreatePlaylistModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreated={handlePlaylistCreated}
      />
    </>
  );
}
