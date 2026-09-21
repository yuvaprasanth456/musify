import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, Music, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { supabase } from '../services/supabaseStorage';
import CreatePlaylistModal from '../components/playlist/CreatePlaylistModal';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { likedSongIds, songs, playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState('All');
  const [playlists, setPlaylists] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const artists = useMemo(() => {
    const artistMap = new Map();
    (songs || []).forEach(s => {
      const name = s.artist || s.artistName;
      if (name && !artistMap.has(name.toLowerCase())) {
        artistMap.set(name.toLowerCase(), {
          id: s.artistId || s.id,
          name: name,
          imageUrl: s.coverUrl
        });
      }
    });
    return Array.from(artistMap.values());
  }, [songs]);

  const tabs = ['All', 'Playlists', 'Artists'];

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="heading-hero" style={{ fontSize: '2rem' }}>Your Library</h1>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '13.5px' }}
        >
          <Plus size={16} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === tab ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              color: activeTab === tab ? '#000000' : '#ffffff',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}
      >
        {/* 1. Liked Songs Featured Banner Card */}
        {(activeTab === 'All' || activeTab === 'Playlists') && (
          <div
            onClick={() => navigate('/liked')}
            style={{
              gridColumn: 'span 2',
              minHeight: '220px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #450af5 0%, #8e8ee5 100%)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
              <Heart size={36} fill="#fff" color="#fff" />
            </div>

            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Liked Songs
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                {likedSongIds.length} liked tracks
              </p>
            </div>
          </div>
        )}

        {/* 2. Playlists */}
        {(activeTab === 'All' || activeTab === 'Playlists') && playlists.map(pl => (
          <div
            key={pl.id}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            className="music-card"
            style={{ width: 'auto', minWidth: 'auto' }}
          >
            <div className="music-card-img-wrapper">
              <img src={pl.coverUrl} alt={pl.name} />
              <button 
                className="floating-play-btn"
                onClick={(e) => { e.stopPropagation(); navigate(`/playlist/${pl.id}`); }}
                aria-label="Play playlist"
              >
                <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />
              </button>
            </div>
            <h4 className="heading-card">{pl.name}</h4>
            <p className="text-meta">Playlist • {pl.createdBy}</p>
          </div>
        ))}

        {/* 3. Followed Artists */}
        {(activeTab === 'All' || activeTab === 'Artists') && SAMPLE_ARTISTS.map(artist => (
          <div
            key={artist.id}
            className="music-card"
            style={{ width: 'auto', minWidth: 'auto', alignItems: 'center', textAlign: 'center' }}
            onClick={() => navigate(`/artist/${artist.id}`)}
          >
            <div 
              className="music-card-img-wrapper" 
              style={{ borderRadius: '50%', width: '140px', paddingBottom: '140px' }}
            >
              <img src={artist.imageUrl} alt={artist.name} />
            </div>
            <h4 className="heading-card" style={{ textAlign: 'center' }}>{artist.name}</h4>
            <p className="text-meta">Artist</p>
          </div>
        ))}
      </div>

      <CreatePlaylistModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newPl) => setPlaylists(prev => [newPl, ...prev])}
      />
    </div>
  );
}
