import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary', // 'primary', 'indigo', 'success', 'warning', 'danger'
  trend,
  trendDirection = 'up',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'indigo':
        return { bg: 'var(--indigo-light)', color: 'var(--indigo)', border: '#C7D2FE' };
      case 'success':
        return { bg: 'var(--success-light)', color: 'var(--success)', border: '#BBF7D0' };
      case 'warning':
        return { bg: 'var(--warning-light)', color: '#D97706', border: '#FDE68A' };
      case 'danger':
        return { bg: 'var(--danger-light)', color: 'var(--danger)', border: '#FECACA' };
      case 'navy':
        return { bg: '#E2E8F0', color: 'var(--navy)', border: '#CBD5E1' };
      default:
        return { bg: 'var(--primary-light)', color: 'var(--primary)', border: '#BFDBFE' };
    }
  };

  const v = getVariantStyles();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy)', marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: v.bg,
            color: v.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${v.border}`
          }}>
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem' }}>
          {trend && (
            <span style={{
              fontWeight: 700,
              color: trendDirection === 'up' ? 'var(--success)' : 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
