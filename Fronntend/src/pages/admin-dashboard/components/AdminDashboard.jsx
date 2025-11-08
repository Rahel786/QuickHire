import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, BookOpen, Calendar, TrendingUp, 
  AlertCircle, CheckCircle, XCircle, Search, Filter,
  BarChart3, PieChart, Activity, Settings, Shield,
  Download, RefreshCw, Eye, Edit, Trash2, Plus
} from 'lucide-react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API client with auth
const apiClient = {
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get: (endpoint) => apiClient.request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' })
};

// Admin API calls
const adminAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      // Make parallel requests for different stats
      const [usersRes, experiencesRes, learningsRes] = await Promise.all([
        apiClient.get('/admin/users/stats').catch(() => null),
        apiClient.get('/admin/experiences/stats').catch(() => null),
        apiClient.get('/admin/learnings/stats').catch(() => null)
      ]);

      // Calculate stats from responses
      return {
        totalUsers: usersRes?.total || 0,
        activeUsers: usersRes?.active || 0,
        totalExperiences: experiencesRes?.total || 0,
        totalLearningPlans: learningsRes?.total || 0,
        totalEvents: 0, // Update when events API is ready
        newUsersThisMonth: usersRes?.newThisMonth || 0,
        experiencesThisWeek: experiencesRes?.thisWeek || 0,
        activeEventsToday: 0 // Update when events API is ready
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return default stats on error
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalExperiences: 0,
        totalLearningPlans: 0,
        totalEvents: 0,
        newUsersThisMonth: 0,
        experiencesThisWeek: 0,
        activeEventsToday: 0
      };
    }
  },
  
  // Get users with search and pagination
  getUsers: async (page = 1, search = '') => {
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }) });
      const data = await apiClient.get(`/admin/users?${params}`);
      
      return {
        users: (data.users || []).map(user => ({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          company: user.company_name,
          status: user.is_active ? 'active' : 'inactive',
          joinedAt: new Date(user.createdAt || user.created_at).toLocaleDateString(),
          lastActive: user.updatedAt ? getTimeAgo(new Date(user.updatedAt)) : 'Never'
        })),
        total: data.total || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 10
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], total: 0, page: 1, pageSize: 10 };
    }
  },
  
  // Get experiences with filtering
  getExperiences: async (page = 1, status = 'all') => {
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(status !== 'all' && { status }) });
      const data = await apiClient.get(`/admin/experiences?${params}`);
      
      return {
        experiences: (data.experiences || []).map(exp => ({
          id: exp._id || exp.id,
          title: exp.position_title || 'Untitled',
          company: exp.company_name,
          author: exp.user_id?.name || 'Anonymous',
          status: exp.status,
          likes: exp.likes_count || 0,
          views: exp.views || 0,
          createdAt: new Date(exp.createdAt || exp.created_at).toLocaleDateString()
        })),
        total: data.total || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 10
      };
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return { experiences: [], total: 0, page: 1, pageSize: 10 };
    }
  },
  
  // Get learning plans
  getLearningPlans: async (page = 1) => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      const data = await apiClient.get(`/admin/learnings?${params}`);
      
      return {
        plans: (data.plans || []).map(plan => ({
          id: plan._id || plan.id,
          title: plan.plan_title,
          technology: plan.technologies?.name,
          user: plan.user_id?.name || 'Unknown',
          totalDays: plan.total_days,
          progress: plan.progress || 0,
          status: plan.status,
          createdAt: new Date(plan.createdAt || plan.created_at).toLocaleDateString()
        })),
        total: data.total || 0
      };
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      return { plans: [], total: 0 };
    }
  },
  
  // Delete user
  deleteUser: async (id) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  },
  
  // Update user status
  updateUserStatus: async (id, status) => {
    try {
      const is_active = status === 'active';
      await apiClient.put(`/admin/users/${id}`, { is_active });
      return { success: true, message: 'User status updated' };
    } catch (error) {
      throw new Error(error.message || 'Failed to update user status');
    }
  },
  
  // Delete experience
  deleteExperience: async (id) => {
    try {
      await apiClient.delete(`/admin/experiences/${id}`);
      return { success: true, message: 'Experience deleted successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete experience');
    }
  },
  
  // Update experience status
  updateExperienceStatus: async (id, status) => {
    try {
      await apiClient.put(`/admin/experiences/${id}`, { status });
      return { success: true, message: 'Experience status updated' };
    } catch (error) {
      throw new Error(error.message || 'Failed to update experience status');
    }
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const statsData = await adminAPI.getStats();
        setStats(statsData);
      } else if (activeTab === 'users') {
        const usersData = await adminAPI.getUsers(1, searchQuery);
        setUsers(usersData.users);
      } else if (activeTab === 'experiences') {
        const expData = await adminAPI.getExperiences(1, filterStatus);
        setExperiences(expData.experiences);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiClient.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiClient.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">QuickHire Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <RefreshCw className="w-5 h-5" onClick={loadData} />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'experiences', label: 'Experiences', icon: BookOpen },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Users}
                    label="Total Users"
                    value={stats.totalUsers}
                    change={12.5}
                    color="bg-blue-600"
                  />
                  <StatCard
                    icon={Activity}
                    label="Active Users"
                    value={stats.activeUsers}
                    change={8.2}
                    color="bg-green-600"
                  />
                  <StatCard
                    icon={BookOpen}
                    label="Total Experiences"
                    value={stats.totalExperiences}
                    change={15.3}
                    color="bg-purple-600"
                  />
                  <StatCard
                    icon={Calendar}
                    label="Total Events"
                    value={stats.totalEvents}
                    change={-2.4}
                    color="bg-orange-600"
                  />
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900">New user registered</p>
                          <p className="text-xs text-gray-500">alex@example.com • 5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900">New experience shared</p>
                          <p className="text-xs text-gray-500">Google SDE Interview • 1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900">Event registration</p>
                          <p className="text-xs text-gray-500">AI/ML Webinar • 3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Users (This Month)</span>
                        <span className="font-semibold text-gray-900">{stats.newUsersThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Experiences (This Week)</span>
                        <span className="font-semibold text-gray-900">{stats.experiencesThisWeek}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Events (Today)</span>
                        <span className="font-semibold text-gray-900">{stats.activeEventsToday}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Learning Plans</span>
                        <span className="font-semibold text-gray-900">{stats.totalLearningPlans}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && loadData()}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College/Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.college || user.company || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.status)}
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.status === 'active' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {user.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastActive}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Experiences Tab */}
            {activeTab === 'experiences' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {experiences.map((exp) => (
                        <tr key={exp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{exp.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{exp.company}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{exp.author}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              exp.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {exp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {exp.likes} likes • {exp.views} views
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'events' || activeTab === 'analytics') && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'events' ? 'Events Management' : 'Analytics Dashboard'}
                </h3>
                <p className="text-gray-600">
                  This section is under development. Coming soon!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;