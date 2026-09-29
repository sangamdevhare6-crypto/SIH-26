import React from 'react';
import { Check, Clock, Calendar, AlertTriangle } from 'lucide-react';

const ApplicationTimeline = ({ status, appliedDate, interviewDate, remarks }) => {
  const stages = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
  const isRejected = status === 'Rejected';

  const getStageIndex = (st) => {
    switch (st) {
      case 'Applied': return 0;
      case 'Shortlisted': return 1;
      case 'Interview': return 2;
      case 'Selected': return 3;
      case 'Rejected': return 1; // Show rejection indicator
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(status);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '1.25rem' }}>
        {stages.map((stage, idx) => {
          const isPassed = idx < currentIndex || (idx === currentIndex && status === 'Selected');
          const isCurrent = idx === currentIndex && !isRejected;

          return (
            <React.Fragment key={stage}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isPassed ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--surface-alt)',
                  color: (isPassed || isCurrent) ? '#FFFFFF' : 'var(--text-muted)',
                  border: `2px solid ${isPassed ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--border)'}`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  boxShadow: isCurrent ? '0 0 0 3px rgba(37, 99, 235, 0.2)' : 'none'
                }}>
                  {isPassed ? <Check size={16} /> : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: (isCurrent || isPassed) ? 700 : 500,
                  color: isPassed ? 'var(--success)' : isCurrent ? 'var(--navy)' : 'var(--text-muted)',
                  marginTop: '0.35rem',
                  textAlign: 'center'
                }}>
                  {stage}
                </span>
              </div>

              {idx < stages.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '3px',
                  backgroundColor: idx < currentIndex ? 'var(--success)' : 'var(--border)',
                  margin: '0 4px',
                  transform: 'translateY(-10px)'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isRejected && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <AlertTriangle size={16} />
          <strong>Application Not Selected:</strong> Candidate profile was evaluated.
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        {appliedDate && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} /> Applied on: {appliedDate}
          </span>
        )}
        {interviewDate && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 600 }}>
            <Calendar size={14} /> Interview Scheduled: {interviewDate}
          </span>
        )}
        {remarks && (
          <span style={{ width: '100%', fontStyle: 'italic', background: 'var(--surface-alt)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
            Notes: "{remarks}"
          </span>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
