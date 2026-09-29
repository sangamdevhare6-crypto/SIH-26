import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Compass,
  Layers,
  BookOpen,
  Award,
  Users,
  Shield,
  Building,
  School,
  FileCheck,
  Target,
  BarChart3,
  Network
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (roleKey) => {
    try {
      await loginAs(roleKey);
      if (roleKey === 'student') navigate('/student/dashboard');
      else if (roleKey === 'institute') navigate('/institute/dashboard');
      else if (roleKey === 'employer') navigate('/employer/dashboard');
      else if (roleKey === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const journeySteps = [
    { num: '01', title: 'Training', desc: 'Accredited coursework with pre-training skill benchmarks', icon: School, color: '#3B82F6' },
    { num: '02', title: 'Skill Development', desc: 'Hands-on practical competency and technical practice', icon: Layers, color: '#6366F1' },
    { num: '03', title: 'Skill Assessment', desc: 'Standardized MCQ diagnostic tests & automated scoring', icon: Compass, color: '#8B5CF6' },
    { num: '04', title: 'Skill Gap Detection', desc: 'Dynamic role benchmark comparison identifying weaknesses', icon: Target, color: '#EC4899' },
    { num: '05', title: 'Personalized Upskilling', desc: 'Targeted course recommendations to bridge detected gaps', icon: BookOpen, color: '#F59E0B' },
    { num: '06', title: 'Job Matching', desc: 'Transparent weighted skill matching algorithm for industry roles', icon: Briefcase, color: '#10B981' },
    { num: '07', title: 'Verified Employment', desc: 'Official placement outcome records with salary & district tracking', icon: Award, color: '#06B6D4' },
    { num: '08', title: 'Career Growth', desc: 'Continuous wage growth and long-term career progression milestones', icon: TrendingUp, color: '#2563EB' },
  ];

  const features = [
    {
      icon: Compass,
      title: 'AI Skill Assessment',
      desc: 'Interactive, real-time diagnostic assessments across programming, analytics, web dev, and core industry tools with instant verified scoring.',
      color: 'var(--primary)',
      bg: 'var(--primary-light)'
    },
    {
      icon: Target,
      title: 'Skill Gap Detection',
      desc: 'Compares a learner\'s actual verified proficiency against target role benchmarks (e.g. Junior Data Analyst, Full Stack Developer) to calculate exact gap %.',
      color: 'var(--indigo)',
      bg: 'var(--indigo-light)'
    },
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      desc: 'Weighted transparent algorithms compute applicant match scores, matching skills, and missing competencies with zero black-box hallucination.',
      color: '#059669',
      bg: '#D1FAE5'
    },
    {
      icon: BookOpen,
      title: 'Personalized Upskilling',
      desc: 'Automated course recommendations targeting the exact weak and missing skills detected during the learner\'s gap evaluation.',
      color: '#D97706',
      bg: '#FEF3C7'
    },
    {
      icon: FileCheck,
      title: 'Employment Tracking',
      desc: 'End-to-end recruitment lifecycle from application to shortlisting, interviews, and verifiable government placement records with wage data.',
      color: '#0284C7',
      bg: '#E0F2FE'
    },
    {
      icon: BarChart3,
      title: 'Industry Demand Analysis',
      desc: 'Aggregated macro telemetry tracking regional skill demand vs. registered talent supply, highlighting critical shortage areas for policymakers.',
      color: '#7C3AED',
      bg: '#EDE9FE'
    }
  ];

  const stats = [
    { value: '15,000+', label: 'Trained Learners Tracked' },
    { value: '86.4%', label: 'Placement Conversion Rate' },
    { value: '25+', label: 'Standardized Skill Catalogs' },
    { value: '₹7.2 LPA', label: 'Average Verified Salary' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at 50% 10%, #EFF6FF 0%, #FFFFFF 100%)',
        padding: '4.5rem 1.5rem 4rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid #BFDBFE'
          }}>
            <Sparkles size={16} /> Smart India Hackathon 2026 · Problem Statement SIH26135
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: 'var(--navy)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Bridge Skills to Opportunities with <span style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AI</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 2.25rem',
            fontWeight: 400
          }}>
            Connecting skill development, employment and industry demand through intelligent skill-gap analysis, personalized upskilling, and verifiable outcome tracking.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Portal
            </Link>
            <a href="#how-it-works" className="btn btn-outline-primary btn-lg">
              Explore Complete Journey
            </a>
          </div>

          {/* Quick 1-Click Evaluation Bar */}
          <div style={{
            background: 'var(--surface)',
            border: '1.5px solid #BFDBFE',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '820px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ SIH Evaluator Quick Access (1-Click Test Drive)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }} className="demo-grid">
              <button
                onClick={() => handleDemo('student')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', height: 'auto' }}
              >
                <Users size={18} color="var(--primary)" style={{ marginBottom: '0.2rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy)' }}>Student</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Skill Gap & Jobs</span>
              </button>

              <button
                onClick={() => handleDemo('institute')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', height: 'auto' }}
              >
                <School size={18} color="var(--indigo)" style={{ marginBottom: '0.2rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy)' }}>Institute</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Trainings & Impact</span>
              </button>

              <button
                onClick={() => handleDemo('employer')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', height: 'auto' }}
              >
                <Building size={18} color="#B45309" style={{ marginBottom: '0.2rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy)' }}>Employer</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Post Jobs & Hire</span>
              </button>

              <button
                onClick={() => handleDemo('admin')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', height: 'auto' }}
              >
                <Shield size={18} color="var(--success)" style={{ marginBottom: '0.2rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy)' }}>Government</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>National Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ backgroundColor: 'var(--navy)', color: '#FFFFFF', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {stats.map((s, idx) => (
            <div key={idx}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--font-heading)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNER JOURNEY VISUALIZATION (Core SIH Component) */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Unified End-to-End Pathway
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>
            The Complete Learner Journey
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Directly addressing fragmented skilling data by tracking every learner step from initial enrollment to long-term wage gain.
          </p>
        </div>

        {/* Visual 8-Step Pipeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }} className="journey-grid">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.5rem',
                  borderTop: `4px solid ${step.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--border-dark)', fontFamily: 'var(--font-heading)' }}>
                    {step.num}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.35rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" style={{ backgroundColor: 'var(--surface)', padding: '5rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              Intelligent Capability Suite
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>
              Engineered to Solve Fragmented Skilling
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
              Built specifically for Smart India Hackathon 2026 to bring transparency, accountability, and AI intelligence to skilling initiatives.
            </p>
          </div>

          <div className="grid-3">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: f.bg,
                    color: f.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.2rem'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION (SIH26135 Direct Grounding) */}
      <section id="impact" style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            SIH Problem Statement SIH26135
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>
            Traditional Skilling vs. KaushalSetu AI
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            How our data architecture solves the critical gap between skilling expenditures and verifiable employment outcomes.
          </p>
        </div>

        <div className="grid-2">
          {/* Traditional Way */}
          <div className="card" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: '#FEF2F2' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '1rem' }}>
              ❌ The Broken Traditional System
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#991B1B' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                Learners are certified without diagnostic verification of actual job competency.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#991B1B' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                Skill gaps remain invisible until the candidate fails repeated job interviews.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#991B1B' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                Employers have no trust in certificates and struggle to find verified talent.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#991B1B' }}>
                <span style={{ fontWeight: 700 }}>•</span>
                Government cannot measure the true employment impact or wage gains of skilling funds.
              </li>
            </ul>
          </div>

          {/* KaushalSetu AI Solution */}
          <div className="card" style={{ borderLeft: '4px solid var(--success)', backgroundColor: '#F0FDF4' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1rem' }}>
              ✓ The KaushalSetu AI Transformation
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#166534' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                Standardized assessments calculate verified proficiencies (0-100%) stored in the database.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#166534' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                Dynamic role comparison detects exact skill gaps and automatically triggers course recommendations.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#166534' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                Weighted job matching engine shows transparent % scores, matching skills, and missing prerequisites.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#166534' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                National analytics aggregate district-wise placements, average LPA salaries, and verified ROI.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to Experience KaushalSetu AI?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', marginBottom: '2rem' }}>
            Launch your evaluation session right now with pre-populated demo data across Student, Institute, Employer, and Government portals.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create an Account
            </Link>
            <button onClick={() => handleDemo('student')} className="btn btn-secondary btn-lg" style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}>
              Launch Student Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0B1120', color: '#94A3B8', padding: '3rem 1.5rem 2rem', borderTop: '1px solid #1E293B', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <GraduationCap size={24} color="#60A5FA" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>KaushalSetu AI</span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#64748B' }}>
              AI-powered integrated skilling and employment platform tracking the complete learner journey from training to placement and wage progression.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 700 }}>Quick Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button onClick={() => handleDemo('student')} style={{ textAlign: 'left', color: '#94A3B8', fontSize: '0.85rem' }}>Student Portal</button>
              <button onClick={() => handleDemo('institute')} style={{ textAlign: 'left', color: '#94A3B8', fontSize: '0.85rem' }}>Training Institute</button>
              <button onClick={() => handleDemo('employer')} style={{ textAlign: 'left', color: '#94A3B8', fontSize: '0.85rem' }}>Hiring Employer</button>
              <button onClick={() => handleDemo('admin')} style={{ textAlign: 'left', color: '#94A3B8', fontSize: '0.85rem' }}>Government Analytics</button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 700 }}>Hackathon Submission</h4>
            <p style={{ color: '#64748B', lineHeight: 1.5 }}>
              Smart India Hackathon 2026<br />
              Problem ID: <strong>SIH26135</strong><br />
              Team: <strong>Team Dominator</strong><br />
              Tech: React · Django REST · SimpleJWT · SQLite
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>© 2026 KaushalSetu AI · Team Dominator. All Rights Reserved.</div>
          <div style={{ color: '#64748B' }}>Production Full-Stack Architecture</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
