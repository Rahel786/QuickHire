import React from 'react';
import { ArrowLeft, Save, Calendar, Clock, BookOpen, Code, CheckCircle, Target } from 'lucide-react';

const GeneratedPlan = ({ plan, onSave, onBack, loading }) => {
  if (!plan) return null;

  const { technology, config, dailyPlans } = plan;

  const formatDayTitle = (dayNumber) => {
    if (dayNumber === 1) return '1st Day';
    if (dayNumber === 2) return '2nd Day';
    if (dayNumber === 3) return '3rd Day';
    return `${dayNumber}th Day`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{config?.planTitle}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {technology?.name} • {config?.totalDays} days • {config?.dailyHours} hours/day
              </p>
            </div>
          </div>
          <button
            onClick={onSave}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </>
            )}
          </button>
        </div>

        {/* Plan Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{config?.totalDays}</div>
            <div className="text-sm text-gray-500">Total Days</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{config?.totalDays * config?.dailyHours}</div>
            <div className="text-sm text-gray-500">Total Hours</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{dailyPlans?.length || 0}</div>
            <div className="text-sm text-gray-500">Learning Days</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {dailyPlans?.reduce((total, plan) => total + (plan?.practice_questions?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Practice Questions</div>
          </div>
        </div>
      </div>
      {/* Daily Plans Timeline */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Study Timeline</h3>
          
          <div className="space-y-6">
            {dailyPlans?.map((dayPlan, index) => (
              <div key={index} className="relative">
                {/* Timeline connector */}
                {index < dailyPlans?.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Day number circle */}
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">{dayPlan?.day_number}</span>
                  </div>
                  
                  {/* Day content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {formatDayTitle(dayPlan?.day_number)}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {dayPlan?.estimated_hours} hours
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Core Concepts */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                          Core Concepts
                        </h5>
                        <ul className="space-y-2">
                          {dayPlan?.core_concepts?.map((concept, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Learning Resources */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-orange-600" />
                          Learning Resources
                        </h5>
                        <ul className="space-y-2">
                          {dayPlan?.learning_resources?.map((resource, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practice Questions */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Code className="h-4 w-4 mr-2 text-purple-600" />
                          Practice Questions
                        </h5>
                        <ul className="space-y-2">
                          {dayPlan?.practice_questions?.map((question, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Study Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Success Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Stay Consistent</div>
                <div className="text-sm text-gray-600">Study at the same time every day to build a habit</div>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Practice Active Learning</div>
                <div className="text-sm text-gray-600">Don't just read - code along and build projects</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Track Progress</div>
                <div className="text-sm text-gray-600">Mark topics as complete and review your progress</div>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Don't Rush</div>
                <div className="text-sm text-gray-600">Take breaks and ensure you understand each concept</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Final Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={loading}
          className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Saving Plan...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-3" />
              Save & Start Learning
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratedPlan;