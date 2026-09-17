import React, { useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export default function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }) {
  const barRef = useRef(null);

  const displayVolume = isMuted ? 0 : volume;

  const handleClick = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange(ratio);
  };

  const getIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button 
        onClick={onToggleMute}
        className="btn-icon"
        style={{ width: '32px', height: '32px', color: isMuted ? '#ef4444' : 'var(--text-secondary)' }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getIcon()}
      </button>

      <div 
        ref={barRef}
        onClick={handleClick}
        style={{
          width: '90px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          borderRadius: '2px',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${displayVolume * 100}%`,
            backgroundColor: 'var(--text-primary)',
            borderRadius: '2px'
          }}
        />
      </div>
    </div>
  );
}
