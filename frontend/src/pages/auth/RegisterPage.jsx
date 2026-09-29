import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2, School, Building, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.email || !formData.password) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await register({
        username: formData.email,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        confirm_password: formData.confirm_password,
        phone: formData.phone,
        role: formData.role,
      });

      // Redirect to appropriate dashboard
      switch (res.user.role) {
        case 'student': navigate('/student/dashboard', { replace: true }); break;
        case 'institute': navigate('/institute/dashboard', { replace: true }); break;
        case 'employer': navigate('/employer/dashboard', { replace: true }); break;
        case 'admin': navigate('/admin/dashboard', { replace: true }); break;
        default: navigate('/', { replace: true }); break;
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData && typeof respData === 'object') {
        // Parse all DRF error shapes into a single readable string
        const extractMessage = (data) => {
          // non_field_errors first
          if (data.non_field_errors) {
            const v = data.non_field_errors;
            return Array.isArray(v) ? v[0] : String(v);
          }
          // field-level errors
          const keys = Object.keys(data);
          if (keys.length > 0) {
            const key = keys[0];
            const val = data[key];
            if (Array.isArray(val)) return `${key}: ${val[0]}`;
            if (typeof val === 'object') return extractMessage(val);
            return String(val);
          }
          return 'Registration failed. Please check your data and try again.';
        };
        setError(extractMessage(respData));
      } else if (typeof respData === 'string') {
        setError(respData);
      } else {
        setError('Registration failed. Unable to reach the server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { key: 'student', title: 'Learner / Student', desc: 'Take assessments, analyze gaps, get job matches', icon: GraduationCap },
    { key: 'institute', title: 'Training Institute', desc: 'Publish courses & track student completion rates', icon: School },
    { key: 'employer', title: 'Hiring Employer', desc: 'Post industry jobs & discover verified matching talent', icon: Building },
    { key: 'admin', title: 'Government / Admin', desc: 'National analytics & employment outcome tracking', icon: Shield },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '2.5rem 1.5rem',
      backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(79, 70, 229, 0.05) 0%, transparent 40%)'
    }}>
      <div style={{
        maxWidth: '560px',
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
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Join the smart digital skilling and employment network
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
            {/* Role Selection Cards */}
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem' }}>
                {roleOptions.map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.key;
                  return (
                    <div
                      key={r.key}
                      onClick={() => setFormData({ ...formData, role: r.key })}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <Icon size={16} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--navy)' }}>
                          {r.title}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  placeholder="Aarav"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  placeholder="Sharma"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="aarav@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
