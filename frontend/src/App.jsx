import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common & Layouts
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Auth Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentSkills from './pages/student/StudentSkills';
import SkillAssessment from './pages/student/SkillAssessment';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import RecommendedCourses from './pages/student/RecommendedCourses';
import RecommendedJobs from './pages/student/RecommendedJobs';
import StudentApplications from './pages/student/StudentApplications';
import CareerGrowth from './pages/student/CareerGrowth';

// Institute Pages
import InstituteDashboard from './pages/institute/InstituteDashboard';
import InstituteCourses from './pages/institute/InstituteCourses';
import InstituteLearners from './pages/institute/InstituteLearners';
import TrainingImpact from './pages/institute/TrainingImpact';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerJobs from './pages/employer/EmployerJobs';
import EmployerApplications from './pages/employer/EmployerApplications';
import CandidateMatching from './pages/employer/CandidateMatching';

// Government / Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import GovernmentImpact from './pages/admin/GovernmentImpact';
import IndustryDemand from './pages/admin/IndustryDemand';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Portal (Role: student) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['student']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="skills" element={<StudentSkills />} />
            <Route path="assessment" element={<SkillAssessment />} />
            <Route path="skill-gap" element={<SkillGapAnalysis />} />
            <Route path="courses" element={<RecommendedCourses />} />
            <Route path="jobs" element={<RecommendedJobs />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="career-growth" element={<CareerGrowth />} />
          </Route>

          {/* Training Institute Portal (Role: institute) */}
          <Route
            path="/institute"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['institute']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/institute/dashboard" replace />} />
            <Route path="dashboard" element={<InstituteDashboard />} />
            <Route path="courses" element={<InstituteCourses />} />
            <Route path="learners" element={<InstituteLearners />} />
            <Route path="impact" element={<TrainingImpact />} />
          </Route>

          {/* Employer Portal (Role: employer) */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['employer']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/employer/dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="jobs" element={<EmployerJobs />} />
            <Route path="applications" element={<EmployerApplications />} />
            <Route path="candidates" element={<CandidateMatching />} />
          </Route>

          {/* Government / Admin Portal (Role: admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['admin']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="impact" element={<GovernmentImpact />} />
            <Route path="industry-demand" element={<IndustryDemand />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
