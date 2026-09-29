import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  School,
  Award,
  Layers,
  Target,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import { analyticsService, studentService, applicationService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CareerGrowth = () => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profData, analData, outData] = await Promise.all([
          studentService.getProfile(),
          analyticsService.getStudentAnalytics(),
          applicationService.getOutcomes(),
        ]);
        setProfile(profData);
        setAnalytics(analData);
        setOutcomes(Array.isArray(outData) ? outData : []);
      } catch (err) {
        console.error('Failed to load career growth data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Assembling your verifiable career growth trajectory..." />;
  }

  const milestones = [
    {
      stage: 'Phase 1: Institutional Skilling & Training',
      title: profile?.college_institute || 'Government Engineering College, Pune',
      detail: `${profile?.education || 'Technical Degree'} · Completed Core Syllabus Benchmarks`,
      status: 'Completed',
      icon: School,
      color: '#3B82F6'
    },
    {
      stage: 'Phase 2: Competency Acquisition',
      title: `${analytics?.cards?.skills_identified || 12} Verified Skills In Portfolio`,
      detail: `Average Diagnostic Score: ${analytics?.cards?.skill_score || '78%'} across technical & analytical tools`,
      status: 'Completed',
      icon: Layers,
      color: '#6366F1'
    },
    {
      stage: 'Phase 3: Formal Diagnostic Assessment',
      title: 'Standardized MCQ Verification',
      detail: 'Diagnostic evaluation certifying Python, SQL & Web Development proficiencies',
      status: 'Verified',
      icon: Award,
      color: '#8B5CF6'
    },
    {
      stage: 'Phase 4: Dynamic Skill Gap Detection',
      title: `Evaluated Against ${profile?.target_role || 'Junior Data Analyst'}`,
      detail: `Role Readiness Score: ${analytics?.cards?.readiness_score || '70%'} (Remaining Gap: ${analytics?.cards?.skill_gap || '30%'})`,
      status: 'In Progress',
      icon: Target,
      color: '#EC4899'
    },
    {
      stage: 'Phase 5: Targeted Upskilling Coursework',
      title: `${analytics?.cards?.courses_completed || 3} Courses Completed`,
      detail: 'Eliminated prerequisite gaps in Power BI, Advanced Excel, and Statistical Analytics',
      status: 'Completed',
      icon: BookOpen,
      color: '#F59E0B'
    },
    {
      stage: 'Phase 6: Industry Hiring Applications',
      title: `${analytics?.cards?.applications || 3} Applications Submitted`,
      detail: 'Transmitted verified credential packets to accredited hiring employers',
      status: 'Active',
      icon: Briefcase,
      color: '#10B981'
    },
    {
      stage: 'Phase 7: Verified Employment Outcome',
      title: profile?.employment_status === 'Employed / Placed' ? 'Government Verified Placement' : 'Final Selection Stage',
      detail: profile?.employment_status === 'Employed / Placed'
        ? 'Official placement contract verified in national employment registry'
        : 'Interviews in progress with industry corporate partners',
      status: profile?.employment_status === 'Employed / Placed' ? 'Completed' : 'Pending',
      icon: CheckCircle2,
      color: '#06B6D4'
    },
    {
      stage: 'Phase 8: Continuous Career & Wage Growth',
      title: 'Long-term Professional Trajectory',
      detail: 'Annual wage progression tracking, advanced certifications, and promotion benchmarking',
      status: 'Ongoing',
      icon: TrendingUp,
      color: '#2563EB'
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Sparkles size={16} /> Verifiable Trajectory Architecture
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Lifelong Career Growth & Outcome Pathway
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.5 }}>
          The complete journey tracking: <strong>Training → Skills → Assessment → Skill Gap → Upskilling → Job Matching → Employment → Career Growth</strong>
        </p>
      </div>

      {/* Verified Placement Outcome Highlight (if placed or demo outcome exists) */}
      <div className="card" style={{
        marginBottom: '2rem',
        borderLeft: '5px solid var(--success)',
        backgroundColor: '#F0FDF4',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> National Employment Registry Record
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginBottom: '0.2rem' }}>
              {profile?.full_name} · {profile?.target_role}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#15803D' }}>
              Placement Location: <strong>{profile?.district}, {profile?.state}</strong> · Status: <strong>{profile?.employment_status}</strong>
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #BBF7D0',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Benchmark Wage</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
              ₹6.5 - 9.0 LPA
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Milestone Pathway */}
      <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
        {/* Connecting Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '20px',
          bottom: '20px',
          width: '3px',
          backgroundColor: '#E2E8F0',
          zIndex: 1
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Node circle */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '0',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: `3px solid ${m.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: m.color,
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <Icon size={18} />
                </div>

                {/* Milestone Content Card */}
                <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {m.stage}
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                      {m.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>
                    {m.title}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {m.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerGrowth;
