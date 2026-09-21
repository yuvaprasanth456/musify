import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Radio, Music2, Upload } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import CategorySection from '../components/cards/CategorySection';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';

export default function HomePage() {
  const { playSong, recentlyPlayed, songs } = usePlayer();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  // Group songs dynamically
  const trendingSongs = songs.filter(s => (s.playCount || 0) > 2000000 || s.playCount === 1);
  const tamilHits = songs.filter(s => s.genre === 'Tamil Hits');
  const tamilTrending = songs.filter(s => s.genre === 'Tamil Trending');
  const tamilMelody = songs.filter(s => s.genre === 'Tamil Melody');
  const tamilLove = songs.filter(s => s.genre === 'Tamil Love');
  const tamilChill = songs.filter(s => s.genre === 'Tamil Chill');
  const tamilParty = songs.filter(s => s.genre === 'Tamil Party');
  const tamilIndie = songs.filter(s => s.genre === 'Tamil Indie');
  const tamilClassical = songs.filter(s => s.genre === 'Tamil Classical');
  const tamilFolk = songs.filter(s => s.genre === 'Tamil Folk');
  const tamilDevotional = songs.filter(s => s.genre === 'Tamil Devotional');
  const workoutSongs = songs.filter(s => s.genre === 'Workout');
  const focusSongs = songs.filter(s => s.genre === 'Focus');
  const nightVibes = songs.filter(s => s.genre === 'Night Vibes');

  // Hero Featured Track (if any song exists)
  const heroSong = songs[0] || null;

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Dynamic Hero Banner */}
      {heroSong ? (
        <div 
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '36px',
            background: 'linear-gradient(135deg, #18281e 0%, #0d1a12 50%, #08080a 100%)',
            border: '1px solid rgba(29, 185, 84, 0.25)',
            padding: '36px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ maxWidth: '580px', zIndex: 2 }}>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 12px', 
                borderRadius: 'var(--radius-pill)', 
                backgroundColor: 'rgba(29, 185, 84, 0.2)', 
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '14px'
              }}
            >
              <Sparkles size={14} />
              <span>FEATURED SPOTLIGHT</span>
            </div>
            <h1 className="heading-hero" style={{ marginBottom: '12px' }}>
              {heroSong.title}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              {heroSong.artist || heroSong.artistName} • {heroSong.album || heroSong.albumTitle || 'Single'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button 
                onClick={() => playSong(heroSong, songs)}
                className="btn-primary"
                style={{ padding: '12px 30px', fontSize: '15px' }}
              >
                <Play size={18} fill="#000" />
                <span>Play Now</span>
              </button>
              <button 
                onClick={() => setSelectedSongForPlaylist(heroSong)}
                className="btn-secondary"
              >
                <Radio size={16} />
                <span>Add to Playlist</span>
              </button>
            </div>
          </div>

          {/* Hero Artwork */}
          <div 
            style={{ 
              position: 'relative', 
              width: '210px', 
              height: '210px', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
              flexShrink: 0
            }}
          >
            <img 
              src={heroSong.coverUrl} 
              alt={heroSong.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      ) : (
        <div 
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '36px',
            background: 'linear-gradient(135deg, #18281e 0%, #0d1a12 50%, #08080a 100%)',
            border: '1px solid rgba(29, 185, 84, 0.25)',
            padding: '36px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ maxWidth: '580px', zIndex: 2 }}>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 12px', 
                borderRadius: 'var(--radius-pill)', 
                backgroundColor: 'rgba(29, 185, 84, 0.2)', 
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '14px'
              }}
            >
              <Sparkles size={14} />
              <span>MUSIFY STREAMING</span>
            </div>
            <h1 className="heading-hero" style={{ marginBottom: '12px' }}>
              Welcome to MUSIFY
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              Stream pristine high-fidelity audio or upload your original tracks directly to the global catalog.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link 
                to="/search"
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: '14px', textDecoration: 'none' }}
              >
                <Music2 size={16} />
                <span>Explore Catalog</span>
              </Link>
              <Link 
                to="/artist/dashboard"
                className="btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <Upload size={16} />
                <span>Upload Song</span>
              </Link>
            </div>
          </div>

          <div 
            style={{ 
              width: '180px', 
              height: '180px', 
              borderRadius: 'var(--radius-lg)', 
              background: 'rgba(29, 185, 84, 0.1)',
              border: '1px solid rgba(29, 185, 84, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Music2 size={64} color="var(--accent-primary)" />
          </div>
        </div>
      )}

      {/* 1. Recently Played */}
      {recentlyPlayed.length > 0 && (
        <CategorySection 
          title="Recently Played" 
          subtitle="Jump back in where you left off"
          songs={recentlyPlayed} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {/* Dynamic Sections */}
      {trendingSongs.length > 0 && (
        <CategorySection 
          title="Trending Songs 🔥" 
          subtitle="The most streamed tracks worldwide this week"
          songs={trendingSongs} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilHits.length > 0 && (
        <CategorySection 
          title="Tamil Hits" 
          subtitle="Chart-toppers and stadium blockbusters"
          songs={tamilHits} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilTrending.length > 0 && (
        <CategorySection 
          title="Tamil Trending" 
          subtitle="Viral hits ruling the airwaves right now"
          songs={tamilTrending} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilMelody.length > 0 && (
        <CategorySection 
          title="Tamil Melody" 
          subtitle="Lush orchestrations and soothing harmonies"
          songs={tamilMelody} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilLove.length > 0 && (
        <CategorySection 
          title="Tamil Love" 
          subtitle="Heartfelt romance and timeless ballads"
          songs={tamilLove} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilChill.length > 0 && (
        <CategorySection 
          title="Tamil Chill" 
          subtitle="Lo-fi beats, gentle rain, and acoustic textures"
          songs={tamilChill} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilParty.length > 0 && (
        <CategorySection 
          title="Tamil Party" 
          subtitle="High-voltage club mixes and bass-heavy anthems"
          songs={tamilParty} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilIndie.length > 0 && (
        <CategorySection 
          title="Tamil Indie" 
          subtitle="Fresh underground voices and genre-bending sounds"
          songs={tamilIndie} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilClassical.length > 0 && (
        <CategorySection 
          title="Tamil Classical" 
          subtitle="Ragas of eternity, Carnatic brilliance, and fusion"
          songs={tamilClassical} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilFolk.length > 0 && (
        <CategorySection 
          title="Tamil Folk" 
          subtitle="Earthly rural rhythms and energetic dappankuthu"
          songs={tamilFolk} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilDevotional.length > 0 && (
        <CategorySection 
          title="Tamil Devotional" 
          subtitle="Sacred chants, meditative peace, and spiritual hymns"
          songs={tamilDevotional} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {workoutSongs.length > 0 && (
        <CategorySection 
          title="Workout" 
          subtitle="High BPM electronic energy to power your session"
          songs={workoutSongs} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {focusSongs.length > 0 && (
        <CategorySection 
          title="Focus" 
          subtitle="Zero-distraction ambient soundscapes for deep work"
          songs={focusSongs} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {nightVibes.length > 0 && (
        <CategorySection 
          title="Night Vibes" 
          subtitle="Late-night synth reflections and midnight drives"
          songs={nightVibes} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {/* Empty State when no songs exist */}
      {songs.length === 0 && recentlyPlayed.length === 0 && (
        <div 
          className="glass-card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            marginTop: '20px'
          }}
        >
          <Music2 size={44} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No songs in the catalog yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px' }}>
            All demo tracks have been removed. Head to the Artist Studio to upload your own tracks!
          </p>
          <Link 
            to="/artist/dashboard" 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <Upload size={16} />
            <span>Upload New Song</span>
          </Link>
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
