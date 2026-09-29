import React from 'react';
import { Menu, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ onToggleMobile }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Overview';
    if (path.includes('profile')) return 'Learner Profile';
    if (path.includes('skills')) return 'Skill Competency Matrix';
    if (path.includes('assessment')) return 'Interactive Skill Assessment';
    if (path.includes('skill-gap')) return 'Dynamic Skill Gap Analysis';
    if (path.includes('courses')) return 'Targeted Upskilling & Courses';
    if (path.includes('jobs')) return 'AI Job Recommendation Engine';
    if (path.includes('applications')) return 'Application Outcomes & Tracking';
    if (path.includes('career-growth')) return 'Career Growth & Milestones';
    if (path.includes('learners')) return 'Enrolled Learners Roster';
    if (path.includes('impact')) return 'Skilling Impact & Outcomes';
    if (path.includes('candidates')) return 'Candidate Skill Matching';
    if (path.includes('industry-demand')) return 'Industry Skill Demand Intelligence';
    if (path.includes('reports')) return 'Government Reports & CSV Export';
    return 'KaushalSetu AI Platform';
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'student': return { text: 'Student', class: 'badge-primary' };
      case 'institute': return { text: 'Institute', class: 'badge-indigo' };
      case 'employer': return { text: 'Employer', class: 'badge-warning' };
      case 'admin': return { text: 'Government', class: 'badge-success' };
      default: return { text: 'Portal', class: 'badge-secondary' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobile}
          style={{
            display: 'none',
            '@media (max-width: 1024px)': { display: 'flex' },
            padding: '0.4rem',
            color: 'var(--navy)',
            borderRadius: 'var(--radius-sm)'
          }}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            <span>KaushalSetu AI</span>
            <ChevronRight size={12} />
            <span style={{ textTransform: 'capitalize' }}>{role}</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginTop: '0.1rem' }}>
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right: Quick Role Badge, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
        <span className={`badge ${badge.class}`} style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
          <ShieldCheck size={14} /> {badge.text} Portal
        </span>

        {/* Real-time Notifications Bell */}
        <NotificationDropdown />

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.75rem',
          backgroundColor: 'var(--surface-alt)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.first_name ? `${user.first_name}` : user?.username}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
