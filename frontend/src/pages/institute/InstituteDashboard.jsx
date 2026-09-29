import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  Plus,
  BarChart3,
  ArrowRight,
  School
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const InstituteDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsService.getInstituteAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load institute analytics', err);
      setError('Could not retrieve institute skilling metrics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating institutional training completion and employment outcomes..." />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'No institute data available.'} onRetry={fetchDashboardData} />;
  }

  const { cards, charts } = data;

  return (
    <div>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#A5B4FC', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <School size={15} /> Accredited Training Institute Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            {data.institute_name || 'Vocational Training Centre'}
          </h1>
          <p style={{ color: '#C7D2FE', fontSize: '0.9rem' }}>
            Monitoring cohort skill gain, assessment evaluations, and verified placement transitions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/institute/courses" className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Course
          </Link>
          <Link to="/institute/learners" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#4338CA', color: '#FFFFFF', borderColor: '#6366F1' }}>
            <Users size={15} /> View Learners
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Total Learners Trained"
          value={cards.total_learners}
          subtitle="Enrolled cohort count"
          icon={Users}
          variant="indigo"
        />
        <StatCard
          title="Active Learners"
          value={cards.active_learners}
          subtitle="Currently attending modules"
          icon={BookOpen}
          variant="primary"
        />
        <StatCard
          title="Accredited Courses"
          value={cards.courses}
          subtitle="Curriculum modules offered"
          icon={Award}
          variant="navy"
        />
      </div>

      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Course Completion Rate"
          value={cards.completion_rate}
          subtitle="Learners who earned certificate"
          icon={CheckCircle2}
          variant="success"
          trend="+5.2% vs national average"
          trendDirection="up"
        />
        <StatCard
          title="Employment Outcome Rate"
          value={cards.employment_rate}
          subtitle="Trained learners placed in jobs"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Average Skill Gain"
          value={cards.avg_skill_gain}
          subtitle="Pre-training vs post-training score"
          icon={BarChart3}
          variant="indigo"
          trend="Significant measurable gain"
          trendDirection="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Course Completion Breakdown */}
        <ChartCard
          title="Course Completion Performance"
          subtitle="Enrolled learners vs. successful course completions"
          height={320}
        >
          {charts.course_performance?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.course_performance} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="title" angle={-20} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="enrolled" name="Enrolled" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No course completion data available.
            </div>
          )}
        </ChartCard>

        {/* Pre vs Post Scores */}
        <ChartCard
          title="Pre vs. Post Training Competency Score"
          subtitle="Demonstrating measurable skilling initiative impact"
          height={320}
        >
          {charts.pre_vs_post_scores?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.pre_vs_post_scores} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#0F172A', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Average Score']} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="score" name="Average Competency" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No assessment comparisons recorded.
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default InstituteDashboard;
