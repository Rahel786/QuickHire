import React, { useState } from 'react';
import { Plus, Calendar, Clock, BookOpen, CheckCircle, Play, Trash2, RefreshCw, Award } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const MyPlans = ({ plans, onCreateNew, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);

  const calculateProgress = (plan) => {
    if (!plan?.daily_plans?.length) return 0;
    const completedDays = plan?.daily_plans?.filter(day => day?.is_completed)?.length;
    return Math.round((completedDays / plan?.daily_plans?.length) * 100);
  };

  const getDaysRemaining = (plan) => {
    if (!plan?.daily_plans?.length) return plan?.total_days || 0;
    const completedDays = plan?.daily_plans?.filter(day => day?.is_completed)?.length;
    return Math.max(0, plan?.total_days - completedDays);
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'text-green-600 bg-green-100';
    if (progress >= 70) return 'text-blue-600 bg-blue-100';
    if (progress >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        ?.from('prep_plans')
        ?.delete()
        ?.eq('id', planId);

      if (!error) {
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDayCompletion = async (planId, dayId, isCompleted) => {
    try {
      const { error } = await supabase
        ?.from('daily_plans')
        ?.update({
          is_completed: !isCompleted,
          completed_at: !isCompleted ? new Date()?.toISOString() : null
        })
        ?.eq('id', dayId);

      if (!error) {
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error updating day completion:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Study Plans</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your progress and continue learning
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Plan
            </button>
          </div>
        </div>
      </div>
      {/* Plans Grid */}
      {plans?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Study Plans Yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first personalized study plan to start preparing for technical interviews.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans?.map((plan) => {
            const progress = calculateProgress(plan);
            const daysRemaining = getDaysRemaining(plan);
            const isCompleted = progress === 100;
            const isExpanded = expandedPlan === plan?.id;

            return (
              <div key={plan?.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Plan Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {plan?.plan_title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="font-medium text-purple-600">
                          {plan?.technologies?.name}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Created {formatDate(plan?.created_at)}</span>
                      </div>
                      
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getProgressColor(progress)}`}>
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCompleted ? 'bg-green-500' : 'bg-purple-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Calendar className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-900">{plan?.total_days}</div>
                          <div className="text-xs text-gray-500">Days</div>
                        </div>
                        <div>
                          <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-900">{plan?.daily_hours}</div>
                          <div className="text-xs text-gray-500">Hrs/Day</div>
                        </div>
                        <div>
                          {isCompleted ? (
                            <Award className="h-5 w-5 text-green-500 mx-auto mb-1" />
                          ) : (
                            <Play className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {isCompleted ? 'Done!' : daysRemaining}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isCompleted ? 'Completed' : 'Remaining'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => setExpandedPlan(isExpanded ? null : plan?.id)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan?.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {/* Expanded Details */}
                {isExpanded && plan?.daily_plans?.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Daily Progress</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {plan?.daily_plans
                        ?.sort((a, b) => a?.day_number - b?.day_number)
                        ?.map((day) => (
                          <div
                            key={day?.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <button
                                onClick={() => handleToggleDayCompletion(plan?.id, day?.id, day?.is_completed)}
                                className={`mr-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  day?.is_completed
                                    ? 'bg-green-500 border-green-500 text-white' :'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {day?.is_completed && (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </button>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Day {day?.day_number}
                                </div>
                                {day?.completed_at && (
                                  <div className="text-xs text-green-600">
                                    Completed {formatDate(day?.completed_at)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              day?.is_completed
                                ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-600'
                            }`}>
                              {day?.is_completed ? 'Complete' : 'Pending'}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPlans;