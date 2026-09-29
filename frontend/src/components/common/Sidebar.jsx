import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Award,
  Compass,
  BookOpen,
  Briefcase,
  FileText,
  TrendingUp,
  LogOut,
  GraduationCap,
  Users,
  Building2,
  BarChart3,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  X,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/student/profile', icon: User, label: 'My Profile' },
          { to: '/student/skills', icon: Award, label: 'My Skills' },
          { to: '/student/assessment', icon: Compass, label: 'Skill Assessment' },
          { to: '/student/skill-gap', icon: Layers, label: 'Skill Gap Analysis' },
          { to: '/student/courses', icon: BookOpen, label: 'Recommended Courses' },
          { to: '/student/jobs', icon: Briefcase, label: 'Recommended Jobs' },
          { to: '/student/applications', icon: FileText, label: 'Applications' },
          { to: '/student/career-growth', icon: TrendingUp, label: 'Career Growth' },
        ];
      case 'institute':
        return [
          { to: '/institute/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/institute/courses', icon: BookOpen, label: 'Manage Courses' },
          { to: '/institute/learners', icon: Users, label: 'Enrolled Learners' },
          { to: '/institute/impact', icon: BarChart3, label: 'Training Impact' },
        ];
      case 'employer':
        return [
          { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/employer/jobs', icon: Briefcase, label: 'Manage Jobs' },
          { to: '/employer/applications', icon: FileText, label: 'Applications' },
          { to: '/employer/candidates', icon: Users, label: 'Candidate Matching' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'National Dashboard' },
          { to: '/admin/impact', icon: TrendingUp, label: 'Skilling Impact' },
          { to: '/admin/industry-demand', icon: BarChart3, label: 'Industry Demand' },
          { to: '/admin/reports', icon: FileSpreadsheet, label: 'Reports & Export' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadge = () => {
    switch (role) {
      case 'student': return { text: 'Student / Learner', bg: 'var(--primary-light)', color: 'var(--primary)' };
      case 'institute': return { text: 'Training Institute', bg: 'var(--indigo-light)', color: 'var(--indigo)' };
      case 'employer': return { text: 'Enterprise Employer', bg: 'var(--warning-light)', color: '#B45309' };
      case 'admin': return { text: 'Government / Admin', bg: 'var(--success-light)', color: 'var(--success)' };
      default: return { text: 'User', bg: 'var(--surface-alt)', color: 'var(--text-muted)' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: 'var(--navy)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        transition: 'transform var(--transition-normal)',
        boxShadow: 'var(--shadow-lg)',
        ...(isMobileOpen ? {
          position: 'fixed',
          left: 0,
          transform: 'translateX(0)',
        } : {
          '@media (max-width: 1024px)': {
            position: 'fixed',
            left: 0,
            transform: 'translateX(-100%)',
          }
        })
      }}>
        {/* Brand & Logo */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--navy-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <GraduationCap size={22} color="#FFFFFF" />
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                  KaushalSetu <span style={{ color: '#60A5FA' }}>AI</span>
                </span>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.04em' }}>
                  SIH26135 · Team Dominator
                </div>
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{ color: '#94A3B8', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Card */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--navy-border)', backgroundColor: '#131D31' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}>
              {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: '0.2rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: roleBadge.bg,
                color: roleBadge.color
              }}>
                {roleBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem 0.6rem' }}>
            Menu
          </div>
          <ul style={{ listStyle: 'none' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} style={{ marginBottom: '0.3rem' }}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      transition: 'all var(--transition-fast)',
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--navy-border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: '#F87171',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
