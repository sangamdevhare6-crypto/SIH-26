import React from 'react';
import { Briefcase, MapPin, IndianRupee, Clock, Check, AlertCircle } from 'lucide-react';

const JobCard = ({
  job,
  onApply,
  onViewDetails,
  hasApplied = false,
  showMatch = true,
}) => {
  const matchPct = job.match_percentage ?? 75;
  const matchingSkills = job.matching_skills || [];
  const missingSkills = job.missing_skills || [];

  const getMatchBadgeClass = (pct) => {
    if (pct >= 85) return 'badge-success';
    if (pct >= 65) return 'badge-primary';
    return 'badge-warning';
  };

  const formatSalary = (min, max) => {
    const minL = (min / 100000).toFixed(1);
    const maxL = (max / 100000).toFixed(1);
    return `₹${minL} - ${maxL} LPA`;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.2rem' }}>
            {job.title}
          </h4>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)' }}>
            {job.company_name || job.employer?.company_name || 'Enterprise Employer'}
          </span>
        </div>

        {showMatch && (
          <span className={`badge ${getMatchBadgeClass(matchPct)}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
            {matchPct}% Match
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={15} style={{ color: 'var(--text-subtle)' }} />
          {job.location || `${job.district}, ${job.state}`}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <IndianRupee size={15} style={{ color: 'var(--text-subtle)' }} />
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Briefcase size={15} style={{ color: 'var(--text-subtle)' }} />
          {job.experience_required} yrs exp
        </span>
      </div>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {job.description}
      </p>

      {/* Skills breakdown */}
      <div style={{ marginBottom: '1.25rem', marginTop: 'auto' }}>
        {matchingSkills.length > 0 && (
          <div style={{ marginBottom: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              <Check size={12} /> Matching:
            </span>
            {matchingSkills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                {typeof skill === 'object' ? skill.name : skill}
              </span>
            ))}
          </div>
        )}

        {missingSkills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              <AlertCircle size={12} /> Missing:
            </span>
            {missingSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                {typeof skill === 'object' ? skill.name : skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
        {onViewDetails && (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onViewDetails(job)}>
            View Details
          </button>
        )}
        {onApply && (
          <button
            className={`btn btn-sm ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1 }}
            disabled={hasApplied}
            onClick={() => onApply(job)}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
