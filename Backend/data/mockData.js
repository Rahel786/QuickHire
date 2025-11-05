// Mock data for experiences
export const experiences = [
  {
    id: 'exp_1',
    user_id: 'user_1',
    company_name: 'Google',
    position_title: 'Software Engineer',
    college: 'IIT Delhi',
    batch_year: 2024,
    rating: 4.5,
    overall_difficulty: 'hard',
    preparation_tips: 'Focus on DSA and system design. Practice LeetCode problems daily.',
    resources: 'Cracking the Coding Interview, LeetCode Premium',
    likes_count: 124,
    helpful_count: 89,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    interview_rounds: [
      {
        id: 'round_1',
        round_type: 'coding',
        round_number: 1,
        questions_pattern: '2 coding problems, 45 minutes each',
        detailed_questions: 'Reverse linked list, Find cycle in graph',
        duration_minutes: 90,
        difficulty: 'hard',
        tips: 'Write clean code, explain your approach'
      },
      {
        id: 'round_2',
        round_type: 'technical',
        round_number: 2,
        questions_pattern: 'System design + technical questions',
        detailed_questions: 'Design a URL shortener',
        duration_minutes: 60,
        difficulty: 'hard',
        tips: 'Discuss trade-offs, scalability'
      }
    ],
    user_profiles: {
      full_name: 'Anonymous',
      college: 'IIT Delhi'
    }
  },
  {
    id: 'exp_2',
    user_id: 'user_2',
    company_name: 'Microsoft',
    position_title: 'SDE Intern',
    college: 'BITS Pilani',
    batch_year: 2024,
    rating: 5,
    overall_difficulty: 'medium',
    preparation_tips: 'Practice coding problems, especially on arrays and strings.',
    resources: 'GeeksforGeeks, Codeforces',
    likes_count: 201,
    helpful_count: 156,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    interview_rounds: [
      {
        id: 'round_1',
        round_type: 'mcq',
        round_number: 1,
        questions_pattern: '30 MCQs on CS fundamentals',
        duration_minutes: 60,
        difficulty: 'medium',
        tips: 'Review core CS concepts'
      },
      {
        id: 'round_2',
        round_type: 'coding',
        round_number: 2,
        questions_pattern: '2 coding problems',
        detailed_questions: 'Two sum, Binary tree traversal',
        duration_minutes: 60,
        difficulty: 'medium',
        tips: 'Think out loud, optimize solution'
      }
    ],
    user_profiles: {
      full_name: 'Anonymous',
      college: 'BITS Pilani'
    }
  },
  {
    id: 'exp_3',
    user_id: 'user_1',
    company_name: 'Amazon',
    position_title: 'SDE-1',
    college: 'NIT Trichy',
    batch_year: 2023,
    rating: 4,
    overall_difficulty: 'very_hard',
    preparation_tips: 'Focus on leadership principles, STAR method for behavioral questions.',
    resources: 'Amazon Leadership Principles, LeetCode',
    likes_count: 87,
    helpful_count: 72,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    interview_rounds: [
      {
        id: 'round_1',
        round_type: 'coding',
        round_number: 1,
        questions_pattern: '2 coding problems',
        detailed_questions: 'LRU Cache, Merge intervals',
        duration_minutes: 90,
        difficulty: 'hard',
        tips: 'Focus on time complexity'
      },
      {
        id: 'round_2',
        round_type: 'technical',
        round_number: 2,
        questions_pattern: 'System design question',
        detailed_questions: 'Design a notification system',
        duration_minutes: 60,
        difficulty: 'hard',
        tips: 'Discuss scalability from day 1'
      }
    ],
    user_profiles: {
      full_name: 'Anonymous',
      college: 'NIT Trichy'
    }
  }
];

// Mock data for colleges
export const colleges = [
  { name: 'IIT Delhi', abbreviation: 'IITD', type: 'IIT' },
  { name: 'IIT Bombay', abbreviation: 'IITB', type: 'IIT' },
  { name: 'IIT Madras', abbreviation: 'IITM', type: 'IIT' },
  { name: 'IIT Kanpur', abbreviation: 'IITK', type: 'IIT' },
  { name: 'IIT Kharagpur', abbreviation: 'IITKGP', type: 'IIT' },
  { name: 'IIT Roorkee', abbreviation: 'IITR', type: 'IIT' },
  { name: 'IIT Guwahati', abbreviation: 'IITG', type: 'IIT' },
  { name: 'IIT Hyderabad', abbreviation: 'IITH', type: 'IIT' },
  { name: 'IIT Indore', abbreviation: 'IITI', type: 'IIT' },
  { name: 'IIT Varanasi', abbreviation: 'IITBHU', type: 'IIT' },
  { name: 'BITS Pilani', abbreviation: 'BITS', type: 'Private' },
  { name: 'BITS Goa', abbreviation: 'BITS Goa', type: 'Private' },
  { name: 'BITS Hyderabad', abbreviation: 'BITS Hyd', type: 'Private' },
  { name: 'NIT Trichy', abbreviation: 'NITT', type: 'NIT' },
  { name: 'NIT Warangal', abbreviation: 'NITW', type: 'NIT' },
  { name: 'NIT Surathkal', abbreviation: 'NITK', type: 'NIT' },
  { name: 'NIT Calicut', abbreviation: 'NITC', type: 'NIT' },
  { name: 'NIT Rourkela', abbreviation: 'NITR', type: 'NIT' },
  { name: 'IIIT Hyderabad', abbreviation: 'IIITH', type: 'IIIT' },
  { name: 'IIIT Bangalore', abbreviation: 'IIITB', type: 'IIIT' },
  { name: 'IIIT Delhi', abbreviation: 'IIITD', type: 'IIIT' },
  { name: 'IIIT Allahabad', abbreviation: 'IIITA', type: 'IIIT' },
  { name: 'DTU', abbreviation: 'DTU', type: 'State' },
  { name: 'NSIT', abbreviation: 'NSIT', type: 'State' },
  { name: 'JMI', abbreviation: 'JMI', type: 'State' },
  { name: 'JNU', abbreviation: 'JNU', type: 'Central' },
  { name: 'DU', abbreviation: 'DU', type: 'Central' },
  { name: 'VIT Vellore', abbreviation: 'VIT', type: 'Private' },
  { name: 'SRM', abbreviation: 'SRM', type: 'Private' },
  { name: 'Manipal', abbreviation: 'MIT', type: 'Private' },
  { name: 'Amity', abbreviation: 'Amity', type: 'Private' },
  { name: 'LPU', abbreviation: 'LPU', type: 'Private' }
];

// Mock data for learning plans
export const learningPlans = [
  {
    id: 'plan_1',
    user_id: 'user_1',
    technology_id: 'react',
    technologies: { name: 'React', id: 'react' },
    total_days: 7,
    daily_hours: 2,
    plan_title: 'React Interview Prep - 7 Days',
    explanation_type: 'beginner',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daily_plans: [
      {
        id: 'day_1',
        day_number: 1,
        core_concepts: ['JSX Syntax', 'Functional Components', 'Props Basics'],
        learning_resources: ['React Documentation', 'Codecademy React Course'],
        practice_questions: ['What is JSX?', 'Difference between props and state?'],
        estimated_hours: 2,
        is_completed: true
      }
    ]
  }
];


