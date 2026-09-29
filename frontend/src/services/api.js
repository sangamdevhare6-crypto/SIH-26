import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kaushalsetu_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and unauthorized states
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('kaushalsetu_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('kaushalsetu_access_token', newAccess);
          api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh token expired or invalid
          localStorage.removeItem('kaushalsetu_access_token');
          localStorage.removeItem('kaushalsetu_refresh_token');
          localStorage.removeItem('kaushalsetu_user');
          localStorage.removeItem('kaushalsetu_profile');
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH SERVICE
// ==========================================
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  logout: async (refreshToken) => {
    try {
      await api.post('/auth/logout/', { refresh: refreshToken });
    } finally {
      localStorage.removeItem('kaushalsetu_access_token');
      localStorage.removeItem('kaushalsetu_refresh_token');
      localStorage.removeItem('kaushalsetu_user');
      localStorage.removeItem('kaushalsetu_profile');
    }
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  },
};

// ==========================================
// STUDENT & SKILL SERVICE
// ==========================================
export const studentService = {
  getProfile: async () => {
    const response = await api.get('/students/profile/');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/students/profile/', profileData);
    return response.data;
  },
  getSkills: async (studentId = null) => {
    const params = studentId ? { student_id: studentId } : {};
    const response = await api.get('/students/skills/', { params });
    return response.data;
  },
  addSkill: async (skillData) => {
    const response = await api.post('/students/skills/', skillData);
    return response.data;
  },
  updateSkill: async (id, data) => {
    const response = await api.put(`/students/skills/${id}/`, data);
    return response.data;
  },
  deleteSkill: async (id) => {
    const response = await api.delete(`/students/skills/${id}/`);
    return response.data;
  },
  getTrainingProgress: async () => {
    const response = await api.get('/students/training/');
    return response.data;
  },
  getAllLearners: async (params = {}) => {
    const response = await api.get('/students/all/', { params });
    return response.data;
  },
};

// ==========================================
// CATALOG SKILLS
// ==========================================
export const skillCatalogService = {
  getSkills: async (params = {}) => {
    const response = await api.get('/skills/', { params });
    return response.data;
  },
  getSkillDetail: async (id) => {
    const response = await api.get(`/skills/${id}/`);
    return response.data;
  },
};

// ==========================================
// ASSESSMENTS SERVICE
// ==========================================
export const assessmentService = {
  getAssessments: async () => {
    const response = await api.get('/assessments/');
    return response.data;
  },
  getAssessmentDetail: async (id) => {
    const response = await api.get(`/assessments/${id}/`);
    return response.data;
  },
  submitAssessment: async (data) => {
    const response = await api.post('/assessments/submit/', data);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/assessments/history/');
    return response.data;
  },
};

// ==========================================
// SKILL GAP SERVICE
// ==========================================
export const skillGapService = {
  getOverview: async (role = null) => {
    const params = role ? { role } : {};
    const response = await api.get('/skill-gap/', { params });
    return response.data;
  },
  analyzeGap: async (targetRole, studentId = null) => {
    const payload = { target_role: targetRole };
    if (studentId) payload.student_id = studentId;
    const response = await api.post('/skill-gap/analyze/', payload);
    return response.data;
  },
};

// ==========================================
// JOBS SERVICE
// ==========================================
export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs/', { params });
    return response.data;
  },
  getJobDetail: async (id) => {
    const response = await api.get(`/jobs/${id}/`);
    return response.data;
  },
  getRecommendedJobs: async (studentId = null) => {
    const params = studentId ? { student_id: studentId } : {};
    const response = await api.get('/jobs/recommended/', { params });
    return response.data;
  },
  getMyJobs: async () => {
    const response = await api.get('/jobs/my-jobs/');
    return response.data;
  },
  createJob: async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
  },
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}/`, jobData);
    return response.data;
  },
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}/`);
    return response.data;
  },
};

// ==========================================
// COURSES SERVICE
// ==========================================
export const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.get('/courses/', { params });
    return response.data;
  },
  getCourseDetail: async (id) => {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  },
  getRecommendedCourses: async (studentId = null) => {
    const params = studentId ? { student_id: studentId } : {};
    const response = await api.get('/courses/recommended/', { params });
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await api.post('/courses/', courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}/`, courseData);
    return response.data;
  },
};

// ==========================================
// APPLICATIONS SERVICE
// ==========================================
export const applicationService = {
  getApplications: async (params = {}) => {
    const response = await api.get('/applications/', { params });
    return response.data;
  },
  createApplication: async (data) => {
    const response = await api.post('/applications/', data);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/`, statusData);
    return response.data;
  },
  getOutcomes: async (params = {}) => {
    const response = await api.get('/applications/outcomes/', { params });
    return response.data;
  },
};

// ==========================================
// NOTIFICATIONS SERVICE
// ==========================================
export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read/`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all/');
    return response.data;
  },
};

// ==========================================
// ANALYTICS SERVICE
// ==========================================
export const analyticsService = {
  getStudentAnalytics: async (studentId = null) => {
    const params = studentId ? { student_id: studentId } : {};
    const response = await api.get('/analytics/student/', { params });
    return response.data;
  },
  getInstituteAnalytics: async (instituteId = null) => {
    const params = instituteId ? { institute_id: instituteId } : {};
    const response = await api.get('/analytics/institute/', { params });
    return response.data;
  },
  getEmployerAnalytics: async (employerId = null) => {
    const params = employerId ? { employer_id: employerId } : {};
    const response = await api.get('/analytics/employer/', { params });
    return response.data;
  },
  getGovernmentAnalytics: async (filters = {}) => {
    const response = await api.get('/analytics/government/', { params: filters });
    return response.data;
  },
};

// ==========================================
// REPORTS & CSV EXPORT URLS
// ==========================================
export const reportService = {
  getSkillGapCSVUrl: () => `${API_BASE_URL}/reports/skill-gap-csv/`,
  getEmploymentOutcomeCSVUrl: () => `${API_BASE_URL}/reports/employment-outcomes-csv/`,
  getTrainingImpactCSVUrl: () => `${API_BASE_URL}/reports/training-impact-csv/`,
  getIndustryDemandCSVUrl: () => `${API_BASE_URL}/reports/industry-demand-csv/`,
};

export default api;
