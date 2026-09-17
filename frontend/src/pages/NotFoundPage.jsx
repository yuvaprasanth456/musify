import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div 
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <Music2 size={32} color="var(--accent-primary)" />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 28px' }}>
        We can't seem to find the page you are looking for. Try searching or go back to home.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary">
        <Home size={16} />
        <span>Return Home</span>
      </button>
    </div>
  );
}
