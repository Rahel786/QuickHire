// Fronntend/src/utils/adminApi.js
import { apiClient } from './api';

export const adminAPI = {
  // Dashboard Stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Fallback to localStorage
      return {
        users: { total: 0, active: 0, new: 0 },
        experiences: { total: 0, pending: 0, approved: 0 },
        plans: { total: 0, active: 0, completed: 0 },
        events: { total: 0, upcoming: 0, past: 0 }
      };
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('all_users') || '[]');
      return { users, total: users.length };
    }
  },

  getUser: async (userId) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, data);
      
      // Also update localStorage
      const users = JSON.parse(localStorage.getItem('all_users') || '[]');
      const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
      localStorage.setItem('all_users', JSON.stringify(updated));
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      
      // Also update localStorage
      const users = JSON.parse(localStorage.getItem('all_users') || '[]');
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem('all_users', JSON.stringify(filtered));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Experience Management
  getExperiences: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/experiences', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      const exps = JSON.parse(localStorage.getItem('company_experiences') || '[]');
      return { experiences: exps, total: exps.length };
    }
  },

  updateExperience: async (expId, data) => {
    try {
      const response = await apiClient.put(`/admin/experiences/${expId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  },

  deleteExperience: async (expId) => {
    try {
      const response = await apiClient.delete(`/admin/experiences/${expId}`);
      
      // Also update localStorage
      const exps = JSON.parse(localStorage.getItem('company_experiences') || '[]');
      const filtered = exps.filter(e => e.id !== expId);
      localStorage.setItem('company_experiences', JSON.stringify(filtered));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  },

  // Learning Plan Management
  getPlans: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/plans', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      const plans = JSON.parse(localStorage.getItem('prep_plans') || '[]');
      return { plans, total: plans.length };
    }
  },

  deletePlan: async (planId) => {
    try {
      const response = await apiClient.delete(`/admin/plans/${planId}`);
      
      // Also update localStorage
      const plans = JSON.parse(localStorage.getItem('prep_plans') || '[]');
      const filtered = plans.filter(p => p.id !== planId);
      localStorage.setItem('prep_plans', JSON.stringify(filtered));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  },

  // Activity Log
  getActivity: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/activity', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      return { activities: [] };
    }
  },

  // Analytics
  getAnalytics: async (period = '7d') => {
    try {
      const response = await apiClient.get('/admin/analytics', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        period,
        growth: { users: 0, experiences: 0, plans: 0 },
        topCompanies: [],
        topColleges: []
      };
    }
  }
};

