import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Search, CheckCircle2, AlertCircle, MapPin, IndianRupee, Send } from 'lucide-react';
import { jobService, applicationService } from '../../services/api';
import JobCard from '../../components/common/JobCard';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecommendedJobs = () => {
  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Job details modal
  const [jobDetailModal, setJobDetailModal] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [recData, allData, myApps] = await Promise.all([
        jobService.getRecommendedJobs(),
        jobService.getJobs(),
        applicationService.getApplications(),
      ]);
      setRecommended(Array.isArray(recData) ? recData : []);
      setAllJobs(Array.isArray(allData) ? allData : []);
      const applied = new Set((myApps || []).map((app) => app.job));
      setAppliedJobIds(applied);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenApplyModal = (job) => {
    setSelectedJobToApply(job);
    setCoverNote(`I am eager to apply for ${job.title}. My verified skills align strongly with your requirements.`);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;

    try {
      setApplying(true);
      await applicationService.createApplication({
        job: selectedJobToApply.id,
        match_score: selectedJobToApply.match_percentage || 75,
        cover_note: coverNote,
      });

      setAppliedJobIds((prev) => new Set([...prev, selectedJobToApply.id]));
      setApplySuccessMsg(`Application for ${selectedJobToApply.title} submitted to ${selectedJobToApply.company_name}! Tracking is active.`);
      setSelectedJobToApply(null);
      setTimeout(() => setApplySuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  const listToShow = activeTab === 'recommended' ? recommended : allJobs;

  const filteredJobs = listToShow.filter((j) => {
    return (
      j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner message="Matching industry job requirements against your verified skills..." />;
  }

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            AI Job Recommendation Engine
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Transparent weighted compatibility scores matching your verified skills with active employer postings
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--surface-alt)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setActiveTab('recommended')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'recommended' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'recommended' ? '#FFFFFF' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={14} /> AI Matched ({recommended.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'all' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            All Postings ({allJobs.length})
          </button>
        </div>
      </div>

      {applySuccessMsg && (
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
          <span>{applySuccessMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.3rem' }}
            placeholder="Search by job title, company, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Briefcase size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>
            No matching jobs found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Try adjusting your search criteria or switch to All Postings.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredJobs.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              onApply={handleOpenApplyModal}
              onViewDetails={(item) => setJobDetailModal(item)}
              hasApplied={appliedJobIds.has(j.id)}
            />
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobToApply && (
        <Modal
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
          title={`Apply for ${selectedJobToApply.title}`}
        >
          <form onSubmit={handleSubmitApplication}>
            <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)' }}>
                {selectedJobToApply.company_name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Location: {selectedJobToApply.location} · Calculated Match Score:{' '}
                <strong style={{ color: 'var(--primary)' }}>{selectedJobToApply.match_percentage}%</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Note / Cover Message</label>
              <textarea
                className="form-control"
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Describe your relevant skills and interest..."
                required
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Your verified skills matrix and diagnostic scores will be transmitted to the hiring employer.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedJobToApply(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={applying}
              >
                <Send size={15} /> {applying ? 'Submitting Application...' : 'Send Application'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Job Details Modal */}
      {jobDetailModal && (
        <Modal
          isOpen={!!jobDetailModal}
          onClose={() => setJobDetailModal(null)}
          title={jobDetailModal.title}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                {jobDetailModal.company_name}
              </span>
              <span className="badge badge-success">
                {jobDetailModal.match_percentage}% Compatibility
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
              <div><strong>Location:</strong> {jobDetailModal.location}</div>
              <div><strong>Department:</strong> {jobDetailModal.department || 'Engineering'}</div>
              <div><strong>Experience:</strong> {jobDetailModal.experience_required} years</div>
              <div><strong>Vacancies:</strong> {jobDetailModal.vacancies || 2} Openings</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>
                Job Description
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {jobDetailModal.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setJobDetailModal(null)}>
                Close
              </button>
              {!appliedJobIds.has(jobDetailModal.id) && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const j = jobDetailModal;
                    setJobDetailModal(null);
                    handleOpenApplyModal(j);
                  }}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecommendedJobs;
