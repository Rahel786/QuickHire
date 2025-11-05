import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Clock, BookOpen, Code, CheckCircle, Target, Lightbulb, Award } from 'lucide-react';

const GeneratedPlan = ({ plan, onSave, onBack, loading }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  
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
          
          {/* Day Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {dailyPlans?.map((plan) => (
              <button
                key={plan.day_number}
                onClick={() => setSelectedDay(plan.day_number === selectedDay ? null : plan.day_number)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDay === plan.day_number
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold ${selectedDay === plan.day_number ? 'text-purple-600' : 'text-gray-900'}`}>
                    Day {plan.day_number}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Day Detail View */}
          {selectedDay && dailyPlans[selectedDay - 1] && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedDay}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    {formatDayTitle(selectedDay)}
                  </h4>
                  <p className="text-gray-600">Day {selectedDay} of {config?.totalDays}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Learning Context */}
                {dailyPlans[selectedDay - 1]?.learning_context && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Learning Context</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {dailyPlans[selectedDay - 1].learning_context}
                    </p>
                  </div>
                )}

                {/* Core Concepts */}
                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center space-x-2 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-gray-900">Topics to Cover</h4>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {dailyPlans[selectedDay - 1]?.core_concepts?.map((topic, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interview Questions & Answers */}
                {dailyPlans[selectedDay - 1]?.interview_questions?.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Interview Questions & How to Answer</h4>
                    </div>
                    <div className="space-y-6">
                      {dailyPlans[selectedDay - 1].interview_questions.map((qa, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-5 shadow-sm">
                          <div className="mb-4">
                            <div className="flex items-start space-x-2">
                              <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-bold">Q{idx + 1}</span>
                              <h5 className="font-semibold text-gray-900 flex-1">{qa.question}</h5>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                              <p className="text-sm font-semibold text-green-900 mb-2">✓ Strong Answer:</p>
                              <p className="text-gray-700 text-sm leading-relaxed">{qa.answer}</p>
                            </div>
                            
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                              <p className="text-sm font-semibold text-blue-900 mb-1">📋 Answer Type:</p>
                              <p className="text-gray-700 text-sm">{qa.answerType}</p>
                            </div>
                            
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                              <p className="text-sm font-semibold text-yellow-900 mb-1">💡 How to Impress:</p>
                              <p className="text-gray-700 text-sm">{qa.impressTip}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Problems */}
                <div className="bg-green-50 rounded-lg p-6 border">
                  <div className="flex items-center space-x-2 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-gray-900">Practice Problems</h4>
                  </div>
                  <ul className="space-y-2">
                    {dailyPlans[selectedDay - 1]?.practice_questions?.map((problem, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-gray-700">
                        <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex items-center space-x-2 mb-3">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <h4 className="font-bold text-gray-900">Additional Resources</h4>
                  </div>
                  <ul className="space-y-2">
                    {dailyPlans[selectedDay - 1]?.learning_resources?.map((resource, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between pt-6 border-t">
                <button
                  onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                  disabled={selectedDay === 1}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ← Previous Day
                </button>
                <button
                  onClick={() => setSelectedDay(Math.min(config?.totalDays, selectedDay + 1))}
                  disabled={selectedDay === config?.totalDays}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next Day →
                </button>
              </div>
            </div>
          )}
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