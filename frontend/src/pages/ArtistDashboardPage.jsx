import React, { useState } from 'react';
import { 
  Mic2, 
  Upload, 
  Music, 
  Play, 
  Heart, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePlayer } from '../context/PlayerContext';
import { SAMPLE_SONGS } from '../utils/sampleData';
import { uploadToStorage } from '../services/supabaseStorage';
import { formatNumber, formatDate } from '../utils/formatters';
import Modal from '../components/common/Modal';
import api from '../services/api';

export default function ArtistDashboardPage() {
  const { user, isArtist, quickLogin } = useAuth();
  const { addToast } = useToast();
  const { playSong } = usePlayer();

  const [tracks, setTracks] = useState(() => SAMPLE_SONGS.slice(0, 5));
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState(user?.name || 'Anirudh Ravichander');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Tamil Hits');
  const [language, setLanguage] = useState('Tamil');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');

  // Stats calculation
  const totalPlays = tracks.reduce((acc, t) => acc + (t.playCount || 0), 0);
  const totalLikes = Math.floor(totalPlays * 0.08);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please provide a song title', 'error');
      return;
    }

    setUploading(true);
    addToast('Uploading track assets to Supabase Storage...', 'info', 2500);

    try {
      let finalCoverUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
      if (coverFile) {
        finalCoverUrl = await uploadToStorage(coverFile, 'covers');
      }

      let finalAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      if (audioFile) {
        finalAudioUrl = await uploadToStorage(audioFile, 'music');
      }

      const newSong = {
        id: Date.now(),
        title: title.trim(),
        artist: artistName.trim(),
        album: album.trim() || 'Single',
        genre,
        language,
        coverUrl: finalCoverUrl,
        audioUrl: finalAudioUrl,
        duration: 245,
        playCount: 1,
        releaseDate,
        description,
        lyrics: `[00:10.00] ${title} - Newly released on MUSIFY!`
      };

      try {
        await api.post('/artist/songs', newSong);
      } catch {
        // Fallback for offline/demo
      }

      setTracks(prev => [newSong, ...prev]);
      addToast(`"${newSong.title}" is now live on MUSIFY!`, 'success');

      // Reset form
      setTitle('');
      setAlbum('');
      setCoverFile(null);
      setCoverPreview('');
      setAudioFile(null);
      setAudioFileName('');
      setIsUploadOpen(false);
    } catch (err) {
      console.error(err);
      addToast('Upload failed, please check file format', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTrack = (trackId) => {
    if (window.confirm('Are you sure you want to remove this track from streaming?')) {
      setTracks(prev => prev.filter(t => t.id !== trackId));
      addToast('Track deleted', 'info');
    }
  };

  return (
    <div style={{ paddingBottom: '36px' }}>
      {/* Top Banner */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #102619 0%, #0d1a12 60%, var(--bg-surface) 100%)',
          border: '1px solid rgba(29, 185, 84, 0.28)',
          marginBottom: '32px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              MUSIFY ARTIST STUDIO
            </span>
          </div>
          <h1 className="heading-hero" style={{ fontSize: '2.5rem', marginBottom: '6px' }}>
            {user?.role === 'ARTIST' ? `Welcome back, ${user.name}` : 'Artist Management Studio'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Publish your original music, upload high-definition audio, and track stream metrics in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!isArtist && (
            <button 
              onClick={() => quickLogin('ARTIST')}
              className="btn-secondary"
            >
              Demo as Artist
            </button>
          )}

          <button 
            onClick={() => setIsUploadOpen(true)}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <Upload size={18} />
            <span>Upload New Song</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Tracks</span>
            <Music size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{tracks.length}</div>
        </div>

        <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Plays</span>
            <TrendingUp size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatNumber(totalPlays)}</div>
        </div>

        <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Likes Recorded</span>
            <Heart size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatNumber(totalLikes)}</div>
        </div>

        <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Followers</span>
            <Users size={18} color="#eab308" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1.2M</div>
        </div>
      </div>

      {/* Uploaded Tracks Table */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 className="heading-section">Your Published Tracks ({tracks.length})</h2>
        </div>

        <div 
          style={{
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 3fr 2fr 1.5fr 1fr 100px',
              padding: '12px 20px',
              backgroundColor: 'var(--bg-surface-elevated)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}
          >
            <span></span>
            <span>Title</span>
            <span>Album</span>
            <span>Plays</span>
            <span>Released</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tracks.map((track) => (
              <div 
                key={track.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 3fr 2fr 1.5fr 1fr 100px',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '13.5px'
                }}
              >
                <button 
                  onClick={() => playSong(track, tracks)}
                  className="btn-icon"
                  style={{ width: '30px', height: '30px', color: 'var(--accent-primary)' }}
                  title="Play track"
                >
                  <Play size={16} fill="currentColor" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '12px' }}>
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {track.genre} • {track.language || 'Tamil'}
                    </div>
                  </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
                  {track.album || 'Single'}
                </div>

                <div style={{ fontWeight: 600 }}>
                  {formatNumber(track.playCount)}
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  {formatDate(track.releaseDate)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  <button 
                    onClick={() => handleDeleteTrack(track.id)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: '#ef4444' }}
                    title="Delete track"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Song Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Track to Supabase Storage" maxWidth="640px">
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Audio & Image Dropzones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Cover Art Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Album Cover Artwork
              </label>
              <div 
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px dashed var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => document.getElementById('coverInput').click()}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <ImageIcon size={28} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Choose cover image</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>JPG, PNG up to 5MB</span>
                  </>
                )}
                <input 
                  id="coverInput" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverChange} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>

            {/* Audio File Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Master Audio File
              </label>
              <div 
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px dashed var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'center'
                }}
                onClick={() => document.getElementById('audioInput').click()}
              >
                <Music size={28} color="var(--accent-primary)" />
                <span style={{ fontSize: '12px', color: '#fff', marginTop: '6px', fontWeight: 600, wordBreak: 'break-all' }}>
                  {audioFileName || 'Choose MP3 / WAV file'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>High-res 320kbps recommended</span>
                <input 
                  id="audioInput" 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleAudioChange} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Song Title *
              </label>
              <input 
                type="text" 
                placeholder="e.g. Kaatru Veliyidai Beats" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Artist Name *
              </label>
              <input 
                type="text" 
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Album
              </label>
              <input 
                type="text" 
                placeholder="Single / Album Name" 
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Genre
              </label>
              <select 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Tamil Hits">Tamil Hits</option>
                <option value="Tamil Trending">Tamil Trending</option>
                <option value="Tamil Melody">Tamil Melody</option>
                <option value="Tamil Love">Tamil Love</option>
                <option value="Tamil Chill">Tamil Chill</option>
                <option value="Tamil Party">Tamil Party</option>
                <option value="Tamil Indie">Tamil Indie</option>
                <option value="Tamil Classical">Tamil Classical</option>
                <option value="Tamil Folk">Tamil Folk</option>
                <option value="Tamil Devotional">Tamil Devotional</option>
                <option value="Workout">Workout</option>
                <option value="Focus">Focus</option>
                <option value="Night Vibes">Night Vibes</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Language
              </label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Instrumental">Instrumental</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Description / Liner Notes
            </label>
            <textarea 
              placeholder="Tell listeners about the inspiration behind this track" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              <Upload size={16} />
              <span>{uploading ? 'Uploading to Supabase...' : 'Publish Track'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
