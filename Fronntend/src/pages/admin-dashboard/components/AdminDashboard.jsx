import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, BookOpen, Calendar, Settings, 
  BarChart3, Shield, AlertCircle, CheckCircle, XCircle,
  Search, Filter, Download, Edit, Trash2, Eye, RefreshCw,
  TrendingUp, TrendingDown, UserPlus, FileText, Mail
} from 'lucide-react';

// Mock API client
const adminAPI = {
  getStats: async () => ({
    users: { total: 1247, active: 892, new: 45 },
    experiences: { total: 456, pending: 12, approved: 444 },
    plans: { total: 789, active: 523, completed: 266 },
    events: { total: 34, upcoming: 18, past: 16 }
  }),
  getUsers: async () => JSON.parse(localStorage.getItem('all_users') || '[]'),
  getExperiences: async () => JSON.parse(localStorage.getItem('company_experiences') || '[]'),
  getPlans: async () => JSON.parse(localStorage.getItem('prep_plans') || '[]'),
  updateUser: async (userId, data) => {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
    localStorage.setItem('all_users', JSON.stringify(updated));
    return updated.find(u => u.id === userId);
  },
  deleteUser: async (userId) => {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('all_users', JSON.stringify(filtered));
  },
  deleteExperience: async (expId) => {
    const exps = JSON.parse(localStorage.getItem('company_experiences') || '[]');
    const filtered = exps.filter(e => e.id !== expId);
    localStorage.setItem('company_experiences', JSON.stringify(filtered));
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, expsData, plansData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getExperiences(),
        adminAPI.getPlans()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setExperiences(expsData);
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.users?.total || 0}
          change="+12%"
          trend="up"
          color="blue"
        />
        <StatCard
          icon={FileText}
          title="Experiences"
          value={stats?.experiences?.total || 0}
          change="+8%"
          trend="up"
          color="purple"
        />
        <StatCard
          icon={BookOpen}
          title="Learning Plans"
          value={stats?.plans?.total || 0}
          change="+15%"
          trend="up"
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Events"
          value={stats?.events?.total || 0}
          change="-3%"
          trend="down"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'John Doe', action: 'shared an experience', time: '5m ago' },
              { user: 'Jane Smith', action: 'created a learning plan', time: '12m ago' },
              { user: 'Alex Johnson', action: 'registered for event', time: '23m ago' },
              { user: 'Sarah Williams', action: 'completed DSA module', time: '1h ago' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <HealthItem label="API Status" status="healthy" value="99.9% uptime" />
            <HealthItem label="Database" status="healthy" value="All systems operational" />
            <HealthItem label="Storage" status="warning" value="78% used" />
            <HealthItem label="Response Time" status="healthy" value="145ms avg" />
          </div>
        </div>
      </div>
    </div>
  );

  // Users Management Tab
  const UsersTab = () => {
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
      if (searchQuery) {
        setFilteredUsers(users.filter(u => 
          u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } else {
        setFilteredUsers(users);
      }
    }, [searchQuery, users]);

    const handleDeleteUser = async (userId) => {
      if (confirm('Are you sure you want to delete this user?')) {
        await adminAPI.deleteUser(userId);
        await loadData();
      }
    };

    const handleToggleActive = async (userId, isActive) => {
      await adminAPI.updateUser(userId, { is_active: !isActive });
      await loadData();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role || 'student'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded text-red-600"
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
    );
  };

  // Experiences Management Tab
  const ExperiencesTab = () => {
    const handleDelete = async (expId) => {
      if (confirm('Are you sure you want to delete this experience?')) {
        await adminAPI.deleteExperience(expId);
        await loadData();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Experience Management</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{exp.company_name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {exp.position_title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{exp.preparation_tips?.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👤 {exp.user_profiles?.full_name || 'Anonymous'}</span>
                    <span>📅 {new Date(exp.created_at).toLocaleDateString()}</span>
                    <span>👍 {exp.likes_count || 0} likes</span>
                    <span>🎯 {exp.overall_difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 hover:bg-red-50 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <SettingItem label="Site Name" value="QuickHire" />
            <SettingItem label="Site URL" value="https://quickhire.com" />
            <SettingItem label="Admin Email" value="admin@quickhire.com" />
            <SettingItem label="Time Zone" value="UTC-5 (EST)" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Email Settings</h3>
          <div className="space-y-4">
            <ToggleSetting label="Send Welcome Emails" enabled={true} />
            <ToggleSetting label="Send Weekly Digests" enabled={true} />
            <ToggleSetting label="Send Event Reminders" enabled={false} />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Content Moderation</h3>
          <div className="space-y-4">
            <ToggleSetting label="Auto-approve Experiences" enabled={false} />
            <ToggleSetting label="Profanity Filter" enabled={true} />
            <ToggleSetting label="Spam Detection" enabled={true} />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
              Clear All Cache
            </button>
            <button className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
              Reset Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'experiences', label: 'Experiences', icon: FileText },
    { id: 'plans', label: 'Learning Plans', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">QuickHire Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mail className="w-5 h-5" />
              </button>
              <button 
                onClick={loadData}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'experiences' && <ExperiencesTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'plans' && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Learning Plans management coming soon...</p>
          </div>
        )}
        {activeTab === 'events' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Events management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, title, value, change, trend, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-sm">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

const HealthItem = ({ label, status, value }) => {
  const statusColors = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700'
  };

  const StatusIcon = status === 'healthy' ? CheckCircle : status === 'warning' ? AlertCircle : XCircle;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <StatusIcon className={`w-5 h-5 ${status === 'healthy' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">{value}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

const SettingItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);

const ToggleSetting = ({ label, enabled }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default AdminDashboard;