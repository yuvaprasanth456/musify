import React, { useState, useRef } from 'react';
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
  Image as ImageIcon,
  CheckCircle,
  FileAudio,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePlayer } from '../context/PlayerContext';
import { uploadToStorage, saveSongToSupabase } from '../services/supabaseStorage';
import { formatNumber, formatDate } from '../utils/formatters';
import Modal from '../components/common/Modal';
import api from '../services/api';

export default function ArtistDashboardPage() {
  const { user, isArtist } = useAuth();
  const { addToast } = useToast();
  const { playSong, songs, addUploadedSong } = usePlayer();

  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Find tracks belonging to this artist
  const [tracks, setTracks] = useState(() => {
    return songs.filter(s => (s.artist || s.artistName || '').toLowerCase() === (user?.name || '').toLowerCase());
  });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');

  // Upload Form State
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState(user?.name || '');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Tamil Hits');
  const [language, setLanguage] = useState('Tamil');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [audioFileSize, setAudioFileSize] = useState('');
  const [calculatedDuration, setCalculatedDuration] = useState(240);

  // Stats calculation
  const totalPlays = tracks.reduce((acc, t) => acc + (t.playCount || 0), 0);
  const totalLikes = Math.floor(totalPlays * 0.08);

  const handleCoverChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCoverFile(file);
      try {
        const url = URL.createObjectURL(file);
        setCoverPreview(url);
      } catch (err) {
        console.warn('Cover preview err:', err);
      }
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
      
      // Format file size
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setAudioFileSize(`${sizeMb} MB`);

      // Detect song title from filename if title is empty
      if (!title) {
        const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(rawName.charAt(0).toUpperCase() + rawName.slice(1));
      }

      // Calculate audio duration
      try {
        const audio = new Audio();
        const objUrl = URL.createObjectURL(file);
        audio.src = objUrl;
        audio.addEventListener('loadedmetadata', () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setCalculatedDuration(Math.round(audio.duration));
          }
          URL.revokeObjectURL(objUrl);
        });
        audio.addEventListener('error', () => {
          URL.revokeObjectURL(objUrl);
        });
      } catch (err) {
        console.warn('Audio metadata detect notice:', err);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please provide a song title', 'error');
      return;
    }

    setUploading(true);
    setUploadStage('Processing artwork and audio...');
    addToast('Starting upload process...', 'info', 2000);

    try {
      // 1. Upload Cover Artwork
      let finalCoverUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
      if (coverFile) {
        setUploadStage('Uploading cover image to Supabase...');
        finalCoverUrl = await uploadToStorage(coverFile, 'covers');
      }

      // 2. Upload Audio Master
      let finalAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      if (audioFile) {
        setUploadStage('Uploading audio master to Supabase...');
        finalAudioUrl = await uploadToStorage(audioFile, 'music');
      }

      setUploadStage('Saving song metadata to Supabase...');

      const newSong = {
        id: Date.now(),
        title: title.trim(),
        artist: (artistName || user?.name || 'Artist').trim(),
        artistName: (artistName || user?.name || 'Artist').trim(),
        album: album.trim() || 'Single',
        albumTitle: album.trim() || 'Single',
        genre,
        language,
        coverUrl: finalCoverUrl,
        audioUrl: finalAudioUrl,
        duration: calculatedDuration || 240,
        playCount: 1,
        releaseDate,
        description,
        uploaderEmail: user?.email || '',
        lyrics: `[00:10.00] ${title} - Released on MUSIFY!`
      };

      // 3. Save track record to Supabase PostgreSQL table
      const savedSb = await saveSongToSupabase(newSong);
      if (savedSb && savedSb.id) {
        newSong.id = savedSb.id;
      }

      // 4. Also sync to Spring Boot Backend API
      try {
        const backendPayload = { ...newSong };
        delete backendPayload.id;
        const beRes = await api.post('/artist/songs', backendPayload);
        if (beRes?.data?.id) {
          newSong.id = beRes.data.id;
        }
      } catch (err) {
        console.warn('Backend sync notice (offline or local fallback):', err.message);
      }

      // 5. Add to live player context & local cache
      addUploadedSong(newSong);
      setTracks(prev => [newSong, ...prev]);

      addToast(`🎉 "${newSong.title}" is now uploaded & live on MUSIFY!`, 'success', 4000);

      // Reset form
      setTitle('');
      setAlbum('');
      setDescription('');
      setCoverFile(null);
      setCoverPreview('');
      setAudioFile(null);
      setAudioFileName('');
      setAudioFileSize('');
      setUploadStage('');
      setIsUploadOpen(false);

      // Play the newly uploaded song right away
      playSong(newSong);
    } catch (err) {
      console.error('Upload error:', err);
      addToast('Upload encountered an issue, please try again', 'error');
    } finally {
      setUploading(false);
      setUploadStage('');
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '36px' }}>
        <div className="card-glass" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Tracks</span>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(29, 185, 84, 0.15)', color: 'var(--accent-primary)' }}>
              <Music size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{tracks.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Live in MUSIFY catalog
          </div>
        </div>

        <div className="card-glass" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Streams</span>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Play size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatNumber(totalPlays)}</div>
          <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
            +18.4% this month
          </div>
        </div>

        <div className="card-glass" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Recorded Likes</span>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <Heart size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatNumber(totalLikes)}</div>
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
            Audience appreciation
          </div>
        </div>

        <div className="card-glass" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Monthly Listeners</span>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>15.2M</div>
          <div style={{ fontSize: '12px', color: '#a855f7', marginTop: '4px' }}>
            Rank #2 in South Asia
          </div>
        </div>
      </div>

      {/* Track Management Table */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Your Tracks & Discography</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Manage your releases, inspect audio streams, and monitor playback performance.
            </p>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="btn-secondary"
          >
            <Upload size={16} />
            <span>Upload New</span>
          </button>
        </div>

        <div className="card-glass" style={{ padding: '8px', overflow: 'hidden' }}>
          {/* Table Header */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '48px 4fr 3fr 2fr 2fr 60px',
              padding: '12px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ textAlign: 'center' }}>Play</span>
            <span>Title</span>
            <span>Album</span>
            <span>Streams</span>
            <span>Release Date</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            {tracks.map((track) => (
              <div 
                key={track.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 4fr 3fr 2fr 2fr 60px',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background-color var(--transition-fast)'
                }}
                className="song-row"
              >
                <button 
                  onClick={() => playSong(track, tracks)}
                  className="btn-icon"
                  style={{ width: '36px', height: '36px', color: 'var(--accent-primary)' }}
                  title="Play track"
                >
                  <Play size={18} fill="var(--accent-primary)" />
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
      <Modal isOpen={isUploadOpen} onClose={() => !uploading && setIsUploadOpen(false)} title="Upload Track to Supabase Studio" maxWidth="640px">
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
                  border: coverPreview ? '1px solid var(--accent-primary)' : '1px dashed var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <ImageIcon size={28} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Choose cover image</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>JPG, PNG up to 10MB</span>
                  </>
                )}
                <input 
                  ref={coverInputRef}
                  type="file" 
                  accept="image/*, .jpg, .jpeg, .png, .webp" 
                  onChange={handleCoverChange} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>

            {/* Audio File Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Master Audio File *
              </label>
              <div 
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: audioFileName ? '1px solid var(--accent-primary)' : '1px dashed var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '12px',
                  textAlign: 'center'
                }}
                onClick={() => audioInputRef.current?.click()}
              >
                {audioFileName ? (
                  <>
                    <CheckCircle size={28} color="var(--accent-primary)" />
                    <span style={{ fontSize: '12px', color: '#fff', marginTop: '6px', fontWeight: 600, wordBreak: 'break-all' }}>
                      {audioFileName}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-primary)' }}>
                      Ready ({audioFileSize})
                    </span>
                  </>
                ) : (
                  <>
                    <Music size={28} color="var(--accent-primary)" />
                    <span style={{ fontSize: '12px', color: '#fff', marginTop: '6px', fontWeight: 600 }}>
                      Choose Audio File
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MP3, WAV, FLAC, M4A up to 50MB</span>
                  </>
                )}
                <input 
                  ref={audioInputRef}
                  type="file" 
                  accept="audio/*, .mp3, .wav, .m4a, .aac, .ogg, .flac" 
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

          {uploading && (
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(29, 185, 84, 0.12)', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{uploadStage || 'Uploading track...'}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              <Upload size={16} />
              <span>{uploading ? 'Publishing...' : 'Publish Track'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
