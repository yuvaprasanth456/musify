import React, { useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export default function LyricsView({ lyricsText }) {
  const { currentTime, seek } = usePlayer();

  const parsedLyrics = useMemo(() => {
    if (!lyricsText) return [];
    const lines = lyricsText.split('\n');
    return lines.map(line => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const time = minutes * 60 + seconds;
        const text = match[4].trim();
        return { time, text };
      }
      return { time: null, text: line.trim() };
    }).filter(item => item.text.length > 0);
  }, [lyricsText]);

  // Find active line
  let activeIndex = -1;
  for (let i = parsedLyrics.length - 1; i >= 0; i--) {
    if (parsedLyrics[i].time !== null && currentTime >= parsedLyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  if (parsedLyrics.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
        Lyrics aren't available for this track yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 0' }}>
      {parsedLyrics.map((line, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            onClick={() => line.time !== null && seek(line.time)}
            style={{
              fontSize: isActive ? '1.85rem' : '1.35rem',
              fontWeight: 700,
              color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              transformOrigin: 'left center',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: line.time !== null ? 'pointer' : 'default',
              userSelect: 'text'
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}
