import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  student: { email: 'student@demo.com', password: 'Demo@12345', label: 'Learner / Student', role: 'student' },
  institute: { email: 'institute@demo.com', password: 'Demo@12345', label: 'Training Institute', role: 'institute' },
  employer: { email: 'employer@demo.com', password: 'Demo@12345', label: 'Hiring Employer', role: 'employer' },
  admin: { email: 'admin@demo.com', password: 'Demo@12345', label: 'Government / Admin', role: 'admin' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kaushalsetu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kaushalsetu_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // Sync / refresh profile on app mount
  useEffect(() => {
    const token = localStorage.getItem('kaushalsetu_access_token');
    if (token) {
      authService.getProfile()
        .then((data) => {
          setUser(data);
          localStorage.setItem('kaushalsetu_user', JSON.stringify(data));
          if (data.student_profile) {
            setProfile(data.student_profile);
            localStorage.setItem('kaushalsetu_profile', JSON.stringify(data.student_profile));
          } else if (data.institute_profile) {
            setProfile(data.institute_profile);
            localStorage.setItem('kaushalsetu_profile', JSON.stringify(data.institute_profile));
          } else if (data.employer_profile) {
            setProfile(data.employer_profile);
            localStorage.setItem('kaushalsetu_profile', JSON.stringify(data.employer_profile));
          }
        })
        .catch(() => {
          // Token invalid or expired
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    const handleForceLogout = () => {
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('kaushalsetu_access_token', data.tokens.access);
    localStorage.setItem('kaushalsetu_refresh_token', data.tokens.refresh);
    localStorage.setItem('kaushalsetu_user', JSON.stringify(data.user));
    if (data.profile) {
      localStorage.setItem('kaushalsetu_profile', JSON.stringify(data.profile));
      setProfile(data.profile);
    }
    setUser(data.user);
    return data;
  };

  const loginAs = async (roleKey) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    if (!cred) throw new Error('Unknown demo role: ' + roleKey);
    return await login(cred.email, cred.password);
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('kaushalsetu_access_token', data.tokens.access);
    localStorage.setItem('kaushalsetu_refresh_token', data.tokens.refresh);
    localStorage.setItem('kaushalsetu_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('kaushalsetu_refresh_token');
    await authService.logout(refresh);
    setUser(null);
    setProfile(null);
  };

  const updateLocalProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('kaushalsetu_profile', JSON.stringify(newProfile));
  };

  const value = {
    user,
    profile,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    loginAs,
    register,
    logout,
    updateLocalProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
