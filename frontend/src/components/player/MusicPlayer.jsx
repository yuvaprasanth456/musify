import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  ListMusic, 
  Mic2, 
  Maximize2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

export default function MusicPlayer() {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isQueueOpen,
    isLyricsOpen,
    setIsQueueOpen,
    setIsLyricsOpen,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    seek,
    changeVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    isLiked
  } = usePlayer();

  if (!currentSong) return null;

  const liked = isLiked(currentSong.id);

  return (
    <footer 
      className="player-container"
      style={{
        height: 'var(--player-height)',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) 2fr minmax(200px, 1fr)',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      {/* LEFT SECTION: Song Details & Artwork */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <img 
          src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'} 
          alt={currentSong.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'; }}
          onClick={() => navigate('/now-playing')}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '6px', 
            objectFit: 'cover', 
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ minWidth: 0 }}>
          <div 
            onClick={() => navigate('/now-playing')}
            style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: 'var(--text-primary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {currentSong.title}
          </div>
          <div 
            style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {currentSong.artist}
          </div>
        </div>

        <button 
          onClick={() => toggleLike(currentSong.id)}
          className="btn-icon" 
          style={{ 
            color: liked ? 'var(--accent-primary)' : 'var(--text-muted)', 
            marginLeft: '4px',
            flexShrink: 0
          }}
          aria-label={liked ? 'Unlike song' : 'Like song'}
        >
          <Heart size={18} fill={liked ? 'var(--accent-primary)' : 'none'} />
        </button>
      </div>

      {/* CENTER SECTION: Transport Controls & Scrubber */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Shuffle */}
          <button 
            onClick={toggleShuffle}
            className="btn-icon"
            style={{ 
              color: isShuffle ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative'
            }}
            title={isShuffle ? 'Shuffle is on' : 'Shuffle'}
          >
            <Shuffle size={18} />
            {isShuffle && (
              <span 
                style={{ 
                  position: 'absolute', 
                  bottom: '4px', 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-primary)' 
                }} 
              />
            )}
          </button>

          {/* Previous Track */}
          <button 
            onClick={handlePrevTrack}
            className="btn-icon"
            style={{ color: 'var(--text-primary)' }}
            title="Previous track"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play/Pause Button */}
          <button 
            onClick={togglePlay}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform var(--transition-fast), background var(--transition-fast)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={20} fill="#000" />
            ) : (
              <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Next Track */}
          <button 
            onClick={handleNextTrack}
            className="btn-icon"
            style={{ color: 'var(--text-primary)' }}
            title="Next track"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button 
            onClick={cycleRepeat}
            className="btn-icon"
            style={{ 
              color: repeatMode !== 'off' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative'
            }}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && (
              <span 
                style={{ 
                  position: 'absolute', 
                  bottom: '4px', 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-primary)' 
                }} 
              />
            )}
          </button>
        </div>

        {/* Scrubber Progress Bar */}
        <ProgressBar 
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
      </div>

      {/* RIGHT SECTION: Extra Controls (Queue, Lyrics, Volume, Expand) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        {/* Lyrics Button */}
        <button 
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`btn-icon ${isLyricsOpen ? 'active' : ''}`}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Button */}
        <button 
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`btn-icon ${isQueueOpen ? 'active' : ''}`}
          title="Play queue"
        >
          <ListMusic size={19} />
        </button>

        {/* Volume Control */}
        <VolumeControl 
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={changeVolume}
          onToggleMute={toggleMute}
        />

        {/* Fullscreen Now Playing */}
        <button 
          onClick={() => navigate('/now-playing')}
          className="btn-icon"
          title="Full screen view"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </footer>
  );
}
