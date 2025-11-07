import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', college: '', batch_year: '' });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        college: user?.college || '',
        batch_year: user?.batch_year ? String(user.batch_year) : ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStatus({ success: '', error: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setStatus({ success: '', error: 'Name is required.' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        college: formData.college ? formData.college.trim() : '',
        batch_year: formData.batch_year ? parseInt(formData.batch_year, 10) : null
      };
      const response = await authAPI.updateProfile(payload);
      if (response?.error) {
        setStatus({ success: '', error: response.error });
      } else if (response?.user) {
        updateUser(response.user);
        setStatus({ success: 'Profile updated successfully.', error: '' });
      }
    } catch (error) {
      setStatus({ success: '', error: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold uppercase">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {status.error && (
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-sm text-green-700">
                {status.success}
              </div>
            )}

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => handleChange('college', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., IIT Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.batch_year}
                    onChange={(e) => handleChange('batch_year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="2025"
                    min="2000"
                    max="2100"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Password</p>
                <p className="text-sm text-gray-600">For security reasons, passwords can’t be displayed. Use the "Forgot password" option on the login page to reset it.</p>
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;

