import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Layers, Building, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsService } from '../../services/api';
import ChartCard from '../../components/common/ChartCard';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COLORS = ['#2563EB', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const IndustryDemand = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemand = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getGovernmentAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDemand();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Analyzing industry job requisitions against registered talent supply..." />;
  }

  const { charts } = data || {};
  const skillDemandList = charts?.skill_demand || [];
  const criticalShortages = charts?.critical_shortages || [];
  const industryDist = charts?.industry_distribution || [];

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#A5B4FC', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Building size={16} /> Macroeconomic Talent Intelligence
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Industry Skill Demand & Talent Supply Analytics
        </h2>
        <p style={{ color: '#C7D2FE', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Real-time telemetry showing which competencies employers are hiring for versus current registered talent supply, highlighting critical shortage bottlenecks.
        </p>
      </div>

      {/* Main Comparison Chart: Demand vs Supply */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Skill Demand vs. Registered Talent Supply
            </h3>
            <p className="card-subtitle">
              Comparing open corporate job postings against candidate proficiencies in the database
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillDemandList.slice(0, 8)}
              margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="skill" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="demand_postings" name="Industry Demand (Jobs)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="talent_supply" name="Talent Supply (Candidates)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Shortages & Industry Distribution Row */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Shortages Alert List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={18} /> Critical Regional Shortage Bottlenecks
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {criticalShortages.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#991B1B' }}>
                    {item.skill}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#B91C1C' }}>
                    Demand: {item.demand_postings} openings · Supply: {item.talent_supply} candidates
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-danger">
                    {item.demand_supply_ratio} Ratio
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Sector Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Building size={18} style={{ color: 'var(--indigo)' }} /> Sector-wise Hiring Distribution
            </h3>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryDist}
                  dataKey="count"
                  nameKey="industry"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name.slice(0, 10)} ${(percent * 100).toFixed(0)}%`}
                >
                  {industryDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Demand Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '1.25rem 1.5rem', marginBottom: 0 }}>
          <h3 className="card-title">Complete Industry Demand Matrix</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Active Demand (Jobs)</th>
                <th>Talent Supply</th>
                <th>Demand-to-Supply Ratio</th>
                <th>Shortage Severity</th>
              </tr>
            </thead>
            <tbody>
              {skillDemandList.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.skill}</td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.demand_postings}</td>
                  <td>{item.talent_supply}</td>
                  <td style={{ fontWeight: 600 }}>{item.demand_supply_ratio}</td>
                  <td>
                    <span className={`badge ${getSeverityBadge(item.shortage_severity)}`}>
                      {item.shortage_severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndustryDemand;
