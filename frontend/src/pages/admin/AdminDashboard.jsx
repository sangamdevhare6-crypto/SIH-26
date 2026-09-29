import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  School,
  Building,
  TrendingUp,
  Award,
  AlertCircle,
  Filter,
  FileSpreadsheet,
  IndianRupee,
  Sparkles,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const COLORS = ['#2563EB', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    state: 'All',
    district: 'All',
    industry: 'All',
  });

  const fetchAnalytics = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsService.getGovernmentAnalytics(customFilters);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve government skilling analytics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilterChange = (name, value) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    fetchAnalytics(updated);
  };

  if (loading && !data) {
    return <LoadingSpinner message="Aggregating national skilling data & district-level employment outcomes..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => fetchAnalytics(filters)} />;
  }

  const { cards, charts } = data || {};

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6EE7B7', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Shield size={15} /> Ministry of Skill Development & Entrepreneurship (MSDE) Telemetry
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            National Skilling & Employment Outcome Intelligence
          </h1>
          <p style={{ color: '#D1FAE5', fontSize: '0.9rem' }}>
            SIH26135 Solution: Measurable tracking of skilling initiatives, skill gaps, and verified placements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/impact" className="btn btn-primary btn-sm" style={{ backgroundColor: '#10B981', borderColor: '#059669' }}>
            <TrendingUp size={15} /> Impact Funnel
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#047857', color: '#FFFFFF', borderColor: '#059669' }}>
            <FileSpreadsheet size={15} /> Export Reports
          </Link>
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
          <Filter size={16} /> Regional & Industry Filters (Updates Database Query in Real-Time):
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          {/* State Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>State</label>
            <select
              className="form-control"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            >
              <option value="All">All States (National)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>District</label>
            <select
              className="form-control"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="All">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Noida">Noida</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Industry Sector</label>
            <select
              className="form-control"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            >
              <option value="All">All Industry Sectors</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Analytics">Analytics & Data Science</option>
              <option value="Cloud">Web & Cloud Services</option>
              <option value="Finance">Finance & FinTech</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metric Scorecards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Registered Learners"
          value={cards?.registered_learners || 0}
          subtitle="Aadhaar-seeded learners"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Accredited Institutes"
          value={cards?.training_institutes || 0}
          subtitle="Certified skilling centres"
          icon={School}
          variant="indigo"
        />
        <StatCard
          title="Hiring Employers"
          value={cards?.employers || 0}
          subtitle="Active industry partners"
          icon={Building}
          variant="warning"
        />
        <StatCard
          title="Verified Placements"
          value={cards?.successful_placements || 0}
          subtitle="Employment contracts issued"
          icon={Award}
          variant="success"
        />
      </div>

      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Overall Placement Rate"
          value={cards?.employment_rate || '0%'}
          subtitle="Completed learners placed"
          icon={TrendingUp}
          variant="success"
          trend="+12% YoY"
          trendDirection="up"
        />
        <StatCard
          title="Average Skill Gap"
          value={cards?.avg_skill_gap || '0%'}
          subtitle="Across monitored cohorts"
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Average Starting Salary"
          value={cards?.avg_salary_lpa || '₹0 LPA'}
          subtitle="Verified entry compensation"
          icon={IndianRupee}
          variant="primary"
        />
      </div>

      {/* CORE SIH IMPACT FUNNEL */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: 'var(--success)' }} /> The Skilling-to-Employment Conversion Funnel
            </h3>
            <p className="card-subtitle">
              Visualizing how skilling investments convert into measurable jobs and employment outcomes
            </p>
          </div>
          <Link to="/admin/impact" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            Deep Dive <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={charts?.impact_funnel || []}
              margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="stage" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                formatter={(val, name) => [`${val} Learners`, name]}
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              />
              <Bar dataKey="count" name="Learner Volume" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional & Trajectory Charts */}
      <div className="grid-2">
        {/* District-wise Employment Rate */}
        <ChartCard
          title="District-wise Placement Rates"
          subtitle="Percentage of trained learners placed per monitored district"
          height={320}
        >
          {charts?.district_employment?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.district_employment} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="district" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Placement Rate']} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="placement_rate" name="Placement Rate" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No district employment records.
            </div>
          )}
        </ChartCard>

        {/* Monthly Trajectory */}
        <ChartCard
          title="Monthly Skilling & Placement Trajectory"
          subtitle="Trained learners vs. verified corporate placements"
          height={320}
        >
          {charts?.monthly_trends?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthly_trends} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="trained" name="Learners Trained" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="placed" name="Verified Placements" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              No trend data available.
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
