import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { reportService } from '../../services/api';

const Reports = () => {
  const [downloading, setDownloading] = useState('');

  const reportCards = [
    {
      id: 'skill-gap',
      title: 'Skill Gap & Readiness Report',
      description: 'Audit report containing individual learner readiness scores, target role gaps, and missing competencies.',
      filename: 'kaushalsetu_skill_gap_report.csv',
      getUrl: reportService.getSkillGapCSVUrl,
      fields: ['Learner ID', 'Full Name', 'District', 'State', 'Target Role', 'Readiness (%)', 'Skill Gap (%)', 'Missing Skills', 'Weak Skills']
    },
    {
      id: 'outcomes',
      title: 'Verified Employment Outcomes Report',
      description: 'Official placement registry documenting hiring company, job title, starting salary (LPA), district, and government verification seals.',
      filename: 'kaushalsetu_employment_outcomes_report.csv',
      getUrl: reportService.getEmploymentOutcomeCSVUrl,
      fields: ['Placement ID', 'Candidate Name', 'District', 'Company Name', 'Job Title', 'Salary (LPA)', 'Placement Date', 'Placement Type', 'Govt Verified']
    },
    {
      id: 'impact',
      title: 'Institutional Training Impact Report',
      description: 'Accredited provider metrics detailing course enrollments, completion rates, and benchmark competency gains.',
      filename: 'kaushalsetu_training_impact_report.csv',
      getUrl: reportService.getTrainingImpactCSVUrl,
      fields: ['Course ID', 'Course Title', 'Provider / Institute', 'Duration (Weeks)', 'Enrolled Learners', 'Completed Learners', 'Completion Rate (%)']
    },
    {
      id: 'demand',
      title: 'Industry Skill Demand vs Supply Report',
      description: 'Macro telemetry capturing regional employer requisitions, candidate talent supply, demand-supply ratios, and shortage severity.',
      filename: 'kaushalsetu_industry_demand_report.csv',
      getUrl: reportService.getIndustryDemandCSVUrl,
      fields: ['Skill Name', 'Category', 'Active Job Demand Postings', 'Registered Talent Supply', 'Demand-Supply Ratio', 'Shortage Severity']
    },
  ];

  const handleDownload = (report) => {
    setDownloading(report.id);
    const url = report.getUrl();
    window.open(url, '_blank');
    setTimeout(() => setDownloading(''), 2000);
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <FileSpreadsheet size={16} /> Central Audit & Export Service
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Government Skilling Reports & CSV Data Export
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Export comprehensive raw CSV datasets generated directly from the live database for external auditing, ministry briefings, and academic evaluation.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem' }}>
        {reportCards.map((rep) => (
          <div key={rep.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  Live Database Export
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Format: .CSV
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>
                {rep.title}
              </h3>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {rep.description}
              </p>

              {/* Data Schema Columns Preview */}
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Included Schema Columns:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {rep.fields.map((f, idx) => (
                    <span key={idx} style={{ fontSize: '0.68rem', backgroundColor: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target: {rep.filename}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleDownload(rep)}
                disabled={downloading === rep.id}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} /> {downloading === rep.id ? 'Generating...' : 'Export CSV'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
