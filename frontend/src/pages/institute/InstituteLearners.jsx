import React, { useState, useEffect } from 'react';
import { Users, Search, Award, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { studentService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InstituteLearners = () => {
  const [trainings, setTrainings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const data = await studentService.getTrainingProgress();
        setTrainings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  const filteredTrainings = trainings.filter((t) => {
    return (
      t.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner message="Retrieving institutional learner rosters and competency benchmarks..." />;
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-primary';
      case 'Enrolled': return 'badge-indigo';
      default: return 'badge-secondary';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            Enrolled Learners & Competency Progress
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tracking student completion percentages and verifiable pre-vs-post assessment improvements
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.3rem' }}
            placeholder="Search by learner name, course, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        </div>
      </div>

      {/* Learners Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner Name</th>
                <th>Course Enrolled</th>
                <th>Training Status</th>
                <th>Progress (%)</th>
                <th>Pre Benchmark</th>
                <th>Post Assessment</th>
                <th>Skill Gain</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No learners match your search query.
                  </td>
                </tr>
              ) : (
                filteredTrainings.map((t) => {
                  const gain = Math.max(0, t.post_assessment_score - t.pre_assessment_score);
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: 'var(--navy)' }}>
                        {t.student_name}
                      </td>
                      <td>{t.course_title}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${t.completion_percentage}%`, backgroundColor: 'var(--primary)' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.completion_percentage}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{t.pre_assessment_score}%</td>
                      <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{t.post_assessment_score}%</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <TrendingUp size={14} /> +{gain}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstituteLearners;
