import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Play, UserCheck, UserPlus } from 'lucide-react';
import { SAMPLE_ARTISTS } from '../utils/sampleData';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { formatNumber } from '../utils/formatters';
import SongRow from '../components/cards/SongRow';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const { playSong, songs } = usePlayer();
  const { addToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  const artistId = parseInt(id, 10);
  const artist = SAMPLE_ARTISTS.find(a => a.id === artistId) || SAMPLE_ARTISTS[0];

  const allSongs = songs || [];
  const artistSongs = allSongs.filter(s => (s.artist || s.artistName || '').toLowerCase().includes(artist.name.toLowerCase().split(' ')[0]));
  const popularSongs = artistSongs;

  const handleFollowToggle = () => {
    setIsFollowing(prev => {
      const next = !prev;
      addToast(next ? `Following ${artist.name}` : `Unfollowed ${artist.name}`, 'info');
      return next;
    });
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Artist Hero Header with ambient backdrop */}
      <div 
        style={{
          position: 'relative',
          padding: '40px 32px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.22) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--accent-subtle-border)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '32px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <img 
          src={artist.imageUrl} 
          alt={artist.name} 
          style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle2 size={18} color="var(--accent-primary-dark)" fill="var(--accent-subtle)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified Artist
            </span>
          </div>

          <h1 className="heading-hero" style={{ fontSize: '3.4rem', margin: '4px 0 12px' }}>
            {artist.name}
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '32px' }}>
        <button 
          onClick={() => popularSongs.length > 0 && playSong(popularSongs[0], popularSongs)}
          className="floating-play-btn"
          style={{ position: 'static', opacity: 1, transform: 'none', width: '54px', height: '54px' }}
          aria-label="Play artist"
        >
          <Play size={24} fill="#181510" style={{ marginLeft: '3px' }} />
        </button>

        <button 
          onClick={handleFollowToggle}
          className={isFollowing ? 'btn-secondary' : 'btn-primary'}
          style={{ padding: '8px 22px', fontSize: '13.5px' }}
        >
          {isFollowing ? (
            <>
              <UserCheck size={16} />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>

      {/* Popular Songs */}
      <section style={{ marginBottom: '36px' }}>
        <h2 className="heading-section" style={{ marginBottom: '16px' }}>Popular</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {popularSongs.map((song, idx) => (
            <SongRow 
              key={song.id} 
              song={song} 
              index={idx} 
              playlist={popularSongs} 
            />
          ))}
        </div>
      </section>

      {/* Artist Bio */}
      <section 
        style={{ 
          padding: '24px', 
          borderRadius: 'var(--radius-lg)', 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-subtle)' 
        }}
      >
        <h3 className="heading-section" style={{ marginBottom: '10px' }}>About</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '14.5px', maxWidth: '780px' }}>
          {artist.bio}
        </p>
      </section>
    </div>
  );
}
