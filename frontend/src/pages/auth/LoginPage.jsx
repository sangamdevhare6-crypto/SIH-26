import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Users, School, Building, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    switch (userRole) {
      case 'student': navigate('/student/dashboard', { replace: true }); break;
      case 'institute': navigate('/institute/dashboard', { replace: true }); break;
      case 'employer': navigate('/employer/dashboard', { replace: true }); break;
      case 'admin': navigate('/admin/dashboard', { replace: true }); break;
      default: navigate('/', { replace: true }); break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email/username and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await login(email, password);
      redirectAfterLogin(res.user.role);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = async (roleKey) => {
    try {
      setError('');
      setLoading(true);
      const res = await loginAs(roleKey);
      redirectAfterLogin(res.user.role);
    } catch (err) {
      setError('Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '2rem 1.5rem',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 40%)'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <div style={{
          padding: '2rem 2rem 1.25rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
          backgroundColor: '#FFFFFF'
        }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(37,99,235,0.3)'
            }}>
              <GraduationCap size={24} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
              KaushalSetu <span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>
            Sign In to Your Account
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Access skilling data, gap diagnostics & job recommendations
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              border: '1px solid #FECACA'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
                <Mail size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Demo: Demo@12345</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Lock size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '0.75rem' }}>
              ⚡ 1-Click SIH Evaluation Logins
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.5rem 0.6rem' }}
                disabled={loading}
              >
                <Users size={15} color="var(--primary)" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('institute')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.5rem 0.6rem' }}
                disabled={loading}
              >
                <School size={15} color="var(--indigo)" /> Institute
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('employer')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.5rem 0.6rem' }}
                disabled={loading}
              >
                <Building size={15} color="#B45309" /> Employer
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.5rem 0.6rem' }}
                disabled={loading}
              >
                <Shield size={15} color="var(--success)" /> Government
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
