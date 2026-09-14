import React from 'react';

const StatCard = ({ title, value, subtext, trend, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue:   { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
    green:  { bg: '#ecfdf5', border: '#a7f3d0', text: '#059669' },
    yellow: { bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
    purple: { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed' },
    red:    { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: theme.bg,
            border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={18} color={theme.text} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value ?? '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          {subtext && <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{subtext}</span>}
          {trend && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.text, background: theme.bg, padding: '2px 6px', borderRadius: 4 }}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
