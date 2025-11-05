import React, { useState, useEffect } from 'react';
import { Brain, Calendar, CheckCircle, Plus, BookOpen, Code, Database, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import TechnologySelector from './components/TechnologySelector';
import PlanConfiguration from './components/PlanConfiguration';
import GeneratedPlan from './components/GeneratedPlan';
import MyPlans from './components/MyPlans';
import { getInterviewQuestions, getDayContent } from './utils/interviewQA';
import { learningsAPI } from '../../utils/api';


const InterviewTechPrepPlanner = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('select'); // select, configure, generate, view
  const [selectedTech, setSelectedTech] = useState(null);
  const [planConfig, setPlanConfig] = useState({
    totalDays: 7,
    dailyHours: 2,
    planTitle: '',
    explanationType: 'beginner'
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyPlans();
  }, []);

  const loadMyPlans = async () => {
    try {
      // Try to load from backend API first
      try {
        const userId = user?.id || null;
        const data = await learningsAPI.getAllPlans(userId);
        if (data && data.plans) {
          setMyPlans(data.plans);
          return;
        }
      } catch (apiError) {
        console.log('API load failed, using localStorage:', apiError);
      }
      
      // Fallback to localStorage
      const storedPlans = localStorage.getItem('prep_plans');
      if (storedPlans) {
        const allPlans = JSON.parse(storedPlans);
        // For testing: show all plans or filter by user if exists
        const userPlans = user 
          ? allPlans.filter(plan => plan.user_id === user?.id)
          : allPlans.filter(plan => plan.user_id === 'test_user');
        setMyPlans(userPlans || []);
      } else {
        setMyPlans([]);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setMyPlans([]);
    }
  };

  const generateDailyPlan = (technology, totalDays, dailyHours, explanationType) => {
    const basePlans = {
      'React': {
        1: {
          concepts: ['Components & JSX', 'Props & State', 'Event Handling'],
          resources: ['React Documentation - Getting Started', 'Codecademy React Course'],
          questions: ['What is JSX?', 'Difference between props and state?', 'How to handle events in React?']
        },
        2: {
          concepts: ['Hooks (useState, useEffect)', 'Component Lifecycle', 'Conditional Rendering'],
          resources: ['React Hooks Guide', 'useEffect Complete Guide'],
          questions: ['When to use useEffect?', 'Cleanup in useEffect?', 'Rules of Hooks?']
        },
        3: {
          concepts: ['Forms & Controlled Components', 'State Management', 'API Integration'],
          resources: ['React Forms Documentation', 'Fetch API Tutorial'],
          questions: ['Controlled vs Uncontrolled components?', 'How to handle form submission?']
        },
        4: {
          concepts: ['React Router', 'Navigation', 'Route Parameters'],
          resources: ['React Router Documentation', 'Routing Tutorial'],
          questions: ['How to implement routing?', 'Protected routes?', 'Route parameters?']
        },
        5: {
          concepts: ['Context API', 'State Management Patterns', 'useReducer'],
          resources: ['Context API Guide', 'useReducer vs useState'],
          questions: ['When to use Context?', 'Context vs Props drilling?']
        },
        6: {
          concepts: ['Performance Optimization', 'React.memo', 'useMemo & useCallback'],
          resources: ['React Performance Guide', 'Optimization Techniques'],
          questions: ['When to use React.memo?', 'Difference between useMemo and useCallback?']
        },
        7: {
          concepts: ['Testing', 'Jest & React Testing Library', 'Debugging'],
          resources: ['React Testing Library Docs', 'Testing Best Practices'],
          questions: ['How to test React components?', 'Testing hooks?', 'Mock API calls?']
        }
      },
      'Java': {
        1: {
          concepts: ['OOP Concepts', 'Classes & Objects', 'Inheritance'],
          resources: ['Oracle Java Tutorials', 'Java OOP Guide'],
          questions: ['What is inheritance?', 'Method overriding vs overloading?']
        },
        2: {
          concepts: ['Collections Framework', 'ArrayList, HashMap', 'Iterators'],
          resources: ['Java Collections Tutorial', 'Collections Best Practices'],
          questions: ['ArrayList vs LinkedList?', 'HashMap internal working?']
        },
        3: {
          concepts: ['Exception Handling', 'try-catch-finally', 'Custom Exceptions'],
          resources: ['Exception Handling Guide', 'Java Error Handling'],
          questions: ['Checked vs Unchecked exceptions?', 'finally block execution?']
        },
        4: {
          concepts: ['Multithreading', 'Thread Safety', 'Synchronization'],
          resources: ['Java Concurrency Tutorial', 'Thread Safety Guide'],
          questions: ['How to create threads?', 'What is synchronization?']
        },
        5: {
          concepts: ['Stream API', 'Lambda Expressions', 'Functional Interfaces'],
          resources: ['Java 8 Features Guide', 'Stream API Tutorial'],
          questions: ['What are lambda expressions?', 'Stream operations?']
        },
        6: {
          concepts: ['Design Patterns', 'Singleton, Factory', 'Observer Pattern'],
          resources: ['Design Patterns in Java', 'Gang of Four Patterns'],
          questions: ['Singleton implementation?', 'Factory vs Abstract Factory?']
        },
        7: {
          concepts: ['JVM Internals', 'Memory Management', 'Garbage Collection'],
          resources: ['JVM Architecture Guide', 'Memory Management in Java'],
          questions: ['JVM memory areas?', 'Garbage collection types?']
        }
      },
      'SQL': {
        1: {
          concepts: ['Basic Queries', 'SELECT, WHERE, ORDER BY', 'Data Types'],
          resources: ['W3Schools SQL Tutorial', 'SQL Basics Guide'],
          questions: ['Write a SELECT query?', 'Difference between WHERE and HAVING?']
        },
        2: {
          concepts: ['Joins', 'INNER, LEFT, RIGHT, FULL JOIN', 'Subqueries'],
          resources: ['SQL Joins Explained', 'Subqueries Tutorial'],
          questions: ['Explain different types of joins?', 'When to use subqueries?']
        },
        3: {
          concepts: ['Aggregate Functions', 'GROUP BY, HAVING', 'Window Functions'],
          resources: ['SQL Aggregate Functions', 'Window Functions Guide'],
          questions: ['Difference between COUNT(*) and COUNT(column)?', 'What are window functions?']
        },
        4: {
          concepts: ['Indexes', 'Performance Optimization', 'Query Execution Plans'],
          resources: ['Database Indexing Guide', 'SQL Performance Tuning'],
          questions: ['What are indexes?', 'How to optimize slow queries?']
        },
        5: {
          concepts: ['Transactions', 'ACID Properties', 'Isolation Levels'],
          resources: ['Database Transactions Guide', 'ACID Properties Explained'],
          questions: ['What are ACID properties?', 'Explain isolation levels?']
        },
        6: {
          concepts: ['Stored Procedures', 'Functions', 'Triggers'],
          resources: ['Stored Procedures Tutorial', 'Database Functions Guide'],
          questions: ['Difference between procedure and function?', 'When to use triggers?']
        },
        7: {
          concepts: ['Database Design', 'Normalization', 'ERD'],
          resources: ['Database Design Principles', 'Normalization Guide'],
          questions: ['What is normalization?', 'Explain different normal forms?']
        }
      }
    };

    const techPlan = basePlans?.[technology?.name] || basePlans?.['React'];
    const dailyPlans = [];

    for (let day = 1; day <= totalDays; day++) {
      const dayPlan = techPlan?.[day] || techPlan?.[1];
      const techName = technology?.name || 'React';
      dailyPlans?.push({
        day_number: day,
        core_concepts: dayPlan?.concepts,
        learning_resources: dayPlan?.resources,
        practice_questions: dayPlan?.questions,
        estimated_hours: dailyHours,
        is_completed: false,
        interview_questions: getInterviewQuestions(techName, day, explanationType || 'beginner'),
        learning_context: getDayContent(techName, day, explanationType || 'beginner')
      });
    }

    return dailyPlans;
  };

  const handleTechSelection = (technology) => {
    setSelectedTech(technology);
    setPlanConfig(prev => ({
      ...prev,
      planTitle: `${technology?.name} Interview Prep - ${prev?.totalDays} Days`
    }));
    setCurrentStep('configure');
  };

  const handleConfigSubmit = (config) => {
    setPlanConfig(config);
    const dailyPlans = generateDailyPlan(selectedTech, config?.totalDays, config?.dailyHours, config?.explanationType);
    setGeneratedPlan({
      technology: selectedTech,
      config,
      dailyPlans
    });
    setCurrentStep('generate');
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    setLoading(true);
    try {
      // Create prep plan object
      const planData = {
        technology_id: selectedTech?.id || null,
        technologies: selectedTech,
        total_days: planConfig?.totalDays,
        daily_hours: planConfig?.dailyHours,
        plan_title: planConfig?.planTitle,
        explanation_type: planConfig?.explanationType || 'beginner',
        daily_plans: generatedPlan?.dailyPlans?.map(plan => ({
          day_number: plan?.day_number,
          core_concepts: plan?.core_concepts,
          learning_resources: plan?.learning_resources,
          practice_questions: plan?.practice_questions,
          estimated_hours: plan?.estimated_hours,
          interview_questions: plan?.interview_questions,
          learning_context: plan?.learning_context,
          is_completed: false
        }))
      };

      // Save to backend API
      try {
        await learningsAPI.createPlan(planData);
        await loadMyPlans();
        setCurrentStep('view');
      } catch (apiError) {
        console.log('API save failed, saving to localStorage:', apiError);
        // Fallback to localStorage
        const planId = `plan_${Date.now()}`;
        const localData = {
          id: planId,
          user_id: user?.id || 'test_user',
          ...planData,
          created_at: new Date().toISOString(),
          daily_plans: planData.daily_plans.map(plan => ({
            ...plan,
            id: `day_${Date.now()}_${plan.day_number}`,
            prep_plan_id: planId
          }))
        };
        const storedPlans = localStorage.getItem('prep_plans');
        const plans = storedPlans ? JSON.parse(storedPlans) : [];
        plans.unshift(localData);
        localStorage.setItem('prep_plans', JSON.stringify(plans));
        await loadMyPlans();
        setCurrentStep('view');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep('select');
    setSelectedTech(null);
    setGeneratedPlan(null);
    setPlanConfig({ totalDays: 7, dailyHours: 2, planTitle: '', explanationType: 'beginner' });
  };

  // Removed authentication check for testing - all users can access
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 text-purple-600 mr-3" />
                Interview Tech Prep Planner
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create personalized study schedules for technical interview preparation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetFlow}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-center space-x-8">
            {[
              { key: 'select', label: 'Select Technology', icon: Code },
              { key: 'configure', label: 'Configure Plan', icon: Target },
              { key: 'generate', label: 'Review Plan', icon: Calendar },
              { key: 'view', label: 'My Plans', icon: BookOpen }
            ]?.map((step, index) => {
              const Icon = step?.icon;
              const isActive = currentStep === step?.key;
              const isCompleted = ['select', 'configure', 'generate', 'view']?.indexOf(currentStep) > index;
              
              return (
                <div key={step?.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 text-white' :'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content */}
        {currentStep === 'select' && (
          <TechnologySelector onTechSelect={handleTechSelection} />
        )}
        
        {currentStep === 'configure' && (
          <PlanConfiguration
            selectedTech={selectedTech}
            config={planConfig}
            onConfigSubmit={handleConfigSubmit}
            onBack={() => setCurrentStep('select')}
          />
        )}
        
        {currentStep === 'generate' && (
          <GeneratedPlan
            plan={generatedPlan}
            onSave={handleSavePlan}
            onBack={() => setCurrentStep('configure')}
            loading={loading}
          />
        )}
        
        {currentStep === 'view' && (
          <MyPlans
            plans={myPlans}
            onCreateNew={resetFlow}
            onRefresh={loadMyPlans}
          />
        )}
      </main>
    </div>
  );
};

export default InterviewTechPrepPlanner;