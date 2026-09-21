import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  Mic2, 
  LogIn 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../utils/formatters';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header 
      className="glass-panel"
      style={{
        height: 'var(--header-height)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      {/* Left: Navigation Buttons & Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => navigate(-1)}
            className="btn-icon"
            style={{ width: '34px', height: '34px', background: 'rgba(0, 0, 0, 0.4)' }}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => navigate(1)}
            className="btn-icon"
            style={{ width: '34px', height: '34px', background: 'rgba(0, 0, 0, 0.4)' }}
            title="Go forward"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {isHome && (
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginLeft: '8px' }}>
            {getGreeting()}
          </span>
        )}
      </div>

      {/* Right: Quick actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification Icon */}
        <button 
          className="btn-icon" 
          style={{ width: '38px', height: '38px', background: 'rgba(0,0,0,0.3)' }}
          title="What's New"
        >
          <Bell size={18} />
        </button>

        {/* User Profile Pill or Login Button */}
        {isAuthenticated ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 12px 4px 6px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-subtle)',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
            >
              <img 
                src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt={user.name} 
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {user.name}
              </span>
              <span 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  backgroundColor: user.role === 'ARTIST' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                  color: user.role === 'ARTIST' ? '#000' : '#fff'
                }}
              >
                {user.role}
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px',
                  padding: '6px',
                  zIndex: 50,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>

                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/artist/dashboard'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Mic2 size={16} color="var(--accent-primary)" />
                  <span>Artist Studio</span>
                </button>

                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                <div style={{ margin: '4px 0', borderBottom: '1px solid var(--border-subtle)' }} />

                <button 
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#ef4444',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{ padding: '6px 18px', fontSize: '13px' }}
            >
              <LogIn size={15} />
              <span>Log in</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
