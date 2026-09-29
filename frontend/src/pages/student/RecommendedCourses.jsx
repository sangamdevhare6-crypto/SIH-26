import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Search, Filter, CheckCircle2, Clock, Award, ExternalLink } from 'lucide-react';
import { courseService } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecommendedCourses = () => {
  const [recommended, setRecommended] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal detail
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [recData, allData] = await Promise.all([
        courseService.getRecommendedCourses(),
        courseService.getCourses(),
      ]);
      setRecommended(Array.isArray(recData) ? recData : []);
      setAllCourses(Array.isArray(allData) ? allData : []);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = (course) => {
    setEnrolledCourseIds((prev) => new Set([...prev, course.id]));
    setEnrollSuccessMsg(`Successfully enrolled in "${course.title}". Your training progress has been recorded.`);
    setTimeout(() => setEnrollSuccessMsg(''), 5000);
  };

  const listToShow = activeTab === 'recommended' ? recommended : allCourses;

  const filteredCourses = listToShow.filter((c) => {
    return (
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner message="Curating personalized upskilling courses based on your skill gaps..." />;
  }

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)' }}>
            Personalized Upskilling & Courses
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            High-impact vocational & technical courses tailored to bridge your detected skill gaps
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--surface-alt)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setActiveTab('recommended')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'recommended' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'recommended' ? '#FFFFFF' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={14} /> Gap Recommendations ({recommended.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'all' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            All Courses ({allCourses.length})
          </button>
        </div>
      </div>

      {enrollSuccessMsg && (
        <div style={{
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #BBF7D0'
        }}>
          <CheckCircle2 size={18} />
          <span>{enrollSuccessMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.3rem' }}
            placeholder="Search by course title, tool, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <BookOpen size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>
            No courses found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Try adjusting your search criteria or switch to All Courses.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onEnroll={handleEnroll}
              onViewDetails={(item) => setSelectedCourse(item)}
              isEnrolled={enrolledCourseIds.has(c.id)}
            />
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse.title}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{selectedCourse.category}</span>
              <span className="badge badge-secondary">{selectedCourse.level}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {selectedCourse.description}
            </p>

            <div style={{ backgroundColor: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><strong>Provider:</strong> {selectedCourse.provider}</div>
                <div><strong>Duration:</strong> {selectedCourse.duration_weeks} weeks</div>
                <div><strong>Tuition:</strong> {selectedCourse.price === 0 ? 'Free (Govt Subsidized)' : `₹${selectedCourse.price}`}</div>
                <div><strong>Credential:</strong> Accredited Certificate</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCourse(null)}>
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleEnroll(selectedCourse);
                  setSelectedCourse(null);
                }}
              >
                Enroll in Course
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecommendedCourses;
