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
  },

  // Get "How to Impress" tip from LLM API
  getImpressTip: async (question, technology, answer, explanationType = 'beginner') => {
    try {
      const response = await apiClient.post('/learnings/impress-tip', {
        question,
        technology,
        answer,
        explanationType
      });
      return response.data?.impressTip || response.data?.tip || null;
    } catch (error) {
      console.error('Error fetching impress tip:', error);
      // Return fallback tip if API fails
      return `Demonstrate deep understanding by connecting this concept to real-world applications and showing how it relates to ${technology} best practices.`;
    }
  }
};

// API endpoints for events
export const eventsAPI = {
  // Fetch events from Eventbrite API (requires API key)
  getEventbriteEvents: async (searchQuery = 'technology', location = 'India') => {
    try {
      const token = import.meta.env.VITE_EVENTBRITE_TOKEN;
      
      // Skip if no token is provided
      if (!token || token === 'YOUR_TOKEN_HERE') {
        return null;
      }

      const queryParams = new URLSearchParams({
        q: searchQuery,
        'location.address': location || 'India',
        'sort_by': 'date',
        'expand': 'venue,organizer',
        'status': 'live'
      });
      
      const response = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Eventbrite API error:', error);
      return null;
    }
  },

  // Fetch from public events aggregator (no auth required)
  getPublicTechEvents: async () => {
    try {
      // Using Eventful API (public, no auth required for basic searches)
      // Alternative: You can also use Meetup API, Eventbrite public search, etc.
      const response = await fetch(
        `https://api.eventful.com/json/events/search?app_key=${import.meta.env.VITE_EVENTFUL_KEY || 'YOUR_KEY'}&keywords=technology+programming+software&date=Future&page_size=50&sort_order=date`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Public events API error:', error);
      return null;
    }
  },

  // Transform Eventbrite events to our format
  transformEventbriteEvent: (eventbriteEvent) => {
    const venue = eventbriteEvent.venue || {};
    const startDate = eventbriteEvent.start ? new Date(eventbriteEvent.start.local) : new Date();
    
    return {
      id: eventbriteEvent.id,
      title: eventbriteEvent.name?.text || 'Untitled Event',
      company: eventbriteEvent.organizer?.name || 'Event Organizer',
      companyLogo: eventbriteEvent.logo?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      type: eventbriteEvent.category_id ? 'webinar' : 'networking',
      date: startDate.toISOString().split('T')[0],
      time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      duration: eventbriteEvent.end ? 
        `${Math.round((new Date(eventbriteEvent.end.local) - new Date(eventbriteEvent.start.local)) / (1000 * 60 * 60))} hours` : 
        '2 hours',
      format: venue.address ? 'offline' : 'online',
      location: venue.address ? 
        `${venue.address.localized_area_display || ''} ${venue.address.city || ''}, ${venue.address.region || ''}`.trim() : 
        null,
      description: eventbriteEvent.description?.text || eventbriteEvent.summary || 'No description available.',
      participants: eventbriteEvent.capacity || 0,
      registrationDeadline: eventbriteEvent.end_sales_date || eventbriteEvent.start?.local,
      cost: eventbriteEvent.is_free ? null : (eventbriteEvent.ticket_availability?.minimum_ticket_price?.display || 'Free'),
      isRegistered: false,
      requirements: [],
      speakers: [],
      url: eventbriteEvent.url || null
    };
  }
};

export default apiClient;

