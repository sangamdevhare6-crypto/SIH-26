import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, MapPin, IndianRupee, Users, CheckCircle2, Clock } from 'lucide-react';
import { jobService, skillCatalogService } from '../../services/api';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post job modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering & Technology',
    location: 'Pune, Maharashtra',
    district: 'Pune',
    state: 'Maharashtra',
    salary_min: 600000,
    salary_max: 1000000,
    experience_required: 1.5,
    vacancies: 3,
    job_type: 'Full-Time',
    description: '',
    skills: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobsAndSkills = async () => {
    try {
      setLoading(true);
      const [jData, sData] = await Promise.all([
        jobService.getMyJobs().catch(() => jobService.getJobs()),
        skillCatalogService.getSkills(),
      ]);
      setJobs(Array.isArray(jData) ? jData : []);
      setCatalogSkills(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndSkills();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSkill = (skillId) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skillId);
      const updated = exists ? prev.skills.filter((id) => id !== skillId) : [...prev.skills, skillId];
      return { ...prev, skills: updated };
    });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await jobService.createJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        district: formData.district,
        state: formData.state,
        salary_min: parseInt(formData.salary_min),
        salary_max: parseInt(formData.salary_max),
        experience_required: parseFloat(formData.experience_required),
        vacancies: parseInt(formData.vacancies),
        job_type: formData.job_type,
        description: formData.description,
        skills: formData.skills,
      });

      setSuccessMsg(`Job opening "${formData.title}" posted successfully! Matching candidates will receive notifications.`);
      setIsModalOpen(false);
      setFormData({
        title: '',
        department: 'Engineering & Technology',
        location: 'Pune, Maharashtra',
        district: 'Pune',
        state: 'Maharashtra',
        salary_min: 600000,
        salary_max: 1000000,
        experience_required: 1.5,
        vacancies: 3,
        job_type: 'Full-Time',
        description: '',
        skills: [],
      });
      fetchJobsAndSkills();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to post job. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving active employer job listings..." />;
  }

  const formatSalary = (min, max) => {
    const minL = (min / 100000).toFixed(1);
    const maxL = (max / 100000).toFixed(1);
    return `₹${minL} - ${maxL} LPA`;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            Corporate Job Requisitions & Openings
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Manage active vacancies and inspect candidate compatibility scores
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Post New Vacancy
        </button>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #BBF7D0'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid-3">
        {jobs.map((j) => (
          <div key={j.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                {j.department || 'Engineering'}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                {j.is_active ? 'Active' : 'Closed'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.2rem' }}>
              {j.title}
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.6rem' }}>
              {j.company_name}
            </span>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {j.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: 'auto' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} /> {j.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <IndianRupee size={14} /> {formatSalary(j.salary_min, j.salary_max)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users size={14} /> {j.vacancies || 2} Vacancies
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <Link to="/employer/applications" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                View Applicants
              </Link>
              <Link to="/employer/candidates" className="btn btn-outline-primary btn-sm" style={{ flex: 1 }}>
                Match Talent
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Industry Job Requisition"
        maxWidth="680px"
      >
        <form onSubmit={handleCreateJob}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Senior Data Analyst (SQL & Power BI)"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department / Sector</label>
              <input
                type="text"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location (City, State) *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">District *</label>
              <input
                type="text"
                name="district"
                className="form-control"
                value={formData.district}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Annual Salary (₹)</label>
              <input
                type="number"
                name="salary_min"
                className="form-control"
                value={formData.salary_min}
                onChange={handleInputChange}
                step="50000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Annual Salary (₹)</label>
              <input
                type="number"
                name="salary_max"
                className="form-control"
                value={formData.salary_max}
                onChange={handleInputChange}
                step="50000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Required (Years)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="experience_required"
                className="form-control"
                value={formData.experience_required}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Vacancies</label>
              <input
                type="number"
                min="1"
                name="vacancies"
                className="form-control"
                value={formData.vacancies}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description & Responsibilities</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Outline project expectations, daily tasks, and required stack..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Required Skills Selection */}
          <div className="form-group">
            <label className="form-label">Required Industry Skills (Weighted for AI Matching)</label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              maxHeight: '120px',
              overflowY: 'auto',
              border: '1px solid var(--border)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-alt)'
            }}>
              {catalogSkills.map((s) => {
                const isSelected = formData.skills.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSkill(s.id)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface)',
                      color: isSelected ? '#FFFFFF' : 'var(--navy)',
                      cursor: 'pointer'
                    }}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Selected competencies are used by the matching engine to calculate candidate match % scores.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job Requisition'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployerJobs;
