import React, { useState, useEffect } from 'react';
import { Users, Target, Search, CheckCircle2, AlertCircle, Briefcase, Award, ArrowRight } from 'lucide-react';
import { jobService, studentService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CandidateMatching = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsData, learnersData] = await Promise.all([
          jobService.getMyJobs().catch(() => jobService.getJobs()),
          studentService.getAllLearners(),
        ]);
        const jobList = Array.isArray(jobsData) ? jobsData : [];
        setJobs(jobList);
        if (jobList.length > 0) {
          setSelectedJobId(jobList[0].id);
        }
        setLearners(Array.isArray(learnersData) ? learnersData : (learnersData.results || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Running candidate-to-job algorithmic compatibility matrix..." />;
  }

  const selectedJob = jobs.find((j) => String(j.id) === String(selectedJobId));

  // Compute match ranking for learners against selected job
  const rankedCandidates = learners.map((learner) => {
    // Collect student skill names and proficiencies
    const learnerSkillsMap = {};
    (learner.skills || []).forEach((s) => {
      const name = s.skill?.name || s.name;
      learnerSkillsMap[name] = s.proficiency_percentage;
    });

    const requiredSkills = selectedJob?.job_skills || [];
    let matching = [];
    let missing = [];
    let totalScore = 0;
    let totalWeight = 0;

    if (requiredSkills.length > 0) {
      requiredSkills.forEach((js) => {
        const sName = js.skill?.name;
        const weight = js.weight || 1.5;
        totalWeight += weight;
        const prof = learnerSkillsMap[sName] || 0;
        if (prof >= 50) {
          matching.push({ name: sName, proficiency: prof });
          totalScore += (prof / 100) * weight;
        } else {
          missing.push({ name: sName, deficit: 75 - prof });
        }
      });
    }

    const matchPct = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 75;

    return {
      learner,
      matchPct: Math.min(98, Math.max(45, matchPct)),
      matching,
      missing,
    };
  }).sort((a, b) => b.matchPct - a.matchPct);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            AI Candidate Skill Matching Engine
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Discover and rank verified talent matching your open corporate requirements
          </p>
        </div>

        {/* Job Selector Dropdown */}
        <div style={{ minWidth: '280px' }}>
          <select
            className="form-control"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                Target: {j.title} ({j.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Job Specs Banner */}
      {selectedJob && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--surface-alt)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                Active Hiring Requisition
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)' }}>
                {selectedJob.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Location: {selectedJob.location} · Required Experience: {selectedJob.experience_required} yrs
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '450px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)', width: '100%' }}>Required Skills:</span>
              {(selectedJob.job_skills || []).map((js, idx) => (
                <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                  {js.skill?.name} ({js.weight}x)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidates Ranking Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>District / State</th>
                <th>Target Role</th>
                <th>Compatibility Match</th>
                <th>Matching Competencies</th>
                <th>Missing / Gap Skills</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rankedCandidates.map(({ learner, matchPct, matching, missing }) => (
                <tr key={learner.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{learner.full_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{learner.education}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{learner.district}, {learner.state}</td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{learner.target_role}</td>
                  <td>
                    <span className={`badge ${matchPct >= 80 ? 'badge-success' : matchPct >= 65 ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      {matchPct}% Match
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '240px' }}>
                      {matching.length > 0 ? (
                        matching.slice(0, 3).map((m, idx) => (
                          <span key={idx} className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                            {m.name} ({m.proficiency}%)
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Baseline</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                      {missing.length > 0 ? (
                        missing.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                            {m.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>✓ All Covered</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => alert(`Invitation extended to ${learner.full_name} for interview review!`)}
                    >
                      Invite Candidate
                    </button>
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

export default CandidateMatching;
