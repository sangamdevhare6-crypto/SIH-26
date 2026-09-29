import React from 'react';
import { BookOpen, Clock, Award, Sparkles, ExternalLink } from 'lucide-react';

const CourseCard = ({
  course,
  onEnroll,
  onViewDetails,
  isEnrolled = false,
}) => {
  const skills = course.skills || course.course_skills || [];
  const recommendationReason = course.recommendation_reason || course.why_recommended;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {recommendationReason && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          background: 'linear-gradient(135deg, var(--indigo) 0%, var(--primary) 100%)',
          color: '#FFFFFF',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <Sparkles size={11} /> Recommended for Gap
        </div>
      )}

      <div style={{ marginBottom: '0.75rem', marginTop: recommendationReason ? '0.35rem' : '0' }}>
        <span className="badge badge-secondary" style={{ fontSize: '0.72rem', marginBottom: '0.4rem' }}>
          {course.category || 'Technical Skilling'}
        </span>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>
          {course.title}
        </h4>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          By {course.provider || course.institute?.name || 'Accredited Training Institute'}
        </span>
      </div>

      {recommendationReason && (
        <div style={{
          backgroundColor: 'var(--indigo-light)',
          border: '1px solid #C7D2FE',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 0.75rem',
          fontSize: '0.78rem',
          color: 'var(--indigo)',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.4rem'
        }}>
          <Sparkles size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span><strong>Why:</strong> {recommendationReason}</span>
        </div>
      )}

      <p style={{
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {course.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Clock size={14} style={{ color: 'var(--text-subtle)' }} />
          {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Award size={14} style={{ color: 'var(--text-subtle)' }} />
          {course.level || 'All Levels'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--navy)' }}>
          {course.price === 0 || course.price === '0' || !course.price ? 'Government Funded (Free)' : `₹${course.price}`}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1.25rem', marginTop: 'auto' }}>
        {skills.slice(0, 4).map((s, idx) => {
          const name = typeof s === 'object' ? (s.name || s.skill?.name) : s;
          return (
            <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              {name}
            </span>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
        {onViewDetails && (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onViewDetails(course)}>
            Details
          </button>
        )}
        {onEnroll && (
          <button
            className={`btn btn-sm ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1 }}
            disabled={isEnrolled}
            onClick={() => onEnroll(course)}
          >
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
