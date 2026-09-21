import React from 'react';
import { Play, Pause, Heart, ListPlus, Radio, Share2, Trash2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DropdownMenu from '../common/DropdownMenu';

export default function MusicCard({ song, onAddToPlaylist = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, addToQueue, deleteSong } = usePlayer();
  const { isArtist } = useAuth();
  const { addToast } = useToast();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const liked = isLiked(song.id);

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(song.id);
  };

  const menuItems = [
    {
      label: 'Add to Queue',
      icon: <ListPlus size={15} />,
      onClick: () => addToQueue(song)
    },
    ...(onAddToPlaylist ? [{
      label: 'Add to Playlist',
      icon: <Radio size={15} />,
      onClick: () => onAddToPlaylist(song)
    }] : []),
    {
      label: liked ? 'Remove from Liked' : 'Save to Liked Songs',
      icon: <Heart size={15} color={liked ? '#1db954' : 'currentColor'} />,
      onClick: () => toggleLike(song.id)
    },
    {
      label: 'Copy Song Link',
      icon: <Share2 size={15} />,
      onClick: () => {
        navigator.clipboard?.writeText(window.location.origin + '/?song=' + song.id);
        addToast('Song link copied to clipboard', 'info', 2000);
      }
    },
    ...(isArtist ? [{
      label: 'Delete Song from Supabase',
      icon: <Trash2 size={15} color="#ef4444" />,
      danger: true,
      onClick: () => {
        if (window.confirm(`Delete "${song.title}" from Supabase and streaming?`)) {
          deleteSong(song.id);
        }
      }
    }] : [])
  ];

  return (
    <div className="music-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="music-card-img-wrapper">
        <img 
          src={song.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80'} 
          alt={song.title} 
          loading="lazy" 
        />
        <button 
          className="floating-play-btn"
          onClick={handlePlayClick}
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          style={isCurrentlyPlaying ? { opacity: 1, transform: 'translateY(0)' } : {}}
        >
          {isCurrentlyPlaying ? <Pause size={20} fill="#000" /> : <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 
          className="heading-card" 
          title={song.title}
          style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '4px' }}
        >
          {song.title}
        </h4>
        <p className="text-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>
          {song.artist}
        </p>
      </div>

      <div 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleLikeClick}
          className="btn-icon" 
          style={{ width: '28px', height: '28px', color: liked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          aria-label={liked ? 'Unlike song' : 'Like song'}
        >
          <Heart size={16} fill={liked ? 'var(--accent-primary)' : 'none'} />
        </button>

        <DropdownMenu items={menuItems} />
      </div>
    </div>
  );
}
