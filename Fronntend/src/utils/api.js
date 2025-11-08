import axios from 'axios';

// API Base URL - can be configured via environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      config.headers['user-id'] = user.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints for authentication
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      return { error: errorMessage };
    }
  },
  
  register: async (email, password, name, college, batch_year, user_type = 'student', years_experience = null, company_name = null) => {
    try {
      const response = await apiClient.post('/auth/register', { 
        email, 
        password, 
        name, 
        college: college || null, 
        batch_year: batch_year || null,
        user_type: user_type || 'student',
        years_experience: years_experience || null,
        company_name: company_name || null
      });
      
      if (response && response.data) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      
      return { error: 'Invalid response from server' };
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Registration failed. Please try again.';
      return { error: errorMessage };
    }
  },

  sendOTP: async (email, type = 'registration') => {
    try {
      const response = await apiClient.post('/auth/send-otp', { email, type });
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send OTP. Please try again.';
      return { error: errorMessage };
    }
  },

  verifyOTPRegister: async (email, otp, password, name, college, batch_year, user_type = 'student', years_experience = null, company_name = null) => {
    try {
      const response = await apiClient.post('/auth/verify-otp-register', {
        email,
        otp,
        password,
        name,
        college: college || null,
        batch_year: batch_year || null,
        user_type: user_type || 'student',
        years_experience: years_experience || null,
        company_name: company_name || null
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.error || 'Invalid OTP. Please try again.';
      return { error: errorMessage };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send OTP. Please try again.';
      return { error: errorMessage };
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.';
      return { error: errorMessage };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  updateProfile: async (updates) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return { error: 'Authentication required. Please log in again.' };
      }

      console.log('updateProfile - Sending updates:', JSON.stringify(updates, null, 2));
      
      // The interceptor already adds the Authorization header, so we don't need to add it again
      const response = await apiClient.put('/auth/me', updates);
      
      console.log('updateProfile - Response received:', response.data);
      
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('localStorageUpdated'));
      }
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      console.error('Error config:', error?.config);
      console.error('Request URL:', error?.config?.url);
      console.error('Request data:', error?.config?.data);
      console.error('Request headers:', error?.config?.headers);
      
      // Include debug info from backend if available
      const errorData = error?.response?.data || {};
      const errorMessage = errorData.error || error?.message || 'Failed to update profile. Please try again.';
      
      return { 
        error: errorMessage,
        debug: errorData.debug // Pass through debug info from backend
      };
    }
  }
};

// API endpoints for experiences
export const experiencesAPI = {
  // Get all experiences from all colleges
  getAllExperiences: async (params = {}) => {
    try {
      const response = await apiClient.get('/experiences/colleges', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
  },
  
  // Get experiences by college
  getExperiencesByCollege: async (collegeName, params = {}) => {
    try {
      const response = await apiClient.get(`/experiences/colleges/${encodeURIComponent(collegeName)}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences by college:', error);
      throw error;
    }
  },
  
  // Get all colleges
  getColleges: async (searchTerm = '', limit = 50) => {
    try {
      const response = await apiClient.get('/colleges', {
        params: {
          search: searchTerm,
          limit: limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  },
  
  // Create new experience
  createExperience: async (experienceData) => {
    try {
      const response = await apiClient.post('/experiences', experienceData);
      return response.data;
    } catch (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
  },
  
  // Get current user's experiences
  getMyExperiences: async () => {
    try {
      const response = await apiClient.get('/experiences/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching my experiences:', error);
      throw error;
    }
  },
  
  // Like an experience
  likeExperience: async (experienceId) => {
    try {
      const response = await apiClient.post(`/experiences/${experienceId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking experience:', error);
      throw error;
    }
  },

  // Delete an experience
  deleteExperience: async (experienceId) => {
    try {
      const response = await apiClient.delete(`/experiences/${experienceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  }
};

// API endpoints for learnings
export const learningsAPI = {
  // Generate AI-based plan
  generateAIPlan: async ({ technology, totalDays, dailyHours, explanationType }) => {
    try {
      const response = await apiClient.post('/learnings/generate', {
        technology,
        totalDays,
        dailyHours,
        explanationType,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating AI plan:', error);
      throw error;
    }
  },
  // Get all learning plans
  getAllPlans: async (userId = null) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await apiClient.get('/learnings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      throw error;
    }
  },
  
  // Get specific learning plan
  getPlan: async (planId) => {
    try {
      const response = await apiClient.get(`/learnings/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plan:', error);
      throw error;
    }
  },
  
  // Create new learning plan
  createPlan: async (planData) => {
    try {
      const response = await apiClient.post('/learnings', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan:', error);
      throw error;
    }
  },
  
  // Update learning plan
  updatePlan: async (planId, planData) => {
    try {
      const response = await apiClient.put(`/learnings/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Error updating learning plan:', error);
      throw error;
    }
  },
  
  // Delete learning plan
  deletePlan: async (planId) => {
    try {
      const response = await apiClient.delete(`/learnings/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting learning plan:', error);
      throw error;
    }
  }
};

export default apiClient;

