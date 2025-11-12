import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Calendar, Clock, BookOpen, Code, CheckCircle, Target, Lightbulb, Award, ExternalLink } from 'lucide-react';
import { learningsAPI } from '../../../utils/api';

const GeneratedPlan = ({ plan, onSave, onBack, loading, planId, onPlanUpdate }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [impressTips, setImpressTips] = useState({}); // Store API-fetched tips
  const [loadingTips, setLoadingTips] = useState({}); // Track loading state per question
  const [localDailyPlans, setLocalDailyPlans] = useState(plan?.dailyPlans || []);
  const [savingDay, setSavingDay] = useState(false);

  // Sync localDailyPlans when plan prop changes
  useEffect(() => {
    if (plan?.dailyPlans && plan.dailyPlans.length > 0) {
      setLocalDailyPlans(plan.dailyPlans);
    }
  }, [plan?.dailyPlans]);

  // Initialize selectedDay to first day if not set
  useEffect(() => {
    if (!selectedDay && dailyPlans && dailyPlans.length > 0) {
      setSelectedDay(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (!plan) return null;

  const { technology, config } = plan;
  const dailyPlans = localDailyPlans;

  const formatDayTitle = (dayNumber) => {
    if (dayNumber === 1) return '1st Day';
    if (dayNumber === 2) return '2nd Day';
    if (dayNumber === 3) return '3rd Day';
    return `${dayNumber}th Day`;
  };

  // Map resources to URLs based on technology
  const getResourceUrl = (resourceName, techName) => {
    // Check if resource is already a URL (from LLM API)
    if (typeof resourceName === 'string' && (resourceName.startsWith('http://') || resourceName.startsWith('https://'))) {
      return resourceName;
    }

    // Map resource names to URLs for static resources
    const resourceMap = {
      'React': {
        'React Documentation - Getting Started': 'https://react.dev/learn',
        'Codecademy React Course': 'https://www.codecademy.com/learn/react-101',
        'React Hooks Guide': 'https://react.dev/reference/react',
        'useEffect Complete Guide': 'https://react.dev/reference/react/useEffect',
        'React Forms Documentation': 'https://react.dev/reference/react-dom/components/input',
        'Fetch API Tutorial': 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
        'React Router Documentation': 'https://reactrouter.com/',
        'Routing Tutorial': 'https://reactrouter.com/en/main/start/tutorial',
        'Context API Guide': 'https://react.dev/learn/passing-data-deeply-with-context',
        'useReducer vs useState': 'https://react.dev/reference/react/useReducer',
        'React Performance Guide': 'https://react.dev/learn/render-and-commit',
        'Optimization Techniques': 'https://react.dev/learn/render-and-commit',
        'React Testing Library Docs': 'https://testing-library.com/react',
        'Testing Best Practices': 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library'
      },
      'Java': {
        'Oracle Java Tutorials': 'https://docs.oracle.com/javase/tutorial/',
        'Java OOP Guide': 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/',
        'Java Collections Tutorial': 'https://docs.oracle.com/javase/tutorial/collections/',
        'Collections Best Practices': 'https://www.baeldung.com/java-collections',
        'Exception Handling Guide': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
        'Java Error Handling': 'https://www.baeldung.com/java-exceptions',
        'Java Concurrency Tutorial': 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
        'Thread Safety Guide': 'https://www.baeldung.com/java-thread-safety',
        'Java 8 Features Guide': 'https://www.baeldung.com/java-8-new-features',
        'Stream API Tutorial': 'https://www.baeldung.com/java-8-streams',
        'Design Patterns in Java': 'https://www.tutorialspoint.com/design_pattern/index.htm',
        'Gang of Four Patterns': 'https://refactoring.guru/design-patterns',
        'JVM Architecture Guide': 'https://www.baeldung.com/jvm-vs-jre-vs-jdk',
        'Memory Management in Java': 'https://www.baeldung.com/java-memory-management'
      },
      'JavaScript': {
        'MDN JavaScript Guide': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        'JavaScript.info': 'https://javascript.info/',
        'Eloquent JavaScript': 'https://eloquentjavascript.net/',
        'JavaScript Promises Guide': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
        'Async/Await Tutorial': 'https://javascript.info/async-await',
        'Event Loop Explained': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop',
        'Closures in JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
        'Prototypal Inheritance': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
        'JavaScript Best Practices': 'https://www.w3schools.com/js/js_best_practices.asp'
      },
      'SQL': {
        'W3Schools SQL Tutorial': 'https://www.w3schools.com/sql/',
        'SQL Basics Guide': 'https://www.w3schools.com/sql/sql_intro.asp',
        'SQL Joins Explained': 'https://www.w3schools.com/sql/sql_join.asp',
        'Subqueries Tutorial': 'https://www.w3schools.com/sql/sql_subqueries.asp',
        'SQL Aggregate Functions': 'https://www.w3schools.com/sql/sql_count_avg_sum.asp',
        'Window Functions Guide': 'https://www.postgresql.org/docs/current/tutorial-window.html',
        'Database Indexing Guide': 'https://use-the-index-luke.com/',
        'SQL Performance Tuning': 'https://www.sqlshack.com/query-optimization-techniques-in-sql-server/',
        'Database Transactions Guide': 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
        'ACID Properties Explained': 'https://www.geeksforgeeks.org/acid-properties-in-dbms/',
        'Stored Procedures Tutorial': 'https://www.w3schools.com/sql/sql_stored_procedures.asp',
        'Database Functions Guide': 'https://www.postgresql.org/docs/current/xfunc.html',
        'Database Design Principles': 'https://www.lucidchart.com/pages/database-diagram/database-design',
        'Normalization Guide': 'https://www.studytonight.com/dbms/database-normalization.php'
      },
      'Data Structures & Algorithms': {
        'GeeksforGeeks DSA': 'https://www.geeksforgeeks.org/data-structures/',
        'LeetCode': 'https://leetcode.com/',
        'HackerRank': 'https://www.hackerrank.com/domains/data-structures',
        'NeetCode': 'https://neetcode.io/',
        'Big O Notation Guide': 'https://www.bigocheatsheet.com/',
        'Algorithm Visualization': 'https://visualgo.net/',
        'Cracking the Coding Interview': 'https://www.crackingthecodinginterview.com/',
        'Algorithms by CLRS': 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/'
      }
    };

    const techResources = resourceMap[techName] || resourceMap['React'];
    return techResources[resourceName] || null;
  };

  // Fetch impress tips from API when a day is selected
  useEffect(() => {
    if (!selectedDay || !dailyPlans[selectedDay - 1]) return;

    const currentDayPlan = dailyPlans[selectedDay - 1];
    const isSpecialCase = (config?.totalDays === 2 || config?.totalDays === 4) && 
                          ['React', 'Java', 'JavaScript'].includes(technology?.name);
    // Use API for: special cases (2/4 days for React/Java/JS) OR other days
    const shouldFetchForDay = isSpecialCase || (config?.totalDays !== 2 && config?.totalDays !== 4);

    currentDayPlan.interview_questions?.forEach((qa, idx) => {
      const questionKey = `${selectedDay}-${idx}`;
      const shouldUseAPI = qa.useAPIForImpress || shouldFetchForDay;
      
      if (shouldUseAPI && !impressTips[questionKey] && !loadingTips[questionKey]) {
        setLoadingTips(prev => ({ ...prev, [questionKey]: true }));
        learningsAPI.getImpressTip(
          qa.question,
          technology?.name || 'React',
          qa.answer,
          config?.explanationType || 'beginner'
        ).then(tip => {
          if (tip) {
            setImpressTips(prev => ({ ...prev, [questionKey]: tip }));
          }
          setLoadingTips(prev => ({ ...prev, [questionKey]: false }));
        }).catch(() => {
          setLoadingTips(prev => ({ ...prev, [questionKey]: false }));
        });
      }
    });
  }, [selectedDay, config?.totalDays, technology?.name]);

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
                className={`p-4 rounded-lg border-2 transition-all relative ${
                  selectedDay === plan.day_number
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : plan.is_completed
                      ? 'border-green-500 bg-green-50 hover:border-green-600'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    selectedDay === plan.day_number 
                      ? 'text-purple-600' 
                      : plan.is_completed 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                  }`}>
                    Day {plan.day_number}
                  </div>
                  {plan.is_completed && (
                    <div className="mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Day Detail View */}
          {selectedDay && dailyPlans[selectedDay - 1] && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  dailyPlans[selectedDay - 1]?.is_completed 
                    ? 'bg-green-600' 
                    : 'bg-purple-600'
                }`}>
                  {dailyPlans[selectedDay - 1]?.is_completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    selectedDay
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {formatDayTitle(selectedDay)}
                    </h4>
                    {dailyPlans[selectedDay - 1]?.is_completed && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">Day {selectedDay} of {config?.totalDays}</p>
                  {dailyPlans[selectedDay - 1]?.completed_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Completed on {new Date(dailyPlans[selectedDay - 1].completed_at).toLocaleDateString()}
                    </p>
                  )}
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
                      {dailyPlans[selectedDay - 1].interview_questions.map((qa, idx) => {
                        const questionKey = `${selectedDay}-${idx}`;
                        const isSpecialCase = (config?.totalDays === 2 || config?.totalDays === 4) && 
                                              ['React', 'Java', 'JavaScript'].includes(technology?.name);
                        const shouldUseAPI = qa.useAPIForImpress || isSpecialCase || 
                          (config?.totalDays !== 2 && config?.totalDays !== 4);
                        const impressTip = impressTips[questionKey] || qa.impressTip;
                        const isLoadingTip = loadingTips[questionKey];

                        return (
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
                              
                              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                <p className="text-sm font-semibold text-yellow-900 mb-1">💡 How to Impress:</p>
                                {isLoadingTip ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                    <p className="text-gray-500 text-sm italic">Generating personalized tip...</p>
                                  </div>
                                ) : (
                                  <p className="text-gray-700 text-sm leading-relaxed">{impressTip}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                    {dailyPlans[selectedDay - 1]?.learning_resources?.map((resource, idx) => {
                      const resourceUrl = getResourceUrl(resource, technology?.name || 'React');
                      const isClickable = resourceUrl !== null;
                      
                      // Extract display name from URL if it's a URL
                      const getDisplayName = (res) => {
                        if (typeof res === 'string' && (res.startsWith('http://') || res.startsWith('https://'))) {
                          try {
                            const url = new URL(res);
                            // Return domain + path (truncated if too long)
                            const path = url.pathname.length > 30 
                              ? url.pathname.substring(0, 30) + '...' 
                              : url.pathname;
                            return url.hostname.replace('www.', '') + path;
                          } catch {
                            return res.length > 50 ? res.substring(0, 50) + '...' : res;
                          }
                        }
                        return res;
                      };

                      const displayName = getDisplayName(resource);

                      return (
                        <li 
                          key={idx} 
                          className={`flex items-center space-x-2 ${
                            isClickable 
                              ? 'text-blue-600 hover:text-blue-800 cursor-pointer group' 
                              : 'text-gray-700'
                          } transition-colors`}
                          onClick={() => {
                            if (isClickable) {
                              window.open(resourceUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          title={typeof resource === 'string' && resource.startsWith('http') ? resource : undefined}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            isClickable ? 'bg-blue-500 group-hover:bg-blue-700' : 'bg-blue-400'
                          }`}></div>
                          <span className="flex items-center space-x-1">
                            <span>{displayName}</span>
                            {isClickable && (
                              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                            )}
                          </span>
                        </li>
                      );
                    })}
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
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                      if (!selectedDay) {
                        console.log('No day selected');
                        return;
                      }
                      
                      const nextDay = selectedDay + 1;
                      if (nextDay > (config?.totalDays || 0)) {
                        console.log('Already at last day');
                        return;
                      }
                      
                      console.log('Marking day', selectedDay, 'as completed and moving to day', nextDay);
                      
                      // Mark current day as completed
                      setSavingDay(true);
                      
                      const updatedPlans = dailyPlans.map((day) => {
                        if (day.day_number === selectedDay) {
                          return {
                            ...day,
                            is_completed: true,
                            completed_at: new Date().toISOString()
                          };
                        }
                        return day;
                      });
                      
                      // Update local state first for immediate UI feedback
                      setLocalDailyPlans(updatedPlans);
                      
                      // If plan is saved (has planId), update it in backend/localStorage
                      if (planId && onPlanUpdate) {
                        try {
                          await onPlanUpdate(planId, updatedPlans);
                          console.log('Plan updated successfully');
                        } catch (error) {
                          console.error('Error updating day completion:', error);
                          // Revert local state if update failed
                          setLocalDailyPlans(dailyPlans);
                        }
                      } else {
                        console.log('Plan not saved yet, only updating local state');
                      }
                      
                      // Move to next day
                      setSelectedDay(nextDay);
                      console.log('Moved to day', nextDay);
                    } catch (error) {
                      console.error('Error in Next Day handler:', error);
                    } finally {
                      setSavingDay(false);
                    }
                  }}
                  disabled={!selectedDay || selectedDay >= (config?.totalDays || 0) || savingDay}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {savingDay ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Day</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
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