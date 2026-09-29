import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle
} from 'lucide-react';
import { assessmentService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const SkillAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { question_id: 'A' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessments();
      setAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async (assessment) => {
    try {
      setLoading(true);
      setSelectedAssessment(assessment);
      const detail = await assessmentService.getAssessmentDetail(assessment.id);
      setAssessmentDetail(detail);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.error('Failed to load assessment detail', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    setIsConfirmSubmitOpen(false);
    try {
      setSubmitting(true);
      const submissionData = {
        assessment_id: selectedAssessment.id,
        answers: answers,
      };
      const res = await assessmentService.submitAssessment(submissionData);
      setResult(res);
    } catch (err) {
      console.error('Failed to submit assessment', err);
      alert('Error submitting assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAssessment(null);
    setAssessmentDetail(null);
    setResult(null);
    setAnswers({});
    fetchAssessments();
  };

  if (loading) {
    return <LoadingSpinner message="Loading assessment questions & diagnostic criteria..." />;
  }

  // ==========================================
  // MODE 3: RESULTS VIEW
  // ==========================================
  if (result) {
    const isPassed = result.passed;
    return (
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: isPassed ? 'var(--success-light)' : 'var(--warning-light)',
            color: isPassed ? 'var(--success)' : '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            {isPassed ? <CheckCircle2 size={38} /> : <AlertCircle size={38} />}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.4rem' }}>
            Assessment Completed!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {selectedAssessment?.title} · Tested against national skill benchmarks
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isPassed ? '#F0FDF4' : '#FFFBEB',
            border: `1.5px solid ${isPassed ? '#BBF7D0' : '#FDE68A'}`,
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: isPassed ? 'var(--success)' : '#D97706', fontFamily: 'var(--font-heading)' }}>
              {result.score_percentage}%
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: isPassed ? '#166534' : '#92400E' }}>
              ({result.correct_answers} / {result.total_questions} Correct)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span className={`badge ${isPassed ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {isPassed ? '✓ Proficiency Verified & Certified' : '⚠ Skill Gap Detected (Needs Practice)'}
            </span>
          </div>

          {/* Categorized Skills Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
            {/* Strong Skills */}
            <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Strong Skills
              </div>
              {result.strong_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {result.strong_skills.map((s, idx) => (
                    <span key={idx} className="badge badge-success" style={{ fontSize: '0.75rem' }}>{s}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None identified</span>
              )}
            </div>

            {/* Moderate Skills */}
            <div style={{ padding: '1rem', backgroundColor: '#FEFCE8', borderRadius: 'var(--radius-md)', border: '1px solid #FEF08A' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Moderate Skills
              </div>
              {result.moderate_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {result.moderate_skills.map((s, idx) => (
                    <span key={idx} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{s}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None identified</span>
              )}
            </div>

            {/* Weak Skills */}
            <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Skill Gaps / Weak
              </div>
              {result.weak_skills?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {result.weak_skills.map((s, idx) => (
                    <span key={idx} className="badge badge-danger" style={{ fontSize: '0.75rem' }}>{s}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No gaps detected</span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/student/skill-gap" className="btn btn-primary">
              <Layers size={16} /> View Updated Skill Gap Analysis
            </Link>
            <Link to="/student/courses" className="btn btn-secondary">
              <BookOpen size={16} /> Recommended Upskilling Courses
            </Link>
            <button className="btn btn-secondary" onClick={handleReset}>
              Take Another Test
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
            Question-by-Question Review & Explanations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {result.detailed_breakdown?.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${q.is_correct ? '#BBF7D0' : '#FECACA'}`,
                  backgroundColor: q.is_correct ? '#F0FDF4' : '#FEF2F2'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: q.is_correct ? 'var(--success)' : 'var(--danger)' }}>
                    Question {idx + 1} · {q.sub_skill}
                  </span>
                  <span className={`badge ${q.is_correct ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                    {q.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '0.75rem' }}>
                  {q.question_text}
                </div>

                <div style={{ fontSize: '0.85rem', display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                  <span>Your Answer: <strong>Option {q.selected_option || 'None'}</strong></span>
                  <span>Correct Answer: <strong style={{ color: 'var(--success)' }}>Option {q.correct_option}</strong></span>
                </div>

                {q.explanation && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 2: LIVE TEST TAKING
  // ==========================================
  if (selectedAssessment && assessmentDetail) {
    const questions = assessmentDetail.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const totalQ = questions.length;
    const answeredCount = Object.keys(answers).length;

    if (!currentQ) {
      return <div>No questions available.</div>;
    }

    const options = [
      { key: 'A', text: currentQ.option_a },
      { key: 'B', text: currentQ.option_b },
      { key: 'C', text: currentQ.option_c },
      { key: 'D', text: currentQ.option_d },
    ];

    return (
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Test Header */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                {selectedAssessment.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>
                {selectedAssessment.title}
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
                Question {currentQuestionIndex + 1} of {totalQ}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {answeredCount} answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${((currentQuestionIndex + 1) / totalQ) * 100}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 200ms ease'
              }}
            />
          </div>
        </div>

        {/* Question Palette */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isCurrent ? 'var(--primary-light)' : (isAnswered ? 'var(--success-light)' : 'var(--surface)'),
                  color: isCurrent ? 'var(--primary)' : (isAnswered ? 'var(--success)' : 'var(--text-muted)'),
                  cursor: 'pointer'
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
              Sub-competency: {currentQ.sub_skill || 'Core Knowledge'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
            {currentQ.question_text}
          </h3>

          {/* MCQ Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQ.id, opt.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-dark)'}`,
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--navy)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {opt.key}
                  </div>
                  <span style={{ fontSize: '0.92rem', color: isSelected ? 'var(--navy)' : 'var(--text-main)', fontWeight: isSelected ? 600 : 400 }}>
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              <ArrowLeft size={16} /> Previous Question
            </button>

            {currentQuestionIndex < totalQ - 1 ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-success btn-sm"
                onClick={() => setIsConfirmSubmitOpen(true)}
              >
                Review & Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isConfirmSubmitOpen}
          onClose={() => setIsConfirmSubmitOpen(false)}
          title="Submit Skill Assessment"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              You have answered <strong>{answeredCount}</strong> out of <strong>{totalQ}</strong> questions.
            </p>
            {answeredCount < totalQ && (
              <div style={{ backgroundColor: 'var(--warning-light)', color: '#B45309', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠ You still have {totalQ - answeredCount} unanswered questions. Unanswered questions are scored as 0.
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Submitting will automatically calculate your verified score, update your learner profile, and adjust your skill gap diagnostics.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsConfirmSubmitOpen(false)}>
              Keep Answering
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Scoring Answers...' : 'Confirm & Submit'}
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  // ==========================================
  // MODE 1: CATALOG OF ASSESSMENTS
  // ==========================================
  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
          Standardized Diagnostic Skill Assessments
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Assessments calculate formal competency scores (0-100%) stored directly in your verifiable profile
        </p>
      </div>

      <div className="grid-3">
        {assessments.map((a) => (
          <div key={a.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                {a.category}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Passing: {a.passing_score}%
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>
              {a.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
              {a.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: 'auto' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <HelpCircle size={15} style={{ color: 'var(--primary)' }} /> {a.total_questions || 5} Questions
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={15} style={{ color: 'var(--indigo)' }} /> {a.duration_minutes || 15} Mins
              </span>
            </div>

            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => handleStartAssessment(a)}
            >
              Start Diagnostic Test <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillAssessment;
