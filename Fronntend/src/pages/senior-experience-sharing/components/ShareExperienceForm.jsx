import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { experiencesAPI } from '../../../utils/api';

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'very_hard', label: 'Very Hard' }
];

const ShareExperienceForm = ({ onExperienceShared }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    batch_year: new Date()?.getFullYear(),
    overall_difficulty: 'medium',
    preparation_tips: '',
    resources: '',
    experience_story: '',
    linkedin_profile: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData?.company_name?.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData?.position_title?.trim()) {
      setError('Position title is required');
      return false;
    }
    if (!formData?.preparation_tips?.trim()) {
      setError('Preparation tips are required');
      return false;
    }
    if (!formData?.experience_story?.trim()) {
      setError('Please share your detailed experience.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Create experience object
      const experienceData = {
        company_name: formData?.company_name?.trim(),
        position_title: formData?.position_title?.trim(),
        batch_year: formData?.batch_year || null,
        overall_difficulty: formData?.overall_difficulty,
        preparation_tips: formData?.preparation_tips?.trim(),
        resources: formData?.resources?.trim() || null,
        experience_story: formData?.experience_story?.trim(),
        linkedin_profile: formData?.linkedin_profile?.trim() || null
      };

      // Save to backend API
      try {
        await experiencesAPI.createExperience(experienceData);
      } catch (apiError) {
        console.log('API save failed, saving to localStorage:', apiError);
        // Fallback to localStorage
        const experienceId = `exp_${Date.now()}`;
        const localData = {
          id: experienceId,
          user_id: user?.id,
          ...experienceData,
          likes_count: 0,
          liked_by: [],
          created_at: new Date().toISOString()
        };
        const storedExperiences = localStorage.getItem('company_experiences');
        const experiences = storedExperiences ? JSON.parse(storedExperiences) : [];
        experiences.unshift(localData);
        localStorage.setItem('company_experiences', JSON.stringify(experiences));
      }

      // Reset form
      setFormData({
        company_name: '',
        position_title: '',
        batch_year: new Date()?.getFullYear(),
        overall_difficulty: 'medium',
        preparation_tips: '',
        resources: '',
        experience_story: '',
        linkedin_profile: ''
      });

      onExperienceShared?.();
    } catch (error) {
      console.error('Error sharing experience:', error);
      setError('Failed to share experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Share Your Interview Experience</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData?.company_name}
                onChange={(e) => handleInputChange('company_name', e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Google, Microsoft, Amazon"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Title *
              </label>
              <input
                type="text"
                value={formData?.position_title}
                onChange={(e) => handleInputChange('position_title', e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Software Engineer, Product Manager"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Year (Optional)
              </label>
              <input
                type="number"
                value={formData?.batch_year}
                onChange={(e) => handleInputChange('batch_year', parseInt(e?.target?.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024"
                min="2020"
                max="2030"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Difficulty
              </label>
              <select
                value={formData?.overall_difficulty}
                onChange={(e) => handleInputChange('overall_difficulty', e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties?.map(difficulty => (
                  <option key={difficulty?.value} value={difficulty?.value}>
                    {difficulty?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preparation Tips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preparation Tips *
            </label>
            <textarea
              value={formData?.preparation_tips}
              onChange={(e) => handleInputChange('preparation_tips', e?.target?.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your preparation strategy, what worked well, what you wish you had done differently..."
              required
            />
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Helpful Resources (Optional)
            </label>
            <textarea
              value={formData?.resources}
              onChange={(e) => handleInputChange('resources', e?.target?.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Books, websites, courses, YouTube channels, etc. that helped you prepare..."
            />
          </div>

          {/* Detailed Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Experience *
            </label>
            <textarea
              value={formData.experience_story}
              onChange={(e) => handleInputChange('experience_story', e?.target?.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share the complete story of your interview journey, from preparation to final results..."
              required
            />
            <p className="mt-2 text-xs text-gray-500">Tip: Cover your preparation strategy, each round's highlights, and key takeaways.</p>
          </div>

          {/* LinkedIn Profile (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile (Optional)
            </label>
            <input
              type="url"
              value={formData?.linkedin_profile}
              onChange={(e) => handleInputChange('linkedin_profile', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.linkedin.com/in/your-profile"
            />
            <p className="mt-2 text-xs text-gray-500">
              Share your LinkedIn profile so others can connect with you for questions or networking.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Share Experience
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareExperienceForm;