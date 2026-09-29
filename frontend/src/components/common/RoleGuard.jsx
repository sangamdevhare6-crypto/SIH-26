import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();
  const currentRole = user?.role;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    // Redirect user to their own role dashboard
    if (currentRole === 'student') return <Navigate to="/student/dashboard" replace />;
    if (currentRole === 'institute') return <Navigate to="/institute/dashboard" replace />;
    if (currentRole === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleGuard;
