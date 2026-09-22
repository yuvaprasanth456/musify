import React, { useState } from 'react';
import { Play, Pause, Heart, ListPlus, Radio, Share2, Trash2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatTime } from '../../utils/formatters';
import DropdownMenu from '../common/DropdownMenu';

export default function SongRow({ song, index, playlist = null, onAddToPlaylist = null, onRemoveFromPlaylist = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, addToQueue, deleteSong } = usePlayer();
  const { isArtist } = useAuth();
  const { addToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const liked = isLiked(song.id);

  const handleClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlist);
    }
  };

  const handleLike = (e) => {
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
    ...(onRemoveFromPlaylist ? [{
      label: 'Remove from this Playlist',
      danger: true,
      onClick: () => onRemoveFromPlaylist(song.id)
    }] : []),
    {
      label: liked ? 'Remove from Liked' : 'Save to Liked Songs',
      icon: <Heart size={15} color={liked ? 'var(--accent-primary)' : 'currentColor'} />,
      onClick: () => toggleLike(song.id)
    },
    {
      label: 'Copy Link',
      icon: <Share2 size={15} />,
      onClick: () => {
        navigator.clipboard?.writeText(window.location.origin + '/?song=' + song.id);
        addToast('Song link copied', 'info', 2000);
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
    <div 
      className={`song-row ${isCurrent ? 'active' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Track Number / Play Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px' }}>
        {isHovered || isCurrentlyPlaying ? (
          <button 
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)' }}
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentlyPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
        ) : (
          <span style={{ fontSize: '13px', color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
            {index !== undefined ? index + 1 : '•'}
          </span>
        )}
      </div>

      {/* 2. Cover Art + Title + Artist */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '12px' }}>
        <img 
          src={song.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80'} 
          alt={song.title} 
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80'; }}
          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ minWidth: 0 }}>
          <div 
            className="song-row-title"
            style={{ 
              fontWeight: 600, 
              color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {song.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {song.artist}
          </div>
        </div>
      </div>

      {/* 3. Album */}
      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
        {song.album || 'Single'}
      </div>

      {/* 4. Genre / Category */}
      <div style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {song.genre}
      </div>

      {/* 5. Like Heart Button */}
      <div onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleLike}
          className="btn-icon" 
          style={{ width: '28px', height: '28px', color: liked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={16} fill={liked ? 'var(--accent-primary)' : 'none'} />
        </button>
      </div>

      {/* 6. Duration & Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {formatTime(song.duration)}
        </span>
        <DropdownMenu items={menuItems} />
      </div>
    </div>
  );
}
