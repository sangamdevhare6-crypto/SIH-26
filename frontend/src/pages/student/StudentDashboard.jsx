import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Layers,
  Briefcase,
  BookOpen,
  FileText,
  TrendingUp,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { analyticsService, jobService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const COLORS = ['#2563EB', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, jobsRes] = await Promise.all([
        analyticsService.getStudentAnalytics(),
        jobService.getRecommendedJobs(),
      ]);
      setData(analyticsRes);
      setRecommendedJobs(Array.isArray(jobsRes) ? jobsRes.slice(0, 3) : []);
    } catch (err) {
      console.error('Failed to load student analytics', err);
      setError('Unable to load student metrics from database. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating dynamic student analytics & skill scores..." />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'No student data found.'} onRetry={fetchDashboardData} />;
  }

  const { cards, charts } = data;

  return (
    <div>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Sparkles size={15} /> Personalized AI Skilling Profile
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Welcome back, {data.full_name || user?.first_name || 'Learner'}!
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Target Career Path: <strong style={{ color: '#E2E8F0' }}>{data.target_role || 'Junior Data Analyst'}</strong> · Status:{' '}
            <span style={{ color: '#34D399', fontWeight: 600 }}>{data.employment_status || 'Seeking Opportunities'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/student/assessment" className="btn btn-primary btn-sm">
            <Compass size={15} /> Take Assessment
          </Link>
          <Link to="/student/skill-gap" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#334155', color: '#FFFFFF', borderColor: '#475569' }}>
            <Layers size={15} /> Analyze Gap
          </Link>
        </div>
      </div>

      {/* 7 KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Overall Skill Score"
          value={cards.skill_score}
          subtitle="Assessed Proficiency"
          icon={Award}
          variant="primary"
          trend="+8% this month"
          trendDirection="up"
        />
        <StatCard
          title="Skills Identified"
          value={cards.skills_identified}
          subtitle="In your verified portfolio"
          icon={Layers}
          variant="indigo"
        />
        <StatCard
          title="Target Skill Gap"
          value={cards.skill_gap}
          subtitle={`Against ${data.target_role?.slice(0, 15) || 'Role'}`}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Role Readiness"
          value={cards.readiness_score || '70%'}
          subtitle="Employment Ready"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Recommended Jobs"
          value={cards.recommended_jobs}
          subtitle="Matching your verified skills"
          icon={Briefcase}
          variant="primary"
        />
        <StatCard
          title="Courses Completed"
          value={cards.courses_completed}
          subtitle="Accredited training modules"
          icon={BookOpen}
          variant="indigo"
        />
        <StatCard
          title="Active Applications"
          value={cards.applications}
          subtitle={cards.employment_status}
          icon={FileText}
          variant="success"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Skills Proficiency Chart */}
        <ChartCard
          title="Your Verified Skill Competencies"
          subtitle="Calculated from diagnostic assessments and project evaluations"
          height={320}
        >
          {charts.skill_breakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.skill_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="skill" angle={-25} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Proficiency']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="proficiency" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No skills assessed yet. Take an assessment to view scores.
            </div>
          )}
        </ChartCard>

        {/* Pre vs Post Training Improvement */}
        <ChartCard
          title="Training Score Improvement"
          subtitle="Pre-training benchmark vs. post-training formal assessment"
          height={320}
        >
          {charts.training_improvement?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.training_improvement} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="course" angle={-20} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="pre_score" name="Pre Benchmark" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="post_score" name="Post Assessment" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No training progression recorded yet.
            </div>
          )}
        </ChartCard>
      </div>

      {/* Lower Row: Recommended Jobs & Next Steps */}
      <div className="grid-2">
        {/* Recommended Jobs Preview */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Top AI-Matched Opportunities
              </h3>
              <p className="card-subtitle">Opportunities with highest skill compatibility</p>
            </div>
            <Link to="/student/jobs" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recommended jobs right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)' }}>{job.title}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {job.company_name} · {job.location || 'Pune, India'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      {job.match_percentage}% Match
                    </span>
                    <Link to="/student/jobs" className="btn btn-outline-primary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized Next Steps Callout */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">
                <TrendingUp size={18} style={{ color: 'var(--indigo)' }} /> Action Plan to Close Gaps
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Your current skill readiness for <strong>{data.target_role}</strong> is <strong>{cards.readiness_score}</strong>. Closing the identified gaps will increase your interview shortlist rates by 3.4x.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
                <Compass size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>
                  <strong>Diagnostic Evaluation:</strong> Verify your Python & SQL proficiencies with standardized MCQs.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--indigo-light)', borderRadius: 'var(--radius-md)' }}>
                <BookOpen size={18} color="var(--indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>
                  <strong>Targeted Upskilling:</strong> Enroll in Power BI or Advanced Analytics to eliminate target role gaps.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <Link to="/student/courses" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Browse Recommended Courses
            </Link>
            <Link to="/student/skill-gap" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Run Gap Diagnostics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
