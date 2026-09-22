import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Radio, Music2, Upload } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import CategorySection from '../components/cards/CategorySection';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';

export default function HomePage() {
  const { playSong, recentlyPlayed, songs } = usePlayer();
  const { isArtist } = useAuth();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  // Group songs dynamically from database
  const songList = Array.isArray(songs) ? songs : [];
  const trendingSongs = songList.filter(s => s && ((s.playCount || 0) > 2000000 || s.playCount === 1));
  const tamilHits = songList.filter(s => s && s.genre === 'Tamil Hits');
  const tamilTrending = songList.filter(s => s && s.genre === 'Tamil Trending');
  const tamilMelody = songList.filter(s => s && s.genre === 'Tamil Melody');
  const tamilLove = songList.filter(s => s && s.genre === 'Tamil Love');
  const tamilChill = songList.filter(s => s && s.genre === 'Tamil Chill');
  const tamilParty = songList.filter(s => s && s.genre === 'Tamil Party');
  const tamilIndie = songList.filter(s => s && s.genre === 'Tamil Indie');
  const tamilClassical = songList.filter(s => s && s.genre === 'Tamil Classical');
  const tamilFolk = songList.filter(s => s && s.genre === 'Tamil Folk');
  const tamilDevotional = songList.filter(s => s && s.genre === 'Tamil Devotional');

  // Hero Featured Track (if any song exists)
  const heroSong = songList.length > 0 ? songList[0] : null;

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
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {heroSong.coverUrl ? (
              <img
                src={heroSong.coverUrl}
                alt={heroSong.title}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Music2 size={64} color="var(--accent-primary)" />
            )}
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
            gap: '32px'
          }}
        >
          <div style={{ maxWidth: '580px', zIndex: 2 }}>
            <h1 className="heading-hero" style={{ marginBottom: '12px' }}>
              {isArtist ? 'Artist Studio' : 'Welcome to MUSIFY'}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              {isArtist 
                ? 'Upload your original music in the Artist Studio to start streaming worldwide.'
                : 'Stream millions of songs, explore curated playlists, and discover new sounds every day.'}
            </p>
            {isArtist ? (
              <Link
                to="/artist/dashboard"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <Upload size={16} />
                <span>Upload Your First Song</span>
              </Link>
            ) : (
              <Link
                to="/search"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <Music2 size={16} />
                <span>Explore Music</span>
              </Link>
            )}
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

      {/* Dynamic Sections from Database */}
      {tamilLove.length > 0 && (
        <CategorySection
          title="Tamil Love"
          subtitle="Heartfelt romance and acoustic melodies"
          songs={tamilLove}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilHits.length > 0 && (
        <CategorySection
          title="Tamil Hits"
          subtitle="Latest releases"
          songs={tamilHits}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilTrending.length > 0 && (
        <CategorySection
          title="Tamil Trending"
          subtitle="Trending now on MUSIFY"
          songs={tamilTrending}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilMelody.length > 0 && (
        <CategorySection
          title="Tamil Melody"
          subtitle="Melodious releases"
          songs={tamilMelody}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilChill.length > 0 && (
        <CategorySection
          title="Tamil Chill"
          subtitle="Chill vibes"
          songs={tamilChill}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilParty.length > 0 && (
        <CategorySection
          title="Tamil Party"
          subtitle="Party vibes"
          songs={tamilParty}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {tamilIndie.length > 0 && (
        <CategorySection
          title="Tamil Indie"
          subtitle="Independent releases"
          songs={tamilIndie}
          onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
        />
      )}

      {/* Fallback to all database songs if no category matches */}
      {songs.length > 0 &&
        tamilLove.length === 0 &&
        tamilHits.length === 0 &&
        tamilTrending.length === 0 && (
          <CategorySection
            title="All Uploaded Songs"
            subtitle="Stream music on MUSIFY"
            songs={songs}
            onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
          />
        )}

      <AddToPlaylistModal
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
        song={selectedSongForPlaylist}
      />
    </div>

  );
}
