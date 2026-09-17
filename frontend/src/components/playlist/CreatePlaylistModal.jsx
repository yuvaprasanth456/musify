import React, { useState } from 'react';
import { Music, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function CreatePlaylistModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter a playlist title', 'error');
      return;
    }

    setLoading(true);
    const newPlaylist = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim() || 'Custom curated playlist',
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
      songCount: 0,
      isPublic: true,
      createdBy: 'You'
    };

    try {
      await api.post('/playlists', { name, description });
    } catch {
      // Offline fallback
    }

    onCreated(newPlaylist);
    addToast(`Playlist "${name}" created!`, 'success');
    setName('');
    setDescription('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div 
            style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px dashed var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              flexShrink: 0
            }}
          >
            <Music size={32} />
            <span style={{ fontSize: '11px', marginTop: '6px' }}>Artwork</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Playlist Name
              </label>
              <input 
                type="text" 
                placeholder="My Awesome Playlist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Description (Optional)
              </label>
              <textarea 
                placeholder="Give your playlist a catchy description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Creating...' : 'Create Playlist'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
