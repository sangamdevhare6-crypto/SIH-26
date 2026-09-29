import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Plus, Compass, CheckCircle2, Search, Filter, AlertCircle } from 'lucide-react';
import { studentService, skillCatalogService } from '../../services/api';
import SkillProgress from '../../components/common/SkillProgress';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentSkills = () => {
  const [studentSkills, setStudentSkills] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add skill modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [newProficiency, setNewProficiency] = useState(60);
  const [addLoading, setAddLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsData, catalogData] = await Promise.all([
        studentService.getSkills(),
        skillCatalogService.getSkills(),
      ]);
      setStudentSkills(Array.isArray(skillsData) ? skillsData : []);
      setCatalogSkills(Array.isArray(catalogData) ? catalogData : []);
    } catch (err) {
      console.error('Failed to load skills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) {
      setErrorMsg('Please select a skill from the catalog.');
      return;
    }

    try {
      setAddLoading(true);
      setErrorMsg('');
      await studentService.addSkill({
        skill_id: selectedSkillId,
        proficiency_percentage: Number(newProficiency),
      });
      setIsAddModalOpen(false);
      setSelectedSkillId('');
      fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to add skill.');
    } finally {
      setAddLoading(false);
    }
  };

  const categories = ['All', 'Programming', 'Database', 'Data & Analytics', 'Web Development', 'Cloud', 'AI/ML'];

  const filteredSkills = studentSkills.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.skill?.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = s.skill?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter catalog skills that student doesn't already have
  const existingSkillIds = new Set(studentSkills.map((s) => s.skill?.id));
  const availableCatalog = catalogSkills.filter((c) => !existingSkillIds.has(c.id));

  if (loading) {
    return <LoadingSpinner message="Loading your verified skills portfolio..." />;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            My Verified Skill Matrix
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Diagnostic-verified competencies and self-reported proficiencies
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Custom Skill
          </button>
          <Link to="/student/assessment" className="btn btn-primary btn-sm">
            <Compass size={16} /> Take Assessment Test
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
              placeholder="Filter by skill name (e.g. Python, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills List Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Award size={18} style={{ color: 'var(--primary)' }} /> Assessed Skills ({filteredSkills.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Green checkmark denotes standardized assessment verification
          </span>
        </div>

        {filteredSkills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No skills found in this category. Click "Add Custom Skill" or "Take Assessment".
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem' }} className="skills-grid">
            {filteredSkills.map((stSkill) => (
              <div
                key={stSkill.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-alt)'
                }}
              >
                <SkillProgress
                  name={stSkill.skill?.name}
                  proficiency={stSkill.proficiency_percentage}
                  category={stSkill.skill?.category}
                  assessmentScore={stSkill.assessment_score}
                  verified={stSkill.verified}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Last assessed: {new Date(stSkill.last_assessed_date).toLocaleDateString()}</span>
                  <Link
                    to="/student/assessment"
                    style={{ fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    Test Again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Skill to Profile"
      >
        {errorMsg && (
          <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAddSkill}>
          <div className="form-group">
            <label className="form-label">Select Skill from Catalog</label>
            <select
              className="form-control"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              required
            >
              <option value="">-- Choose a standard skill --</option>
              {availableCatalog.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Estimated Self-Proficiency</label>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{newProficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={newProficiency}
              onChange={(e) => setNewProficiency(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Self-reported skills will be flagged as unverified until you complete a diagnostic assessment.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentSkills;
