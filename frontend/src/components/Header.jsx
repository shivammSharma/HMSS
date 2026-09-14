import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '0 32px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
    }}>
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* User Profile Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 4px 4px',
          borderRadius: 20, background: 'var(--bg)', border: '1px solid var(--border)'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.75rem', color: '#ffffff'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', paddingRight: 4 }}>
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
