import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music2, UserPlus, Headphones, Mic2, Upload, Camera, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { uploadToStorage } from '../services/supabaseStorage';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' | 'ARTIST'
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [customAvatarFile, setCustomAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleCustomAvatar = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    addToast('Uploading avatar to Supabase profiles bucket...', 'info', 2000);

    try {
      const publicUrl = await uploadToStorage(file, 'profiles');
      setSelectedAvatar(publicUrl);
      setCustomAvatarFile(file);
      addToast('Profile picture uploaded to Supabase profiles bucket!', 'success', 2500);
    } catch (err) {
      console.warn('Avatar upload notice:', err);
      // Fallback preview
      setSelectedAvatar(URL.createObjectURL(file));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    let finalAvatarUrl = selectedAvatar;

    // If custom avatar wasn't uploaded yet, upload now
    if (customAvatarFile && !finalAvatarUrl.startsWith('http')) {
      try {
        finalAvatarUrl = await uploadToStorage(customAvatarFile, 'profiles');
      } catch (err) {
        console.warn('Final avatar upload fallback:', err);
      }
    }

    const res = await register(name, email, password, role, finalAvatarUrl);
    if (res.success) {
      navigate(role === 'ARTIST' ? '/artist/dashboard' : '/');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
        padding: '24px'
      }}
    >
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '36px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1db954 0%, #059669 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(29, 185, 84, 0.4)',
              marginBottom: '10px'
            }}
          >
            <Music2 size={26} color="#000" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>Sign up for MUSIFY</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Start streaming millions of songs, playlists, and original audio.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Account Type Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              I want to join as:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('USER')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'USER' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: role === 'USER' ? 'rgba(29, 185, 84, 0.12)' : 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: role === 'USER' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                <Headphones size={16} />
                <span>Music Listener</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ARTIST')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'ARTIST' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: role === 'ARTIST' ? 'rgba(29, 185, 84, 0.12)' : 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: role === 'ARTIST' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                <Mic2 size={16} />
                <span>Artist / Creator</span>
              </button>
            </div>
          </div>

          {/* Profile Image Picker with Supabase Profiles upload */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Profile Avatar:
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Upload size={14} />
                <span>{uploadingAvatar ? 'Uploading to Supabase...' : 'Upload from device'}</span>
              </button>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomAvatar}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Selected Avatar Preview */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'relative',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '2px solid var(--accent-primary)',
                  boxShadow: '0 0 10px rgba(29, 185, 84, 0.4)',
                  flexShrink: 0
                }}
                title="Click to change avatar file"
              >
                <img
                  src={selectedAvatar}
                  alt="Selected avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera size={18} color="#fff" />
                </div>
              </div>

              {/* Sample Quick Avatars */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                {AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => {
                      setSelectedAvatar(url);
                      setCustomAvatarFile(null);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedAvatar === url ? '2.5px solid var(--accent-primary)' : '2px solid transparent',
                      opacity: selectedAvatar === url ? 1 : 0.65,
                      transform: selectedAvatar === url ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all var(--transition-fast)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Full Name or Artist Pseudonym *
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Maya Krishnan"
              required 
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email address *
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@domain.com"
              required 
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Password *
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Min. 6 chars"
                required 
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Repeat password"
                required 
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || uploadingAvatar}
            style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '15px' }}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account in Supabase...' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
