import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Menu, X, Shield, Users, Building, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const { isAuthenticated, role, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (roleKey) => {
    try {
      await loginAs(roleKey);
      if (roleKey === 'student') navigate('/student/dashboard');
      else if (roleKey === 'institute') navigate('/institute/dashboard');
      else if (roleKey === 'employer') navigate('/employer/dashboard');
      else if (roleKey === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      console.error('Quick login failed', err);
    }
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'institute': return '/institute/dashboard';
      case 'employer': return '/employer/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/login';
    }
  };

  return (
    <>
      <div className="gov-ribbon" />
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 6px rgba(37,99,235,0.3)'
            }}>
              <GraduationCap size={24} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
                KaushalSetu <span style={{ color: 'var(--primary)' }}>AI</span>
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
                Smart Skilling & Employment Platform · SIH 2026
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
            <a href="#features" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>How It Works</a>
            <a href="#pathways" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Stakeholders</a>
            <a href="#impact" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>SIH Impact</a>
          </nav>

          {/* Desktop Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
            {/* Quick Demo Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                1-Click Demo Login ▾
              </button>
              {demoDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '210px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border)',
                  padding: '0.4rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <button
                    onClick={() => { setDemoDropdownOpen(false); handleQuickDemo('student'); }}
                    style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Users size={16} color="var(--primary)" /> Student Portal
                  </button>
                  <button
                    onClick={() => { setDemoDropdownOpen(false); handleQuickDemo('institute'); }}
                    style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--indigo-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <School size={16} color="var(--indigo)" /> Institute Portal
                  </button>
                  <button
                    onClick={() => { setDemoDropdownOpen(false); handleQuickDemo('employer'); }}
                    style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--warning-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Building size={16} color="#B45309" /> Employer Portal
                  </button>
                  <button
                    onClick={() => { setDemoDropdownOpen(false); handleQuickDemo('admin'); }}
                    style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--success-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Shield size={16} color="var(--success)" /> Government Portal
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem', color: 'var(--navy)' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pathways" onClick={() => setMobileMenuOpen(false)}>Stakeholders</a>
              <a href="#impact" onClick={() => setMobileMenuOpen(false)}>SIH Impact</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => { setMobileMenuOpen(false); handleQuickDemo('student'); }} className="btn btn-secondary btn-sm">
                Demo as Student
              </button>
              <button onClick={() => { setMobileMenuOpen(false); handleQuickDemo('admin'); }} className="btn btn-secondary btn-sm">
                Demo as Government
              </button>
              <Link to="/login" className="btn btn-primary btn-sm">
                Login / Register
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
