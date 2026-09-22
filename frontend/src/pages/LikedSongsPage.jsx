import React, { useState } from 'react';
import { Heart, Play, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import SongRow from '../components/cards/SongRow';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';
import { useNavigate } from 'react-router-dom';

export default function LikedSongsPage() {
  const { likedSongIds, playSong, toggleShuffle, songs } = usePlayer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  const likedSongs = (songs || []).filter(s => (likedSongIds || []).includes(s.id));

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handleShufflePlay = () => {
    if (likedSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * likedSongs.length);
      toggleShuffle();
      playSong(likedSongs[randomIndex], likedSongs);
    }
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Header Banner */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '28px',
          padding: '28px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.06) 60%, var(--bg-canvas) 100%)',
          marginBottom: '28px',
          border: '1px solid var(--accent-subtle-border)'
        }}
      >
        <div 
          style={{
            width: '180px',
            height: '180px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #e5be49 0%, #aa7c11 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 36px rgba(180, 140, 30, 0.3)',
            flexShrink: 0
          }}
        >
          <Heart size={72} fill="#fff" color="#fff" />
        </div>

        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            Playlist
          </span>
          <h1 className="heading-hero" style={{ fontSize: '3.2rem', margin: '6px 0 12px', color: 'var(--text-primary)' }}>
            Liked Songs
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user ? user.name : 'You'}</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {likedSongs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px', paddingLeft: '8px' }}>
          <button 
            onClick={handlePlayAll}
            className="floating-play-btn"
            style={{ position: 'static', opacity: 1, transform: 'none', width: '54px', height: '54px' }}
            aria-label="Play all liked songs"
          >
            <Play size={24} fill="#181510" style={{ marginLeft: '3px' }} />
          </button>

          <button 
            onClick={handleShufflePlay}
            className="btn-icon"
            style={{ width: '42px', height: '42px', color: 'var(--text-secondary)' }}
            title="Shuffle play"
          >
            <Shuffle size={22} />
          </button>
        </div>
      )}

      {/* Songs Table Header */}
      {likedSongs.length > 0 ? (
        <div>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '36px 4fr 3fr 2fr 48px 60px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '8px'
            }}
          >
            <span style={{ textAlign: 'center' }}>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Genre</span>
            <span></span>
            <span style={{ textAlign: 'right' }}>Time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {likedSongs.map((song, idx) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={idx}
                playlist={likedSongs}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Heart size={48} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Songs you like will appear here</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto 20px' }}>
            Save songs you love by tapping the heart icon on any track to build your personal collection.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Find songs to like
          </button>
        </div>
      )}

      <AddToPlaylistModal 
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
        song={selectedSongForPlaylist}
      />
    </div>
  );
}
