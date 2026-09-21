import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Play, Music, User, Disc, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { SAMPLE_ARTISTS, SAMPLE_PLAYLISTS, CATEGORIES } from '../utils/sampleData';
import SongRow from '../components/cards/SongRow';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';
import api from '../services/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [results, setResults] = useState({ songs: [], artists: [], playlists: [] });
  const [loading, setLoading] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
  const { playSong, songs } = usePlayer();

  // Search logic with 250ms debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], playlists: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase().trim();

      try {
        // Try live backend search endpoint
        const response = await api.get(`/search?q=${encodeURIComponent(q)}`);
        if (response.data && response.data.songs && response.data.songs.length > 0) {
          setResults({
            songs: response.data.songs || [],
            artists: response.data.artists || [],
            playlists: response.data.playlists || []
          });
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to dynamic catalog search
      }

      // Filter catalog
      const matchedSongs = (songs || []).filter(s => 
        (s.title || '').toLowerCase().includes(q) || 
        (s.artist || s.artistName || '').toLowerCase().includes(q) || 
        (s.genre || '').toLowerCase().includes(q) ||
        (s.album || s.albumTitle || '').toLowerCase().includes(q)
      );

      const matchedArtists = SAMPLE_ARTISTS.filter(a => 
        a.name.toLowerCase().includes(q)
      );

      const matchedPlaylists = SAMPLE_PLAYLISTS.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );

      setResults({
        songs: matchedSongs,
        artists: matchedArtists,
        playlists: matchedPlaylists
      });
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const topSong = results.songs[0];

  const filterTabs = ['All', 'Songs', 'Artists', 'Playlists'];

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', maxWidth: '640px', marginBottom: '24px' }}>
        <div 
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex'
          }}
        >
          <SearchIcon size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search songs, artists, albums, playlists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 46px 14px 48px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            fontSize: '15px',
            color: '#ffffff'
          }}
          autoFocus
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* When Query is present, show categorized results */}
      {query ? (
        <div>
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: activeCategory === tab ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                  color: activeCategory === tab ? '#000000' : '#ffffff',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Searching catalog...
            </div>
          ) : results.songs.length === 0 && results.artists.length === 0 && results.playlists.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No results found for "{query}"</h3>
              <p>Please make sure words are spelled correctly or try different keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {/* Top Result + Top Songs Grid */}
              {(activeCategory === 'All' || activeCategory === 'Songs') && topSong && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '24px' }}>
                  {/* Top Result Card */}
                  <div>
                    <h3 className="heading-section" style={{ marginBottom: '14px' }}>Top Result</h3>
                    <div 
                      onClick={() => playSong(topSong, results.songs)}
                      style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-xl)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                    >
                      <img 
                        src={topSong.coverUrl} 
                        alt={topSong.title} 
                        style={{ width: '92px', height: '92px', borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: '16px' }}
                      />
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>{topSong.title}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{topSong.artist}</span>
                        <span>•</span>
                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}>Song</span>
                      </div>

                      <button 
                        className="floating-play-btn"
                        style={{ opacity: 1, transform: 'translateY(0)', bottom: '20px', right: '20px' }}
                        aria-label="Play top result"
                      >
                        <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />
                      </button>
                    </div>
                  </div>

                  {/* Songs List */}
                  <div>
                    <h3 className="heading-section" style={{ marginBottom: '14px' }}>Songs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {results.songs.slice(0, 5).map((song, idx) => (
                        <SongRow 
                          key={song.id} 
                          song={song} 
                          index={idx}
                          playlist={results.songs}
                          onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Artists Section */}
              {(activeCategory === 'All' || activeCategory === 'Artists') && results.artists.length > 0 && (
                <div>
                  <h3 className="heading-section" style={{ marginBottom: '16px' }}>Artists</h3>
                  <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {results.artists.map(artist => (
                      <div 
                        key={artist.id}
                        style={{
                          width: '180px',
                          padding: '16px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <img 
                          src={artist.imageUrl} 
                          alt={artist.name} 
                          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px' }}
                        />
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '4px' }}>
                          {artist.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Artist
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Section */}
              {(activeCategory === 'All' || activeCategory === 'Playlists') && results.playlists.length > 0 && (
                <div>
                  <h3 className="heading-section" style={{ marginBottom: '16px' }}>Playlists</h3>
                  <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {results.playlists.map(pl => (
                      <div 
                        key={pl.id}
                        style={{
                          width: '180px',
                          padding: '14px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-surface)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                      >
                        <img 
                          src={pl.coverUrl} 
                          alt={pl.name} 
                          style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: '10px' }}
                        />
                        <div style={{ fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pl.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          By {pl.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Browse All Categories Grid */
        <div>
          <h2 className="heading-section" style={{ marginBottom: '18px' }}>Browse All Genres & Moods</h2>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '18px'
            }}
          >
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <div
                key={cat.id}
                onClick={() => setQuery(cat.name)}
                style={{
                  height: '120px',
                  borderRadius: 'var(--radius-lg)',
                  background: `linear-gradient(135deg, ${cat.color} 0%, #121214 100%)`,
                  padding: '18px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
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
