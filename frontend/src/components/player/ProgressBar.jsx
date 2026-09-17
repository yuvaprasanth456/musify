import React, { useRef, useState } from 'react';
import { formatTime } from '../../utils/formatters';

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    calculateSeek(e);
  };

  const calculateSeek = (e) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      calculateSeek(e);
    }
    if (barRef.current && duration > 0) {
      const rect = barRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      setHoverTime(ratio * duration);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '580px' }}>
      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>
        {formatTime(currentTime)}
      </span>

      <div 
        ref={barRef}
        className="progress-bar-wrapper"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setHoverTime(null)}
        title={hoverTime !== null ? formatTime(hoverTime) : ''}
      >
        <div 
          className="progress-bar-fill" 
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} 
        />
        <div 
          className="progress-bar-thumb" 
          style={{ left: `${Math.min(100, Math.max(0, percentage))}%` }} 
        />
      </div>

      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', width: '36px' }}>
        {formatTime(duration)}
      </span>
    </div>
  );
}
