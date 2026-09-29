import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';

const SkillProgress = ({
  name,
  proficiency = 50,
  category,
  assessmentScore,
  verified = false,
  showDetails = true,
}) => {
  const getColor = (pct) => {
    if (pct >= 75) return 'var(--success)';
    if (pct >= 50) return 'var(--primary)';
    if (pct >= 35) return 'var(--warning)';
    return 'var(--danger)';
  };

  const color = getColor(proficiency);

  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.92rem' }}>{name}</span>
          {verified && (
            <span title="Verified by formal assessment" style={{ color: 'var(--success)', display: 'inline-flex' }}>
              <CheckCircle2 size={16} />
            </span>
          )}
          {category && (
            <span className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
              {category}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {showDetails && assessmentScore > 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Award size={13} style={{ color: 'var(--indigo)' }} /> Test: {assessmentScore}%
            </span>
          )}
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: color, minWidth: '40px', textAlign: 'right' }}>
            {proficiency}%
          </span>
        </div>
      </div>

      <div style={{
        height: '8px',
        width: '100%',
        backgroundColor: 'var(--surface-alt)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, proficiency))}%`,
            backgroundColor: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </div>
  );
};

export default SkillProgress;
