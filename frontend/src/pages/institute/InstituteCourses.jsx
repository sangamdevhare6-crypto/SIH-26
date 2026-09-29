import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Clock, Award, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { courseService, skillCatalogService } from '../../services/api';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InstituteCourses = () => {
  const [courses, setCourses] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add course modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Data & Analytics',
    provider: 'National Skilling Centre',
    duration_weeks: 8,
    level: 'Intermediate',
    price: 0,
    description: '',
    course_url: 'https://skillindia.gov.in',
    skills: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCoursesAndSkills = async () => {
    try {
      setLoading(true);
      const [cData, sData] = await Promise.all([
        courseService.getCourses(),
        skillCatalogService.getSkills(),
      ]);
      setCourses(Array.isArray(cData) ? cData : []);
      setCatalogSkills(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndSkills();
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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await courseService.createCourse({
        title: formData.title,
        category: formData.category,
        provider: formData.provider,
        duration_weeks: parseInt(formData.duration_weeks),
        level: formData.level,
        price: parseFloat(formData.price || 0),
        description: formData.description,
        course_url: formData.course_url,
        skills: formData.skills,
      });

      setSuccessMsg(`Course "${formData.title}" created successfully and published to student portals!`);
      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'Data & Analytics',
        provider: 'National Skilling Centre',
        duration_weeks: 8,
        level: 'Intermediate',
        price: 0,
        description: '',
        course_url: 'https://skillindia.gov.in',
        skills: [],
      });
      fetchCoursesAndSkills();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to publish course.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading courses and vocational training modules..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            Course Management & Curriculum Directory
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Publish accredited courses and tie them directly to target role competencies
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add New Course
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

      {/* Courses Grid */}
      <div className="grid-3">
        {courses.map((c) => (
          <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                {c.category}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)' }}>
                {c.price === 0 ? 'Free (Govt)' : `₹${c.price}`}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>
              {c.title}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              By {c.provider}
            </span>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> {c.duration_weeks} wks
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Award size={14} /> {c.level}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              {(c.skills || c.course_skills || []).slice(0, 3).map((s, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                  {typeof s === 'object' ? (s.name || s.skill?.name) : s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish New Training Course"
        maxWidth="640px"
      >
        <form onSubmit={handleCreateCourse}>
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Master Power BI & Advanced Business Analytics"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Database Engineering">Database Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Weeks)</label>
              <input
                type="number"
                min="1"
                max="52"
                name="duration_weeks"
                className="form-control"
                value={formData.duration_weeks}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Level</label>
              <select
                name="level"
                className="form-control"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tuition Fee (₹)</label>
              <input
                type="number"
                min="0"
                name="price"
                className="form-control"
                placeholder="0 for Government Free"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Outline what skills and practical projects the learner will complete..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Skills Covered Selection */}
          <div className="form-group">
            <label className="form-label">Skills Taught in this Course</label>
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
              Selected skills will trigger automated recommendations for students with matching skill gaps.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstituteCourses;
