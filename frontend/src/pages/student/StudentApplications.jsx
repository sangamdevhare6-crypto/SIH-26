import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Building, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { applicationService } from '../../services/api';
import ApplicationTimeline from '../../components/common/ApplicationTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Retrieving your submitted job applications and status tracking..." />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
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
            Application Outcomes & Tracking
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Real-time status updates synced with hiring employer review actions
          </p>
        </div>

        <Link to="/student/jobs" className="btn btn-primary btn-sm">
          Browse More Jobs <ArrowRight size={14} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <FileText size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>
            No applications submitted yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Explore AI-matched job opportunities and submit your profile with 1-click.
          </p>
          <Link to="/student/jobs" className="btn btn-primary btn-sm">
            View Recommended Jobs
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div>
                  <span className={`badge ${getStatusBadge(app.status)}`} style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    Status: {app.status}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.2rem' }}>
                    {app.job_title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {app.company_name}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Applicant Match Score:
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                    {app.match_score}%
                  </div>
                </div>
              </div>

              {/* Multi-Stage Visual Timeline */}
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <ApplicationTimeline
                  status={app.status}
                  appliedDate={new Date(app.applied_date).toLocaleDateString()}
                  interviewDate={app.interview_date}
                  remarks={app.remarks}
                />
              </div>

              {app.cover_note && (
                <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>Your Application Note:</strong> "{app.cover_note}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
