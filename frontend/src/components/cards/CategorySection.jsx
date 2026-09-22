import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MusicCard from './MusicCard';

export default function CategorySection({ title, subtitle = '', songs = [], onAddToPlaylist = null }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!songs || songs.length === 0) return null;

  return (
    <section style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h3 className="heading-section">{title}</h3>
          {subtitle && <p className="text-meta" style={{ marginTop: '2px' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => scroll('left')} 
            className="btn-icon" 
            style={{ width: '32px', height: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="btn-icon" 
            style={{ width: '32px', height: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="carousel-track">
        {songs.map(song => (
          <MusicCard 
            key={song.id} 
            song={song} 
            onAddToPlaylist={onAddToPlaylist}
          />
        ))}
      </div>
    </section>
  );
}
