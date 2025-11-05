import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Target, ChevronRight } from 'lucide-react';

const PlanConfiguration = ({ selectedTech, config, onConfigSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    totalDays: config?.totalDays || 7,
    dailyHours: config?.dailyHours || 2,
    planTitle: config?.planTitle || `${selectedTech?.name} Interview Prep - 7 Days`
  });

  const dayOptions = [
    { value: 2, label: '2 Days', description: 'Quick overview and key concepts' },
    { value: 4, label: '4 Days', description: 'Essential topics with practice' },
    { value: 6, label: '6 Days', description: 'Comprehensive coverage' },
    { value: 7, label: '1 Week', description: 'Detailed study with projects' },
    { value: 14, label: '2 Weeks', description: 'In-depth preparation' },
    { value: 21, label: '3 Weeks', description: 'Master-level preparation' },
    { value: 30, label: '1 Month', description: 'Complete mastery with advanced topics' }
  ];

  const hourOptions = [
    { value: 1, label: '1 Hour/day', description: 'Light study pace' },
    { value: 2, label: '2 Hours/day', description: 'Moderate pace' },
    { value: 3, label: '3 Hours/day', description: 'Intensive study' },
    { value: 4, label: '4 Hours/day', description: 'Full-time preparation' },
    { value: 6, label: '6 Hours/day', description: 'Intensive preparation' }
  ];

  const updateField = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'totalDays') {
      updatedData.planTitle = `${selectedTech?.name} Interview Prep - ${value} Days`;
    }
    
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onConfigSubmit?.(formData);
  };

  const getTotalHours = () => {
    return formData?.totalDays * formData?.dailyHours;
  };

  const getIntensityLevel = () => {
    const totalHours = getTotalHours();
    const daysPerWeek = 7;
    const hoursPerWeek = (formData?.dailyHours * daysPerWeek);
    
    if (hoursPerWeek <= 7) return { level: 'Light', color: 'text-green-600', bg: 'bg-green-50' };
    if (hoursPerWeek <= 14) return { level: 'Moderate', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (hoursPerWeek <= 21) return { level: 'Intensive', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Very Intensive', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const intensity = getIntensityLevel();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configure Your Study Plan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Selected: <span className="font-medium text-purple-600">{selectedTech?.name}</span>
            </p>
          </div>
        </div>

        {/* Plan Overview */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">{formData?.totalDays} Days</div>
                <div className="text-xs text-gray-500">Study Duration</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">{getTotalHours()} Hours</div>
                <div className="text-xs text-gray-500">Total Study Time</div>
              </div>
            </div>
            <div className="flex items-center">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${intensity?.bg} ${intensity?.color}`}>
                  {intensity?.level}
                </div>
                <div className="text-xs text-gray-500">Intensity Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Title */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Title
            </label>
            <input
              type="text"
              value={formData?.planTitle}
              onChange={(e) => updateField('planTitle', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="My Interview Prep Plan"
            />
            <p className="mt-1 text-sm text-gray-500">
              Give your study plan a memorable name
            </p>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Study Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayOptions?.map(option => (
              <button
                key={option?.value}
                type="button"
                onClick={() => updateField('totalDays', option?.value)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  formData?.totalDays === option?.value
                    ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{option?.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{option?.description}</div>
                  </div>
                  {formData?.totalDays === option?.value && (
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Hours Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Study Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hourOptions?.map(option => (
              <button
                key={option?.value}
                type="button"
                onClick={() => updateField('dailyHours', option?.value)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  formData?.dailyHours === option?.value
                    ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{option?.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{option?.description}</div>
                  </div>
                  {formData?.dailyHours === option?.value && (
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Study Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Consistency is key - stick to your daily schedule</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Practice coding problems daily, even if just for 30 minutes</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Take notes and review them regularly</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Join study groups or find an accountability partner</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Study Plan
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanConfiguration;