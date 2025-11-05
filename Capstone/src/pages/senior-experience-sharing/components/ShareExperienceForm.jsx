import React, { useState } from 'react';
import { Plus, Minus, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

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
  });
  const [rounds, setRounds] = useState([
    {
      round_type: 'mcq',
      round_number: 1,
      questions_pattern: '',
      detailed_questions: '',
      duration_minutes: 60,
      difficulty: 'medium',
      tips: ''
    }
  ]);

  const roundTypes = [
    { value: 'mcq', label: 'MCQ Round' },
    { value: 'coding', label: 'Coding Round' },
    { value: 'technical', label: 'Technical Interview' },
    { value: 'hr', label: 'HR Interview' },
    { value: 'group_discussion', label: 'Group Discussion' },
    { value: 'case_study', label: 'Case Study' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'very_hard', label: 'Very Hard' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRoundChange = (index, field, value) => {
    setRounds(prev => prev?.map((round, i) => 
      i === index ? { ...round, [field]: value } : round
    ));
  };

  const addRound = () => {
    setRounds(prev => [...prev, {
      round_type: 'mcq',
      round_number: prev?.length + 1,
      questions_pattern: '',
      detailed_questions: '',
      duration_minutes: 60,
      difficulty: 'medium',
      tips: ''
    }]);
  };

  const removeRound = (index) => {
    setRounds(prev => prev?.filter((_, i) => i !== index)?.map((round, i) => ({
      ...round,
      round_number: i + 1
    })));
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
    if (rounds?.some(round => !round?.questions_pattern?.trim())) {
      setError('All rounds must have questions pattern filled');
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
      // Insert experience
      const { data: experienceData, error: experienceError } = await supabase
        ?.from('company_experiences')
        ?.insert([{
          user_id: user?.id,
          company_name: formData?.company_name?.trim(),
          position_title: formData?.position_title?.trim(),
          batch_year: formData?.batch_year || null,
          overall_difficulty: formData?.overall_difficulty,
          preparation_tips: formData?.preparation_tips?.trim(),
          resources: formData?.resources?.trim() || null,
        }])
        ?.select()
        ?.single();

      if (experienceError) {
        throw experienceError;
      }

      // Insert rounds
      const roundsData = rounds?.map(round => ({
        experience_id: experienceData?.id,
        round_type: round?.round_type,
        round_number: round?.round_number,
        questions_pattern: round?.questions_pattern?.trim(),
        detailed_questions: round?.detailed_questions?.trim() || null,
        duration_minutes: round?.duration_minutes || null,
        difficulty: round?.difficulty,
        tips: round?.tips?.trim() || null
      }));

      const { error: roundsError } = await supabase
        ?.from('interview_rounds')
        ?.insert(roundsData);

      if (roundsError) {
        throw roundsError;
      }

      // Reset form
      setFormData({
        company_name: '',
        position_title: '',
        batch_year: new Date()?.getFullYear(),
        overall_difficulty: 'medium',
        preparation_tips: '',
        resources: '',
      });
      setRounds([{
        round_type: 'mcq',
        round_number: 1,
        questions_pattern: '',
        detailed_questions: '',
        duration_minutes: 60,
        difficulty: 'medium',
        tips: ''
      }]);

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

          {/* Interview Rounds */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Interview Rounds</h3>
              <button
                type="button"
                onClick={addRound}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Round
              </button>
            </div>

            <div className="space-y-6">
              {rounds?.map((round, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Round {round?.round_number}</h4>
                    {rounds?.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Round Type
                      </label>
                      <select
                        value={round?.round_type}
                        onChange={(e) => handleRoundChange(index, 'round_type', e?.target?.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {roundTypes?.map(type => (
                          <option key={type?.value} value={type?.value}>
                            {type?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={round?.duration_minutes}
                        onChange={(e) => handleRoundChange(index, 'duration_minutes', parseInt(e?.target?.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60"
                        min="15"
                        max="180"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={round?.difficulty}
                        onChange={(e) => handleRoundChange(index, 'difficulty', e?.target?.value)}
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

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Questions Pattern *
                    </label>
                    <textarea
                      value={round?.questions_pattern}
                      onChange={(e) => handleRoundChange(index, 'questions_pattern', e?.target?.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the type of questions asked in this round..."
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Questions (Optional)
                    </label>
                    <textarea
                      value={round?.detailed_questions}
                      onChange={(e) => handleRoundChange(index, 'detailed_questions', e?.target?.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Specific questions you can remember..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tips for this Round (Optional)
                    </label>
                    <textarea
                      value={round?.tips}
                      onChange={(e) => handleRoundChange(index, 'tips', e?.target?.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific tips for this round..."
                    />
                  </div>
                </div>
              ))}
            </div>
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