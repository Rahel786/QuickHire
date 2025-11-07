import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, Briefcase, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Header from '../components/ui/Header';
import { authAPI } from '../utils/api';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      setError('Please log in to continue');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedSkills.length === 0) {
      setError('Please select at least one technical skill');
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Please select at least one role you are interested in');
      return;
    }

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in again.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    setLoading(true);

    // Update localStorage first (optimistic update)
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    currentUser.onboarding_completed = true;
    currentUser.technical_skills = selectedSkills;
    currentUser.interested_roles = selectedRoles;
    localStorage.setItem('user', JSON.stringify(currentUser));
    window.dispatchEvent(new Event('localStorageUpdated'));

    try {
      // Prepare data for API - ensure arrays are always sent
      const profileData = {
        technical_skills: Array.isArray(selectedSkills) ? selectedSkills : [],
        interested_roles: Array.isArray(selectedRoles) ? selectedRoles : [],
        onboarding_completed: true
      };

      // Try to save to database (but don't block on error)
      try {
        const result = await authAPI.updateProfile(profileData);
        
        if (result && result.user) {
          // Update with server response if available
          localStorage.setItem('user', JSON.stringify(result.user));
          window.dispatchEvent(new Event('localStorageUpdated'));
        }
      } catch (apiError) {
        // Log error but don't block - we've already updated localStorage
        console.warn('Failed to save to database, but continuing with local update:', apiError);
      }
      
      // Always redirect to dashboard (we've already saved locally)
      navigate('/user-dashboard', { replace: true });
      
    } catch (err) {
      console.error('Error:', err);
      // Even on error, redirect since we've saved locally
      navigate('/user-dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Let's personalize your experience. Tell us about your skills and interests.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Technical Skills Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Technical Skills</h2>
                  <p className="text-sm text-gray-600">Select all the technologies you know</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
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
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedSkills.length > 0 ? (
                    <span className="font-medium text-blue-600">
                      {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    <span className="text-gray-500">Select at least one skill to continue</span>
                  )}
                </p>
              </div>
            </div>

            {/* Interested Roles Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Interested Roles</h2>
                  <p className="text-sm text-gray-600">What type of positions are you looking for?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
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
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedRoles.length > 0 ? (
                    <span className="font-medium text-purple-600">
                      {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    <span className="text-gray-500">Select at least one role to continue</span>
                  )}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || selectedSkills.length === 0 || selectedRoles.length === 0}
                className={`px-8 py-3 text-white font-semibold rounded-lg transition-all flex items-center space-x-2 shadow-lg ${
                  selectedSkills.length > 0 && selectedRoles.length > 0
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Roadmap</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

