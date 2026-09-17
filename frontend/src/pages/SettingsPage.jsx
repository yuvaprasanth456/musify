import React, { useState } from 'react';
import { Settings, Shield, Volume2, Moon, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();

  const [audioQuality, setAudioQuality] = useState('320');
  const [autoplay, setAutoplay] = useState(true);
  const [crossfade, setCrossfade] = useState(false);

  const handleSave = () => {
    addToast('Preferences saved successfully', 'success');
  };

  return (
    <div style={{ paddingBottom: '40px', maxWidth: '780px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Settings size={28} color="var(--accent-primary)" />
        <h1 className="heading-hero" style={{ fontSize: '2.2rem' }}>Settings</h1>
      </div>

      {/* Account Info */}
      <section 
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Account & Profile</h3>
        </div>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt={user.name} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user.email}</div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(29, 185, 84, 0.2)', color: 'var(--accent-primary)' }}>
                    {user.role} ACCOUNT
                  </span>
                </div>
              </div>
            </div>

            <button onClick={logout} className="btn-secondary" style={{ color: '#ef4444' }}>
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>You are currently browsing as a guest.</p>
        )}
      </section>

      {/* Audio Quality & Streaming */}
      <section 
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Audio Streaming Quality</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: '160', title: 'Normal (160 kbit/s)', desc: 'Efficient data usage' },
            { id: '320', title: 'High Fidelity (320 kbit/s)', desc: 'Best balance of clarity and speed' },
            { id: 'lossless', title: 'Studio Master Lossless', desc: 'FLAC 24-bit studio precision' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => { setAudioQuality(item.id); handleSave(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                border: audioQuality === item.id ? '1px solid var(--accent-primary)' : '1px solid transparent'
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              {audioQuality === item.id && <Check size={18} color="var(--accent-primary)" />}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Autoplay similar songs</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Keep the music going when your queue ends</div>
          </div>
          <input 
            type="checkbox" 
            checked={autoplay} 
            onChange={(e) => { setAutoplay(e.target.checked); handleSave(); }}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Crossfade tracks (5s)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smooth transition between consecutive songs</div>
          </div>
          <input 
            type="checkbox" 
            checked={crossfade} 
            onChange={(e) => { setCrossfade(e.target.checked); handleSave(); }}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
          />
        </div>
      </section>

      {/* Visual Identity & Dark Theme */}
      <section 
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Moon size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Appearance</h3>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          MUSIFY is locked to Dark Cinema Mode with Deep Charcoal & Emerald Glow for maximum acoustic immersion.
        </p>
      </section>
    </div>
  );
}
