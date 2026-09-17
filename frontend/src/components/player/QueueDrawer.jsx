import React from 'react';
import { X, Trash2, Play, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatters';

export default function QueueDrawer() {
  const { 
    isQueueOpen, 
    setIsQueueOpen, 
    queue, 
    queueIndex, 
    currentSong, 
    playSong, 
    removeFromQueue, 
    clearQueue 
  } = usePlayer();

  if (!isQueueOpen) return null;

  const upcomingSongs = queue.slice(queueIndex + 1);

  return (
    <div 
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 'var(--player-height)',
        width: '360px',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease-out'
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Play Queue</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {upcomingSongs.length > 0 && (
            <button 
              onClick={clearQueue}
              className="btn-icon"
              title="Clear upcoming queue"
              style={{ width: '32px', height: '32px' }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button 
            onClick={() => setIsQueueOpen(false)}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Now Playing */}
        {currentSong && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
              Now Playing
            </span>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--accent-subtle-border)'
              }}
            >
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title} 
                style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} 
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentSong.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {currentSong.artist}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Next From: Queue ({upcomingSongs.length})
          </span>

          {upcomingSongs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 10px', color: 'var(--text-muted)' }}>
              No more songs in queue. Add songs from your library or search.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {upcomingSongs.map((song, idx) => {
                const actualIndex = queueIndex + 1 + idx;
                return (
                  <div 
                    key={`${song.id}-${actualIndex}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <button 
                      onClick={() => playSong(song)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Play now"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }} 
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {song.artist}
                      </div>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {formatTime(song.duration)}
                    </span>
                    <button 
                      onClick={() => removeFromQueue(actualIndex)}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }}
                      title="Remove from queue"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
