import React, { useState } from 'react';
import { Play, Sparkles, Flame, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { SAMPLE_SONGS } from '../utils/sampleData';
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

  // Hero Featured Track
  const heroSong = songs[0] || SAMPLE_SONGS[0];

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Dynamic Hero Banner */}
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
            Experience the acoustic resonance of Rahman’s iconic Tamil anthem reimagined in pristine high fidelity audio.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={() => playSong(heroSong, SAMPLE_SONGS)}
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

      {/* 1. Recently Played */}
      {recentlyPlayed.length > 0 && (
        <CategorySection 
          title="Recently Played" 
          subtitle="Jump back in where you left off"
          songs={recentlyPlayed} 
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {/* 2. Made For You */}
      <CategorySection 
        title="Made For You" 
        subtitle="Specially tailored to your listening habits"
        songs={[SAMPLE_SONGS[3], SAMPLE_SONGS[4], SAMPLE_SONGS[6], SAMPLE_SONGS[7], SAMPLE_SONGS[9]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 3. Trending Songs */}
      <CategorySection 
        title="Trending Songs 🔥" 
        subtitle="The most streamed tracks worldwide this week"
        songs={trendingSongs.length > 0 ? trendingSongs : SAMPLE_SONGS.slice(0, 6)} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 4. Tamil Hits */}
      <CategorySection 
        title="Tamil Hits" 
        subtitle="Chart-toppers and stadium blockbusters"
        songs={tamilHits} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 5. Tamil Trending */}
      <CategorySection 
        title="Tamil Trending" 
        subtitle="Viral hits ruling the airwaves right now"
        songs={tamilTrending.length > 0 ? tamilTrending : [SAMPLE_SONGS[2], SAMPLE_SONGS[8]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 6. Tamil Melody */}
      <CategorySection 
        title="Tamil Melody" 
        subtitle="Lush orchestrations and soothing harmonies"
        songs={tamilMelody} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 7. Tamil Love */}
      <CategorySection 
        title="Tamil Love" 
        subtitle="Heartfelt romance and timeless ballads"
        songs={tamilLove} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 8. Tamil Chill */}
      <CategorySection 
        title="Tamil Chill" 
        subtitle="Lo-fi beats, gentle rain, and acoustic textures"
        songs={tamilChill.length > 0 ? tamilChill : [SAMPLE_SONGS[7], SAMPLE_SONGS[14]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 9. Tamil Party */}
      <CategorySection 
        title="Tamil Party" 
        subtitle="High-voltage club mixes and bass-heavy anthems"
        songs={tamilParty.length > 0 ? tamilParty : [SAMPLE_SONGS[8], SAMPLE_SONGS[11]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 10. Tamil Indie */}
      <CategorySection 
        title="Tamil Indie" 
        subtitle="Fresh underground voices and genre-bending sounds"
        songs={tamilIndie.length > 0 ? tamilIndie : [SAMPLE_SONGS[9]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 11. Tamil Classical */}
      <CategorySection 
        title="Tamil Classical" 
        subtitle="Ragas of eternity, Carnatic brilliance, and fusion"
        songs={tamilClassical.length > 0 ? tamilClassical : [SAMPLE_SONGS[10]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 12. Tamil Folk */}
      <CategorySection 
        title="Tamil Folk" 
        subtitle="Earthly rural rhythms and energetic dappankuthu"
        songs={tamilFolk.length > 0 ? tamilFolk : [SAMPLE_SONGS[11]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 13. Tamil Devotional */}
      <CategorySection 
        title="Tamil Devotional" 
        subtitle="Sacred chants, meditative peace, and spiritual hymns"
        songs={tamilDevotional.length > 0 ? tamilDevotional : [SAMPLE_SONGS[12]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 14. Workout */}
      <CategorySection 
        title="Workout" 
        subtitle="High BPM electronic energy to power your session"
        songs={workoutSongs.length > 0 ? workoutSongs : [SAMPLE_SONGS[13]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 15. Focus */}
      <CategorySection 
        title="Focus" 
        subtitle="Zero-distraction ambient soundscapes for deep work"
        songs={focusSongs.length > 0 ? focusSongs : [SAMPLE_SONGS[14]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 16. Night Vibes */}
      <CategorySection 
        title="Night Vibes" 
        subtitle="Late-night synth reflections and midnight drives"
        songs={nightVibes.length > 0 ? nightVibes : [SAMPLE_SONGS[15]]} 
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      <AddToPlaylistModal 
        isOpen={!!selectedSongForPlaylist} 
        onClose={() => setSelectedSongForPlaylist(null)} 
        song={selectedSongForPlaylist} 
      />
    </div>
  );
}
