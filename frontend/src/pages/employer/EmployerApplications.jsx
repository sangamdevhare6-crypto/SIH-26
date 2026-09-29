import React, { useState, useEffect } from 'react';
import { FileText, Search, CheckCircle2, Clock, Calendar, Edit2, AlertCircle, Award, User } from 'lucide-react';
import { applicationService } from '../../services/api';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setInterviewDate(app.interview_date || '');
    setRemarks(app.remarks || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      await applicationService.updateStatus(selectedApp.id, {
        status: newStatus,
        interview_date: interviewDate || null,
        remarks: remarks,
      });

      setUpdateSuccess(`Application for ${selectedApp.student_name} updated to "${newStatus}". Candidate notified.`);
      setSelectedApp(null);
      fetchApplications();
      setTimeout(() => setUpdateSuccess(''), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Loading candidate application packets and verified skill match scores..." />;
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Selected': return 'badge-success';
      case 'Shortlisted': return 'badge-indigo';
      case 'Interview': return 'badge-primary';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            Candidate Applications & Hiring Pipeline
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Review candidate match scores, schedule technical interviews, and issue verified selection offers
          </p>
        </div>
      </div>

      {updateSuccess && (
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
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.3rem' }}
              placeholder="Search candidate name or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: statusFilter === status ? 'var(--primary)' : 'var(--surface)',
                  color: statusFilter === status ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Job</th>
                <th>Match Score</th>
                <th>Applied Date</th>
                <th>Current Status</th>
                <th>Interview / Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No applications match the current filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{app.student_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Learner ID: #{app.student}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{app.job_title}</td>
                    <td>
                      <span className="badge badge-success" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        {app.match_score}% Match
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {app.interview_date ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Calendar size={13} /> {app.interview_date}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)' }}>None scheduled</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenStatusModal(app)}
                      >
                        <Edit2 size={14} /> Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Update Status: ${selectedApp.student_name}`}
        >
          <form onSubmit={handleSaveStatus}>
            <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)' }}>
                {selectedApp.job_title} · {selectedApp.match_score}% Skill Match
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Note from candidate: "{selectedApp.cover_note || 'Standard profile packet'}"
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Recruitment Stage *</label>
              <select
                className="form-control"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <option value="Applied">Applied (Initial Review)</option>
                <option value="Shortlisted">Shortlisted for Review</option>
                <option value="Interview">Technical / HR Interview Scheduled</option>
                <option value="Selected">Selected & Hired (Creates Official Placement)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {newStatus === 'Interview' && (
              <div className="form-group">
                <label className="form-label">Interview Date & Time</label>
                <input
                  type="date"
                  className="form-control"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Employer Notes / Interview Instructions</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g. Cleared technical round; scheduled for managerial discussion on Google Meet..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {newStatus === 'Selected' && (
              <div style={{ backgroundColor: '#F0FDF4', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem', border: '1px solid #BBF7D0' }}>
                ✓ Marking as "Selected" will automatically create a verified <strong>EmploymentOutcome</strong> record in the government registry and update the learner's placement status!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedApp(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                {updating ? 'Saving...' : 'Save & Notify Learner'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EmployerApplications;
