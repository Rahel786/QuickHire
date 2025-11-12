import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import Button from '../components/ui/Button';
import { Code, Briefcase, Edit2, CheckCircle2, X } from 'lucide-react';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', college: '', batch_year: '' });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [saving, setSaving] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);
  const [editingRoles, setEditingRoles] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const technicalSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript',
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'Spring Boot', 'ASP.NET', 'Ruby on Rails', 'PHP', 'Laravel',
    'HTML/CSS', 'Tailwind CSS', 'Bootstrap', 'SASS/SCSS',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'REST APIs', 'GraphQL', 'Microservices', 'System Design',
    'Machine Learning', 'Data Science', 'AI/ML', 'TensorFlow', 'PyTorch',
    'Mobile Development', 'iOS', 'Android', 'React Native', 'Flutter',
    'DevOps', 'Linux', 'Shell Scripting', 'Testing', 'Agile/Scrum'
  ];

  const roleTypes = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Cloud Engineer', 'Data Engineer', 'Data Scientist',
    'Machine Learning Engineer', 'AI Engineer', 'Mobile Developer',
    'QA Engineer', 'Test Engineer', 'Security Engineer', 'SRE',
    'Product Manager', 'Technical Product Manager', 'Engineering Manager',
    'Solution Architect', 'System Architect', 'Tech Lead', 'Staff Engineer',
    'UI/UX Designer', 'Product Designer', 'Data Analyst', 'Business Analyst'
  ];

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
      setSelectedSkills(user?.technical_skills || []);
      setSelectedRoles(user?.interested_roles || []);
    }
  }, [user]);

  // Reset form when exiting edit mode without saving
  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user?.name || '',
        college: user?.college || '',
        batch_year: user?.batch_year ? String(user.batch_year) : ''
      });
      setSelectedSkills(user?.technical_skills || []);
      setSelectedRoles(user?.interested_roles || []);
    }
    setEditingSkills(false);
    setEditingRoles(false);
    setIsEditingProfile(false);
    setStatus({ success: '', error: '' });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStatus({ success: '', error: '' });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSaveSkills = async () => {
    setSavingSkills(true);
    setStatus({ success: '', error: '' });
    try {
      const payload = {
        technical_skills: selectedSkills
      };
      const response = await authAPI.updateProfile(payload);
      if (response?.error) {
        setStatus({ success: '', error: response.error });
      } else if (response?.user) {
        updateUser(response.user);
        setStatus({ success: 'Skills updated successfully.', error: '' });
        setEditingSkills(false);
      }
    } catch (error) {
      setStatus({ success: '', error: 'Failed to update skills. Please try again.' });
    } finally {
      setSavingSkills(false);
    }
  };

  const handleSaveRoles = async () => {
    setSavingRoles(true);
    setStatus({ success: '', error: '' });
    try {
      const payload = {
        interested_roles: selectedRoles
      };
      const response = await authAPI.updateProfile(payload);
      if (response?.error) {
        setStatus({ success: '', error: response.error });
      } else if (response?.user) {
        updateUser(response.user);
        setStatus({ success: 'Job roles updated successfully.', error: '' });
        setEditingRoles(false);
      }
    } catch (error) {
      setStatus({ success: '', error: 'Failed to update job roles. Please try again.' });
    } finally {
      setSavingRoles(false);
    }
  };

  const handleCancelSkills = () => {
    setSelectedSkills(user?.technical_skills || []);
    setEditingSkills(false);
  };

  const handleCancelRoles = () => {
    setSelectedRoles(user?.interested_roles || []);
    setEditingRoles(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setStatus({ success: '', error: 'Name is required.' });
      return;
    }
    
    if (selectedSkills.length === 0) {
      setStatus({ success: '', error: 'Please select at least one technical skill.' });
      return;
    }
    
    if (selectedRoles.length === 0) {
      setStatus({ success: '', error: 'Please select at least one job role.' });
      return;
    }
    
    // Don't submit if skills or roles are being saved
    if (savingSkills || savingRoles) {
      return;
    }
    
    setSaving(true);
    setStatus({ success: '', error: '' });
    
    try {
      // Update all profile data at once
      const payload = {
        name: formData.name.trim(),
        college: formData.college ? formData.college.trim() : '',
        batch_year: formData.batch_year ? parseInt(formData.batch_year, 10) : null,
        technical_skills: selectedSkills,
        interested_roles: selectedRoles
      };
      
      const response = await authAPI.updateProfile(payload);
      
      if (response?.error) {
        setStatus({ success: '', error: response.error });
      } else if (response?.user) {
        updateUser(response.user);
        setStatus({ success: 'Profile updated successfully.', error: '' });
        setIsEditingProfile(false);
        setEditingSkills(false);
        setEditingRoles(false);
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus({ success: '', error: '' });
        }, 3000);
      } else {
        setStatus({ success: '', error: 'Unexpected response from server.' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold uppercase">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Update your personal information</p>
              </div>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => {
                  setIsEditingProfile(true);
                  setEditingSkills(true);
                  setEditingRoles(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
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

            {/* Technical Skills Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Technical Skills</h2>
                </div>
              </div>

              {(editingSkills || isEditingProfile) ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedSkills.includes(skill) && (
                          <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-600">
                      {selectedSkills.length > 0 ? (
                        <span className="font-medium text-blue-600">
                          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                        </span>
                      ) : (
                        <span className="text-gray-500">No skills selected</span>
                      )}
                    </p>
                    {!isEditingProfile && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelSkills}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveSkills}
                          disabled={savingSkills || selectedSkills.length === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{savingSkills ? 'Saving...' : 'Save'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.technical_skills && user.technical_skills.length > 0 ? (
                    user.technical_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No skills added yet. Click Edit to add skills.</p>
                  )}
                </div>
              )}
            </section>

            {/* Interested Roles Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Interested Job Roles</h2>
                </div>
              </div>

              {(editingRoles || isEditingProfile) ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roleTypes.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`p-3 rounded-lg text-sm font-medium text-left transition-all ${
                          selectedRoles.includes(role)
                            ? 'bg-purple-600 text-white shadow-md border-2 border-purple-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{role}</span>
                          {selectedRoles.includes(role) && (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-600">
                      {selectedRoles.length > 0 ? (
                        <span className="font-medium text-purple-600">
                          {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                        </span>
                      ) : (
                        <span className="text-gray-500">No roles selected</span>
                      )}
                    </p>
                    {!isEditingProfile && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelRoles}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveRoles}
                          disabled={savingRoles || selectedRoles.length === 0}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{savingRoles ? 'Saving...' : 'Save'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {user?.interested_roles && user.interested_roles.length > 0 ? (
                    user.interested_roles.map((role, index) => (
                      <div
                        key={index}
                        className="p-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                      >
                        {role}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic col-span-full">No roles added yet. Click Edit to add roles.</p>
                  )}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Password</p>
                <p className="text-sm text-gray-600">For security reasons, passwords can't be displayed. Use the "Forgot password" option on the login page to reset it.</p>
              </div>
            </section>

            {isEditingProfile && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <Button 
                  type="submit" 
                  disabled={saving || savingSkills || savingRoles}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;

