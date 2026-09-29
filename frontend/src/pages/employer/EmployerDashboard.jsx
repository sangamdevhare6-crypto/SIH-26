import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Building,
  Target,
  FileCheck
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

const EmployerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsService.getEmployerAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load employer analytics', err);
      setError('Could not retrieve employer hiring metrics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating applicant compatibility distributions and hiring pipeline..." />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'No employer data available.'} onRetry={fetchDashboardData} />;
  }

  const { cards, charts } = data;

  return (
    <div>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#FCD34D', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Building size={15} /> Industry Employer Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            {data.employer_name || 'Enterprise Hiring Partner'}
          </h1>
          <p style={{ color: '#D6D3D1', fontSize: '0.9rem' }}>
            Discover pre-verified talent matched through transparent skill compatibility algorithms
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employer/jobs" className="btn btn-primary btn-sm">
            <Plus size={15} /> Post New Job
          </Link>
          <Link to="/employer/applications" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#44403C', color: '#FFFFFF', borderColor: '#78716C' }}>
            <FileCheck size={15} /> Review Applications
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Active Job Postings"
          value={cards.active_jobs}
          subtitle="Open corporate requisitions"
          icon={Briefcase}
          variant="primary"
        />
        <StatCard
          title="Total Applications"
          value={cards.total_applications}
          subtitle="Received across all jobs"
          icon={Users}
          variant="indigo"
        />
        <StatCard
          title="Shortlisted Candidates"
          value={cards.shortlisted}
          subtitle="Passed initial skill threshold"
          icon={Target}
          variant="warning"
        />
        <StatCard
          title="Selected Hires"
          value={cards.selected_hires}
          subtitle="Confirmed placement offers"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Match Distribution */}
        <ChartCard
          title="Applicant Skill Compatibility Distribution"
          subtitle="Applicants grouped by algorithm-calculated skill match percentage"
          height={320}
        >
          {charts.match_distribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.match_distribution} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="count" name="Candidates" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No applicant distribution data yet.
            </div>
          )}
        </ChartCard>

        {/* Applications per Job */}
        <ChartCard
          title="Hiring Demand by Job Posting"
          subtitle="Applications received per active corporate vacancy"
          height={320}
        >
          {charts.applications_per_job?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.applications_per_job} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="title" angle={-20} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="applications" name="Applications" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No applications recorded for open jobs.
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default EmployerDashboard;
