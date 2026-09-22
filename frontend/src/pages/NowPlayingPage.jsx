import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Heart, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  ListMusic, 
  Mic2, 
  Info 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from '../components/player/ProgressBar';
import VolumeControl from '../components/player/VolumeControl';
import LyricsView from '../components/lyrics/LyricsView';

export default function NowPlayingPage() {
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

  const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' | 'info'

  if (!currentSong) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>No song is currently playing</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const liked = isLiked(currentSong.id);

  return (
    <div 
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Dynamic Ambient Glow Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Bar with Dismiss */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', zIndex: 1 }}>
        <button 
          onClick={() => navigate(-1)}
          className="btn-icon"
          style={{ width: '40px', height: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
          title="Minimize view"
        >
          <ChevronDown size={24} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            PLAYING FROM ALBUM
          </span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentSong.album || 'Featured Hits'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('lyrics')}
            className={`btn-icon ${activeTab === 'lyrics' ? 'active' : ''}`}
            title="Lyrics view"
          >
            <Mic2 size={19} />
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`btn-icon ${activeTab === 'info' ? 'active' : ''}`}
            title="Song details"
          >
            <Info size={19} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Artwork & Controls, Right Lyrics/Details */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 450px) 1fr',
          gap: '48px',
          zIndex: 1,
          alignItems: 'start'
        }}
      >
        {/* Left: Giant Album Art & Main Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div 
            style={{
              width: '100%',
              maxWidth: '380px',
              paddingBottom: '100%',
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
              marginBottom: '28px'
            }}
          >
            <img 
              src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'} 
              alt={currentSong.title}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'; }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          </div>

          {/* Title, Artist, Heart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginBottom: '20px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentSong.title}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                {currentSong.artist}
              </p>
            </div>
            <button 
              onClick={() => toggleLike(currentSong.id)}
              className="btn-icon" 
              style={{ width: '42px', height: '42px', color: liked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
              aria-label="Like track"
            >
              <Heart size={24} fill={liked ? 'var(--accent-primary)' : 'none'} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', maxWidth: '380px', marginBottom: '16px' }}>
            <ProgressBar 
              currentTime={currentTime} 
              duration={duration} 
              onSeek={seek} 
            />
          </div>

          {/* Transport Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '24px' }}>
            <button 
              onClick={toggleShuffle}
              className="btn-icon"
              style={{ color: isShuffle ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              <Shuffle size={20} />
            </button>

            <button 
              onClick={handlePrevTrack}
              className="btn-icon"
              style={{ color: '#fff' }}
            >
              <SkipBack size={26} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(29, 185, 84, 0.4)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? <Pause size={28} fill="#000" /> : <Play size={28} fill="#000" style={{ marginLeft: '4px' }} />}
            </button>

            <button 
              onClick={handleNextTrack}
              className="btn-icon"
              style={{ color: '#fff' }}
            >
              <SkipForward size={26} fill="currentColor" />
            </button>

            <button 
              onClick={cycleRepeat}
              className="btn-icon"
              style={{ color: repeatMode !== 'off' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <VolumeControl 
              volume={volume} 
              isMuted={isMuted} 
              onVolumeChange={changeVolume} 
              onToggleMute={toggleMute} 
            />
          </div>
        </div>

        {/* Right: Lyrics / Details Tab */}
        <div 
          style={{
            height: '560px',
            overflowY: 'auto',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {activeTab === 'lyrics' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Mic2 size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lyrics</h3>
              </div>
              <LyricsView lyricsText={currentSong.lyrics} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Track Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Title</span>
                <span style={{ fontWeight: 600 }}>{currentSong.title}</span>

                <span style={{ color: 'var(--text-muted)' }}>Artist</span>
                <span style={{ fontWeight: 600 }}>{currentSong.artist}</span>

                <span style={{ color: 'var(--text-muted)' }}>Album</span>
                <span>{currentSong.album || 'Single'}</span>

                <span style={{ color: 'var(--text-muted)' }}>Genre</span>
                <span>{currentSong.genre}</span>

                <span style={{ color: 'var(--text-muted)' }}>Language</span>
                <span>{currentSong.language || 'Tamil'}</span>

                <span style={{ color: 'var(--text-muted)' }}>Audio Format</span>
                <span>Stereo 320kbps MP3</span>

                <span style={{ color: 'var(--text-muted)' }}>Release Date</span>
                <span>{currentSong.releaseDate || '2023'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
