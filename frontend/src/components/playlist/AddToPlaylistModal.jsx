import React from 'react';
import { Music, Check, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import { SAMPLE_PLAYLISTS } from '../../utils/sampleData';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AddToPlaylistModal({ isOpen, onClose, song }) {
  const { addToast } = useToast();

  if (!song) return null;

  const handleSelectPlaylist = async (playlist) => {
    try {
      await api.post(`/playlists/${playlist.id}/songs`, { songId: song.id });
    } catch {}
    addToast(`Added "${song.title}" to ${playlist.name}`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p className="text-meta" style={{ marginBottom: '10px' }}>
          Select a playlist for <strong>{song.title}</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
          {SAMPLE_PLAYLISTS.map(pl => (
            <button
              key={pl.id}
              onClick={() => handleSelectPlaylist(pl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                textAlign: 'left',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'}
            >
              <img 
                src={pl.coverUrl} 
                alt={pl.name} 
                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>{pl.name}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{pl.songCount} songs</div>
              </div>
              <Plus size={18} color="var(--accent-primary)" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
