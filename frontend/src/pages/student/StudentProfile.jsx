import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, GraduationCap, Briefcase, Award, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { studentService, skillGapService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentProfile = () => {
  const { user, updateLocalProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfileAndRoles = async () => {
    try {
      setLoading(true);
      const [profData, gapData] = await Promise.all([
        studentService.getProfile(),
        skillGapService.getOverview(),
      ]);
      setProfile(profData);
      setAvailableRoles(gapData.available_roles || []);
    } catch (err) {
      console.error('Failed to load profile', err);
      setErrorMsg('Could not fetch student profile from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');
      const updated = await studentService.updateProfile(profile);
      setProfile(updated);
      updateLocalProfile(updated);
      setSuccessMsg('Profile updated successfully in the central registry.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save profile', err);
      setErrorMsg('Failed to update profile. Please verify your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving learner credentials and profile..." />;
  }

  if (!profile) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No student profile linked to this account</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>
              Learner Profile & Skilling Dossier
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Your verified academic, career target, and employment preferences
            </p>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            <CheckCircle2 size={15} /> Verified Learner ID: #{profile.id}
          </span>
        </div>

        {successMsg && (
          <div style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            border: '1px solid #BBF7D0'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            border: '1px solid #FECACA'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  value={profile.full_name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email (Readonly from user account) */}
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={profile.phone || ''}
                onChange={handleChange}
              />
            </div>

            {/* Target Role Selector */}
            <div className="form-group">
              <label className="form-label">Target Industry Role *</label>
              <select
                name="target_role"
                className="form-control"
                value={profile.target_role || 'Junior Data Analyst'}
                onChange={handleChange}
              >
                {availableRoles.length > 0 ? (
                  availableRoles.map((r) => (
                    <option key={r.title} value={r.title}>
                      {r.title} ({r.category})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Junior Data Analyst">Junior Data Analyst</option>
                    <option value="Full Stack Web Developer">Full Stack Web Developer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="Cloud DevOps Associate">Cloud DevOps Associate</option>
                  </>
                )}
              </select>
            </div>

            {/* Education */}
            <div className="form-group">
              <label className="form-label">Highest Education</label>
              <input
                type="text"
                name="education"
                className="form-control"
                value={profile.education || ''}
                onChange={handleChange}
              />
            </div>

            {/* College / Institute */}
            <div className="form-group">
              <label className="form-label">College / Skilling Institute</label>
              <input
                type="text"
                name="college_institute"
                className="form-control"
                value={profile.college_institute || ''}
                onChange={handleChange}
              />
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">District *</label>
              <input
                type="text"
                name="district"
                className="form-control"
                value={profile.district || ''}
                onChange={handleChange}
                required
              />
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={profile.state || ''}
                onChange={handleChange}
                required
              />
            </div>

            {/* Experience Years */}
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="experience_years"
                className="form-control"
                value={profile.experience_years ?? 0}
                onChange={handleChange}
              />
            </div>

            {/* Employment Status */}
            <div className="form-group">
              <label className="form-label">Current Employment Status</label>
              <select
                name="employment_status"
                className="form-control"
                value={profile.employment_status || 'Seeking Opportunities'}
                onChange={handleChange}
              >
                <option value="Seeking Opportunities">Seeking Opportunities</option>
                <option value="Not Employed">Not Employed</option>
                <option value="In Training">Currently in Training</option>
                <option value="Employed / Placed">Employed / Placed</option>
                <option value="Self-Employed / Freelancer">Self-Employed / Freelancer</option>
              </select>
            </div>
          </div>

          {/* Career Interests */}
          <div className="form-group">
            <label className="form-label">Career Interests (Comma-separated)</label>
            <input
              type="text"
              name="career_interests"
              className="form-control"
              value={profile.career_interests || ''}
              onChange={handleChange}
              placeholder="e.g. Data Analytics, Python Development, Machine Learning"
            />
          </div>

          {/* Certifications */}
          <div className="form-group">
            <label className="form-label">Certifications & Accreditations</label>
            <input
              type="text"
              name="certifications"
              className="form-control"
              value={profile.certifications || ''}
              onChange={handleChange}
              placeholder="e.g. National Apprenticeship Certificate, AWS Certified Cloud Practitioner"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea
              name="bio"
              className="form-control"
              value={profile.bio || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
