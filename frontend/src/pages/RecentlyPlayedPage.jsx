import React, { useState } from 'react';
import { Clock, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import SongRow from '../components/cards/SongRow';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';

export default function RecentlyPlayedPage() {
  const { recentlyPlayed, playSong } = usePlayer();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  return (
    <div style={{ paddingBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Clock size={28} color="var(--accent-primary)" />
        <h1 className="heading-hero" style={{ fontSize: '2.2rem' }}>Recently Played</h1>
      </div>

      {recentlyPlayed.length > 0 ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <button 
              onClick={() => playSong(recentlyPlayed[0], recentlyPlayed)}
              className="btn-primary"
            >
              <Play size={18} fill="#000" />
              <span>Play All</span>
            </button>
          </div>

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
            {recentlyPlayed.map((song, idx) => (
              <SongRow 
                key={`${song.id}-${idx}`}
                song={song}
                index={idx}
                playlist={recentlyPlayed}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>No recently played tracks yet. Start listening to any track to build your history!</p>
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
