import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { skillGapService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SkillGapAnalysis = () => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const data = await skillGapService.getOverview();
      setAvailableRoles(data.available_roles || []);
      if (data.current_analysis) {
        setAnalysis(data.current_analysis);
        setSelectedRole(data.current_analysis.target_role);
      } else if (data.available_roles?.length > 0) {
        const firstRole = data.available_roles[0].title;
        setSelectedRole(firstRole);
        handleAnalyze(firstRole);
      }
    } catch (err) {
      console.error('Failed to load skill gap overview', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (roleToAnalyze) => {
    const target = roleToAnalyze || selectedRole;
    if (!target) return;

    try {
      setAnalyzing(true);
      const res = await skillGapService.analyzeGap(target);
      setAnalysis(res);
      setSelectedRole(target);
    } catch (err) {
      console.error('Failed to run gap analysis', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating dynamic skill gap matrix against industry benchmarks..." />;
  }

  const roleMeta = availableRoles.find((r) => r.title === selectedRole);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Header & Role Selector */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <Target size={16} /> Dynamic SIH Skill Gap Diagnostic Engine
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Skill Gap Analysis & Benchmark Comparison
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '750px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Our ML engine dynamically evaluates your verified competencies against industry hiring benchmarks, calculating your exact talent readiness and identifying weak skills.
        </p>

        {/* Role Selector Controls */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Target Career Role to Evaluate:
            </label>
            <select
              className="form-control"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                handleAnalyze(e.target.value);
              }}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderColor: '#334155' }}
            >
              {availableRoles.map((r) => (
                <option key={r.title} value={r.title}>
                  {r.title} ({r.category}) — Avg Starting: {r.avg_starting_salary}
                </option>
              ))}
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleAnalyze(selectedRole)}
              disabled={analyzing}
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Zap size={16} /> {analyzing ? 'Recalculating...' : 'Re-Run Gap Diagnostic'}
            </button>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Key Metric Scorecards */}
          <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
            {/* Overall Gap % */}
            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overall Skill Gap
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                {analysis.overall_skill_gap_percentage}%
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {analysis.overall_skill_gap_percentage === 0 ? 'No gap detected! Ready for placement.' : 'Calculated competency deficit against role benchmark'}
              </p>
            </div>

            {/* Employment Readiness Score */}
            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Employment Readiness
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                {analysis.readiness_percentage}%
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {analysis.readiness_percentage >= 75 ? 'Strong candidate profile for hiring drives' : 'Upskilling required to reach 80%+ threshold'}
              </p>
            </div>

            {/* Target Role Overview */}
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Target Market Value
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                {roleMeta?.avg_starting_salary || '₹6 - 10 LPA'}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Average starting salary package for qualified talent
              </p>
            </div>
          </div>

          {/* Core Benchmark Comparison Chart */}
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Layers size={18} style={{ color: 'var(--primary)' }} /> Required Benchmark vs. Your Current Proficiency
                </h3>
                <p className="card-subtitle">
                  Blue bars represent industry job prerequisites; Green/Amber bars show your verified student proficiencies
                </p>
              </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analysis.comparison_breakdown || []}
                  margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="skill" tick={{ fontSize: 12, fill: '#0F172A', fontWeight: 600 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="required_proficiency" name="Industry Requirement" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current_proficiency" name="Your Assessed Score" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorized Skills Columns: Missing vs Weak vs Ready */}
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            {/* Missing Skills */}
            <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={18} color="var(--danger)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>
                  Missing Skills ({analysis.missing_skills?.length || 0})
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Prerequisites completely absent from your profile (0% proficiency)
              </p>

              {analysis.missing_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {analysis.missing_skills.map((s, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px solid #FECACA' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#991B1B' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Required: {s.required}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ No missing skills!
                </div>
              )}
            </div>

            {/* Weak Skills */}
            <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={18} color="#D97706" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#D97706' }}>
                  Weak Skills ({analysis.weak_skills?.length || 0})
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Skills below the target industry proficiency threshold
              </p>

              {analysis.weak_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {analysis.weak_skills.map((s, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400E' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B45309' }}>
                        Current: {s.current}% · Required: {s.required}% (Gap: {s.gap}%)
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ No weak competencies!
                </div>
              )}
            </div>

            {/* Ready Skills */}
            <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
                  Ready Skills ({analysis.ready_skills?.length || 0})
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Competencies that meet or exceed hiring criteria
              </p>

              {analysis.ready_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {analysis.ready_skills.map((s, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#15803D' }}>
                        Current: {s.current}% · Exceeds benchmark
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Take assessments to verify competencies.
                </div>
              )}
            </div>
          </div>

          {/* Actionable Upskilling Plan (Bridge Gaps) */}
          <div className="card" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <BookOpen size={18} style={{ color: 'var(--indigo)' }} /> Recommended Upskilling to Bridge Your Gaps
                </h3>
                <p className="card-subtitle">
                  Courses tailored specifically for your target role: <strong>{analysis.target_role}</strong>
                </p>
              </div>
              <Link to="/student/courses" className="btn btn-primary btn-sm">
                View All Courses <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              {analysis.recommended_courses?.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-alt)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                        {c.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {c.duration_weeks ? `${c.duration_weeks} weeks` : 'Self-paced'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>
                      {c.title}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: 'var(--indigo)', fontWeight: 600, marginBottom: '0.75rem' }}>
                      ⚡ Bridges Gap in: {c.target_gap_skill || 'Core Prerequisite'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
                      Free (Govt Skilling)
                    </span>
                    <Link to="/student/courses" className="btn btn-primary btn-sm">
                      Enroll in Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGapAnalysis;
