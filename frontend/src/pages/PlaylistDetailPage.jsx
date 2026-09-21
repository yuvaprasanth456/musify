import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Edit3, Trash2, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SAMPLE_PLAYLISTS } from '../utils/sampleData';
import SongRow from '../components/cards/SongRow';
import Modal from '../components/common/Modal';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong, toggleShuffle } = usePlayer();
  const { addToast } = useToast();

  const playlistId = parseInt(id, 10);
  const initialPlaylist = SAMPLE_PLAYLISTS.find(p => p.id === playlistId) || {
    id: playlistId,
    name: 'Custom Playlist',
    description: 'Personal music collection',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    songCount: 0,
    createdBy: 'You'
  };

  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [songs, setSongs] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDesc, setEditDesc] = useState(playlist.description);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleShufflePlay = () => {
    if (songs.length > 0) {
      const idx = Math.floor(Math.random() * songs.length);
      toggleShuffle();
      playSong(songs[idx], songs);
    }
  };

  const handleRemoveSong = (songId) => {
    setSongs(prev => prev.filter(s => s.id !== songId));
    addToast('Removed from playlist', 'info');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPlaylist(prev => ({ ...prev, name: editName, description: editDesc }));
    setIsEditOpen(false);
    addToast('Playlist details updated', 'success');
  };

  const handleDeletePlaylist = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      addToast(`Deleted "${playlist.name}"`, 'info');
      navigate('/library');
    }
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Playlist Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '28px',
          padding: '28px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(180deg, #2a2a35 0%, #15151a 70%, var(--bg-canvas) 100%)',
          marginBottom: '28px'
        }}
      >
        <img 
          src={playlist.coverUrl} 
          alt={playlist.name} 
          style={{ width: '190px', height: '190px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)', flexShrink: 0 }}
        />

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            Playlist
          </span>
          <h1 className="heading-hero" style={{ fontSize: '3rem', margin: '6px 0 10px', color: '#fff' }}>
            {playlist.name}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '14px', maxWidth: '600px' }}>
            {playlist.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>{playlist.createdBy}</span>
            <span>•</span>
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px', paddingLeft: '8px' }}>
        {songs.length > 0 && (
          <button 
            onClick={handlePlayAll}
            className="floating-play-btn"
            style={{ position: 'static', opacity: 1, transform: 'none', width: '54px', height: '54px' }}
            aria-label="Play playlist"
          >
            <Play size={24} fill="#000" style={{ marginLeft: '3px' }} />
          </button>
        )}

        <button 
          onClick={handleShufflePlay}
          className="btn-icon"
          style={{ width: '42px', height: '42px', color: 'var(--text-secondary)' }}
          title="Shuffle play"
        >
          <Shuffle size={22} />
        </button>

        <button 
          onClick={() => setIsEditOpen(true)}
          className="btn-icon"
          style={{ width: '42px', height: '42px', color: 'var(--text-secondary)' }}
          title="Edit playlist"
        >
          <Edit3 size={20} />
        </button>

        <button 
          onClick={handleDeletePlaylist}
          className="btn-icon"
          style={{ width: '42px', height: '42px', color: '#ef4444' }}
          title="Delete playlist"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Songs Table */}
      {songs.length > 0 ? (
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
            {songs.map((song, idx) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={idx}
                playlist={songs}
                onRemoveFromPlaylist={handleRemoveSong}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Music size={44} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
          <h3>This playlist is empty</h3>
          <p style={{ marginTop: '6px' }}>Search for songs and add them to this playlist.</p>
        </div>
      )}

      {/* Edit Details Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Playlist Details">
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Playlist Name
            </label>
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Description
            </label>
            <textarea 
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
