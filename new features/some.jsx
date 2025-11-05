import React, { useState, useEffect } from 'react';
import { Search, Calendar, Book, Briefcase, Grid, Filter, Building2, GraduationCap, Star, ThumbsUp, Clock, TrendingUp, MapPin, Target, CheckCircle, Loader, BookOpen, Code, Lightbulb, Award } from 'lucide-react';

const QuickHireEnhanced = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFilters, setSelectedFilters] = useState({
    company: '',
    college: '',
    rating: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmapConfig, setRoadmapConfig] = useState({
    techStack: '',
    days: 7,
    explanationType: 'beginner'
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  // Sample data for experiences
  const experiences = [
    {
      id: 1,
      company: 'Google',
      college: 'IIT Delhi',
      author: 'Anonymous',
      rating: 4.5,
      date: '2 days ago',
      title: 'Amazing Interview Experience at Google Campus Drive',
      content: 'The interview process was well-structured with 3 rounds. DSA focus was heavy on graphs and dynamic programming...',
      tags: ['On-Campus', 'Software Engineer', 'Hired'],
      likes: 124,
      helpful: 89
    },
    {
      id: 2,
      company: 'Microsoft',
      college: 'BITS Pilani',
      author: 'Anonymous',
      rating: 5,
      date: '5 days ago',
      title: 'Microsoft Campus Placement - Full Process Breakdown',
      content: 'Microsoft visited our campus in September. The process started with an online assessment...',
      tags: ['On-Campus', 'SDE Intern', 'Selected'],
      likes: 201,
      helpful: 156
    },
    {
      id: 3,
      company: 'Amazon',
      college: 'NIT Trichy',
      author: 'Anonymous',
      rating: 4,
      date: '1 week ago',
      title: 'Amazon Campus Drive Experience - What to Expect',
      content: 'Amazon conducted a 2-day drive at our college. Day 1 had online coding test with 2 questions...',
      tags: ['On-Campus', 'SDE-1', 'Waitlisted'],
      likes: 87,
      helpful: 72
    }
  ];

  const techStacks = [
    'React', 'Node.js', 'Python', 'Java', 'Data Structures & Algorithms',
    'System Design', 'Machine Learning', 'DevOps', 'Angular', 'Vue.js'
  ];

  // Backend API call to generate roadmap
  const generateRoadmap = async () => {
    if (!roadmapConfig.techStack) {
      setError('Please select a tech stack');
      return;
    }

    if (roadmapConfig.days > 10) {
      setError('Days cannot exceed 10');
      return;
    }

    setLoading(true);
    setError('');
    setRoadmap(null);
    setSelectedDay(null);

    try {
      // Simulating API call - Replace with your actual backend endpoint
      const response = await fetch('/api/learning/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          techStack: roadmapConfig.techStack,
          days: roadmapConfig.days,
          explanationType: roadmapConfig.explanationType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const data = await response.json();
      setRoadmap(data);
      
      // For demo purposes, using mock data if API is not available
    } catch (err) {
      console.error('API call failed, using mock data:', err);
      // Mock data for demonstration
      const mockRoadmap = generateMockRoadmap();
      setRoadmap(mockRoadmap);
    } finally {
      setLoading(false);
    }
  };

  // Mock roadmap generator (replace this with actual API response)
  const generateMockRoadmap = () => {
    const { techStack, days, explanationType } = roadmapConfig;
    
    const roadmapTemplates = {
      'React': {
        title: 'React Mastery Path',
        description: 'Master React fundamentals and advanced concepts',
        dailyPlans: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          title: getDayTitle('React', i + 1, days),
          topics: getDayTopics('React', i + 1, days),
          content: getDayContent('React', i + 1, explanationType),
          interviewQuestions: getInterviewQuestions('React', i + 1, explanationType),
          practiceProblems: getPracticeProblems('React', i + 1),
          resources: getResources('React', i + 1)
        }))
      },
      'Data Structures & Algorithms': {
        title: 'DSA Interview Preparation',
        description: 'Complete guide to ace coding interviews',
        dailyPlans: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          title: getDayTitle('DSA', i + 1, days),
          topics: getDayTopics('DSA', i + 1, days),
          content: getDayContent('DSA', i + 1, explanationType),
          interviewQuestions: getInterviewQuestions('DSA', i + 1, explanationType),
          practiceProblems: getPracticeProblems('DSA', i + 1),
          resources: getResources('DSA', i + 1)
        }))
      },
      'System Design': {
        title: 'System Design Fundamentals',
        description: 'Learn to design scalable systems',
        dailyPlans: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          title: getDayTitle('System Design', i + 1, days),
          topics: getDayTopics('System Design', i + 1, days),
          content: getDayContent('System Design', i + 1, explanationType),
          interviewQuestions: getInterviewQuestions('System Design', i + 1, explanationType),
          practiceProblems: getPracticeProblems('System Design', i + 1),
          resources: getResources('System Design', i + 1)
        }))
      }
    };

    return roadmapTemplates[techStack] || roadmapTemplates['React'];
  };

  const getDayTitle = (tech, day, totalDays) => {
    const titles = {
      'React': [
        'JSX and Components Basics',
        'State Management with Hooks',
        'Props and Component Communication',
        'useEffect and Side Effects',
        'Context API and Global State',
        'Custom Hooks Development',
        'Performance Optimization',
        'React Router and Navigation',
        'Forms and Validation',
        'Testing and Best Practices'
      ],
      'DSA': [
        'Arrays and Two Pointers',
        'Strings and Pattern Matching',
        'Linked Lists Operations',
        'Stacks and Queues',
        'Trees and Binary Search Trees',
        'Graph Traversal (BFS/DFS)',
        'Dynamic Programming Basics',
        'Greedy Algorithms',
        'Backtracking Problems',
        'Advanced DP and Practice'
      ],
      'System Design': [
        'Scalability Fundamentals',
        'Load Balancing and Caching',
        'Database Design Principles',
        'Microservices Architecture',
        'Message Queues and Async Processing',
        'CDN and Content Delivery',
        'System Design Case Studies',
        'Real-time Systems',
        'Design Popular Systems',
        'Mock Interview Practice'
      ]
    };
    return titles[tech][day - 1] || `Day ${day} Content`;
  };

  const getDayTopics = (tech, day, totalDays) => {
    const topics = {
      'React': {
        1: ['JSX Syntax', 'Functional Components', 'Props Basics', 'Rendering Elements'],
        2: ['useState Hook', 'State Updates', 'Event Handling', 'Controlled Components'],
        3: ['Props Drilling', 'Children Props', 'Composition', 'Component Reusability'],
        4: ['useEffect Basics', 'Dependency Array', 'Cleanup Functions', 'API Calls'],
        5: ['Context Creation', 'Provider/Consumer', 'useContext Hook', 'Global State Management']
      },
      'DSA': {
        1: ['Two Pointer Technique', 'Sliding Window', 'Prefix Sum', 'Array Manipulation'],
        2: ['String Traversal', 'Substring Problems', 'Anagram Detection', 'Palindromes'],
        3: ['Node Structure', 'Traversal Methods', 'Insertion/Deletion', 'Reverse Linked List'],
        4: ['Stack Operations', 'Queue Implementation', 'Monotonic Stack', 'Valid Parentheses'],
        5: ['Tree Traversals', 'BST Properties', 'Tree Construction', 'Path Problems']
      },
      'System Design': {
        1: ['Horizontal Scaling', 'Vertical Scaling', 'CAP Theorem', 'Consistency Models'],
        2: ['Round Robin', 'Weighted Load Balancing', 'Cache Strategies', 'Cache Invalidation'],
        3: ['SQL vs NoSQL', 'Normalization', 'Indexing', 'Sharding Strategies'],
        4: ['Service Communication', 'API Gateway', 'Service Discovery', 'Inter-service Auth'],
        5: ['Message Brokers', 'Pub/Sub Pattern', 'Event-Driven Architecture', 'Kafka Basics']
      }
    };
    return topics[tech][day] || ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'];
  };

  const getDayContent = (tech, day, level) => {
    const content = {
      'React': {
        beginner: `Focus on understanding the fundamentals. JSX is JavaScript XML that allows you to write HTML-like code in JavaScript. Components are reusable building blocks. Start with simple functional components and gradually move to more complex patterns.`,
        intermediate: `Apply React concepts to real-world scenarios. Understand component lifecycle, optimize renders, and manage state effectively. Focus on building complete features rather than isolated components.`,
        advanced: `Deep dive into React internals. Understand reconciliation, fiber architecture, and performance optimization techniques. Learn to make architectural decisions and handle complex state management scenarios.`
      },
      'DSA': {
        beginner: `Start with pattern recognition. Two pointers is about using two references to traverse data efficiently. Focus on understanding time and space complexity. Practice explaining your approach before coding.`,
        intermediate: `Connect algorithms to problem-solving patterns. Recognize when to use specific techniques. Practice explaining trade-offs between different approaches. Focus on optimization.`,
        advanced: `Master edge cases and optimal solutions. Understand the mathematical proofs behind algorithms. Practice explaining solutions with detailed complexity analysis and multiple approaches.`
      },
      'System Design': {
        beginner: `Learn the building blocks of distributed systems. Understand what each component does and why it's needed. Focus on high-level architecture before diving into details.`,
        intermediate: `Design complete systems with trade-offs. Understand when to use specific technologies. Practice explaining design decisions and their impact on system properties.`,
        advanced: `Handle complex scenarios with multiple constraints. Discuss fault tolerance, disaster recovery, and scaling strategies. Explain detailed implementation considerations.`
      }
    };
    return content[tech][level] || content['React'][level];
  };

  const getInterviewQuestions = (tech, day, level) => {
    const questions = {
      'React': {
        beginner: [
          {
            question: "What is JSX and why do we use it?",
            answer: "JSX is a syntax extension for JavaScript that allows writing HTML-like code. We use it because it makes React code more readable and allows us to describe UI structure clearly. It gets compiled to React.createElement calls.",
            answerType: "Clear and simple explanation with practical benefit",
            impressTip: "Mention that JSX is syntactic sugar and show you understand the compilation process"
          },
          {
            question: "Explain the difference between props and state",
            answer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props flow down, state is internal. When state changes, component re-renders.",
            answerType: "Contrast both concepts with key differences",
            impressTip: "Give a quick example: 'Props are like function parameters, state is like variables inside a function'"
          }
        ],
        intermediate: [
          {
            question: "How would you optimize a React component that re-renders too often?",
            answer: "I would use React.memo for functional components to prevent unnecessary re-renders, useMemo for expensive calculations, and useCallback for function references. I'd also check if state updates are batched properly and consider splitting large components.",
            answerType: "Multiple solutions with specific tools",
            impressTip: "Mention you'd first use React DevTools Profiler to identify the issue before optimizing"
          },
          {
            question: "Explain useEffect and its dependency array",
            answer: "useEffect runs side effects after render. The dependency array controls when it runs: empty array means run once on mount, no array means run on every render, and with dependencies means run when those values change. Always include all used variables in dependencies.",
            answerType: "Comprehensive explanation with all scenarios",
            impressTip: "Mention cleanup functions and give a real example like API calls or subscriptions"
          }
        ],
        advanced: [
          {
            question: "How does React's reconciliation algorithm work?",
            answer: "React uses a diffing algorithm that compares virtual DOM trees. It assumes different element types produce different trees, uses keys for list reconciliation, and performs fiber-based updates for better performance. The algorithm is O(n) instead of O(n³) by making assumptions about how UIs typically change.",
            answerType: "Deep technical explanation with complexity analysis",
            impressTip: "Mention fiber architecture and how it enables time-slicing for better user experience"
          }
        ]
      },
      'DSA': {
        beginner: [
          {
            question: "Find if an array contains duplicate elements",
            answer: "I would use a HashSet to track seen elements. Iterate through the array, and for each element, check if it's in the set. If yes, return true. If not, add it to the set. Return false after the loop. Time: O(n), Space: O(n).",
            answerType: "Clear approach with complexity",
            impressTip: "Mention you could also sort first (O(n log n), O(1) space) as an alternative approach"
          },
          {
            question: "How would you reverse a linked list?",
            answer: "I would use three pointers: prev (null), current (head), and next. Iterate through the list, save next node, reverse current's pointer to prev, move prev and current forward. Finally, return prev as new head.",
            answerType: "Step-by-step iterative approach",
            impressTip: "Draw it out if possible, and mention you could also do it recursively"
          }
        ],
        intermediate: [
          {
            question: "Design an LRU Cache with O(1) operations",
            answer: "I would use a HashMap for O(1) lookup and a doubly linked list for O(1) insertion/deletion. The map stores key -> node mapping. Most recent items are at the head, least recent at tail. On get, move node to head. On put, add to head and remove tail if capacity exceeded.",
            answerType: "Complete design with data structures and operations",
            impressTip: "Explain why both data structures are needed and walk through an example"
          }
        ],
        advanced: [
          {
            question: "Find the longest increasing subsequence in O(n log n)",
            answer: "I would use binary search with dynamic programming. Maintain an array where tail[i] is the smallest tail element of all increasing subsequences of length i+1. For each element, binary search for its position and update. The length of this array is the answer. This improves from O(n²) DP to O(n log n).",
            answerType: "Optimal algorithm with optimization explanation",
            impressTip: "Explain why this works and compare it to the naive O(n²) approach"
          }
        ]
      },
      'System Design': {
        beginner: [
          {
            question: "What is load balancing and why is it important?",
            answer: "Load balancing distributes incoming requests across multiple servers to prevent any single server from being overwhelmed. It's important for high availability, scalability, and fault tolerance. Common algorithms include round-robin, least connections, and weighted distribution.",
            answerType: "Definition with purpose and examples",
            impressTip: "Mention both software (Nginx) and hardware load balancers"
          }
        ],
        intermediate: [
          {
            question: "Design a URL shortening service like bit.ly",
            answer: "I would use a hash function or base62 encoding to generate short codes. Store mappings in a distributed database (NoSQL for scalability). Use cache (Redis) for frequently accessed URLs. For high availability, use multiple app servers behind a load balancer. Handle redirects with HTTP 301. Scale with database sharding on hash of short code.",
            answerType: "Complete system with multiple components",
            impressTip: "Discuss trade-offs: hash collisions, custom URLs, analytics, and rate limiting"
          }
        ],
        advanced: [
          {
            question: "Design a distributed rate limiter",
            answer: "I would use a sliding window algorithm with Redis for shared state. Each request checks/updates a sorted set in Redis with timestamps. Use Lua scripts for atomic operations. For high scale, implement local rate limiting with eventual consistency sync. Consider token bucket algorithm for burst handling. Deploy rate limiters at edge (CDN) and API gateway levels. Handle clock skew with logical timestamps.",
            answerType: "Distributed solution with multiple strategies and edge cases",
            impressTip: "Discuss CAP theorem implications, monitoring, and gradual rollout strategies"
          }
        ]
      }
    };

    return questions[tech][level] || questions['React'][level];
  };

  const getPracticeProblems = (tech, day) => {
    const problems = {
      'React': [
        'Build a counter component with increment/decrement',
        'Create a todo list with add/remove functionality',
        'Implement a form with validation',
        'Build a weather app consuming an API'
      ],
      'DSA': [
        'Two Sum (LeetCode Easy)',
        'Valid Parentheses (LeetCode Easy)',
        'Reverse Linked List (LeetCode Easy)',
        'Binary Tree Level Order Traversal (LeetCode Medium)'
      ],
      'System Design': [
        'Design a parking lot system',
        'Design a file storage service',
        'Design a chat application',
        'Design a notification system'
      ]
    };
    return problems[tech] || problems['React'];
  };

  const getResources = (tech, day) => {
    const resources = {
      'React': [
        { type: 'Video', title: 'React Official Tutorial', url: 'https://react.dev' },
        { type: 'Article', title: 'Understanding React Hooks', url: '#' },
        { type: 'Practice', title: 'React Challenges', url: '#' }
      ],
      'DSA': [
        { type: 'Video', title: 'NeetCode - DSA Patterns', url: '#' },
        { type: 'Practice', title: 'LeetCode Problem Set', url: '#' },
        { type: 'Article', title: 'Common Algorithm Patterns', url: '#' }
      ],
      'System Design': [
        { type: 'Video', title: 'System Design Primer', url: '#' },
        { type: 'Article', title: 'Designing Data-Intensive Applications', url: '#' },
        { type: 'Practice', title: 'System Design Interview Questions', url: '#' }
      ]
    };
    return resources[tech] || resources['React'];
  };

  const ExperienceCard = ({ exp }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            {exp.company[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <Building2 className="w-4 h-4" />
              <span>{exp.company}</span>
              <span>•</span>
              <GraduationCap className="w-4 h-4" />
              <span>{exp.college}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-5 h-5 fill-current" />
          <span className="font-semibold">{exp.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{exp.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {exp.tags.map((tag, idx) => (
          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <ThumbsUp className="w-4 h-4" />
            <span>{exp.likes}</span>
          </button>
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>{exp.helpful} found helpful</span>
          </span>
        </div>
        <span className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{exp.date}</span>
        </span>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Job Seeker! 👋</h1>
        <p className="text-blue-100 mb-4">Wednesday, November 5, 2025</p>
        <div className="flex items-center space-x-2 text-lg">
          <span>You have</span>
          <span className="font-bold text-2xl">3 new job matches</span>
          <span>and</span>
          <span className="font-bold text-2xl">2 upcoming interviews</span>
          <span>this week.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Applications</h3>
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last week</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Interview Success</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">78%</p>
          <p className="text-sm text-gray-600 mt-2">Based on your profile</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Learning Hours</h3>
            <Book className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">42h</p>
          <p className="text-sm text-blue-600 mt-2">This month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveTab('learning')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <Target className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Start Interview Prep</h3>
            <p className="text-sm text-gray-600 mt-1">Get personalized roadmap</p>
          </button>
          <button 
            onClick={() => setActiveTab('experiences')}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
          >
            <Book className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Read Experiences</h3>
            <p className="text-sm text-gray-600 mt-1">Campus placement stories</p>
          </button>
        </div>
      </div>
    </div>
  );

  const ExperiencesView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-4">Campus Placement Experiences</h2>
        <p className="text-gray-600 mb-6">Real experiences from students about company drives at their campus</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFilters.company}
              onChange={(e) => setSelectedFilters({...selectedFilters, company: e.target.value})}
            >
              <option value="">All Companies</option>
              <option value="google">Google</option>
              <option value="microsoft">Microsoft</option>
              <option value="amazon">Amazon</option>
              <option value="adobe">Adobe</option>
            </select>
          </div>
          
          <div className="relative">
            <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFilters.college}
              onChange={(e) => setSelectedFilters({...selectedFilters, college: e.target.value})}
            >
              <option value="">All Colleges</option>
              <option value="iit">IIT Delhi</option>
              <option value="bits">BITS Pilani</option>
              <option value="nit">NIT Trichy</option>
              <option value="iiit">IIIT Hyderabad</option>
            </select>
          </div>
          
          <div className="relative">
            <Star className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFilters.rating}
              onChange={(e) => setSelectedFilters({...selectedFilters, rating: e.target.value})}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, college, or keywords..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map(exp => <ExperienceCard key={exp.id} exp={exp} />)}
      </div>

      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        Share Your Experience
      </button>
    </div>
  );

  const LearningView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Quick Interview Preparation</h2>
          <p className="text-purple-100">Get a personalized roadmap based on your timeline and goals</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-6">Configure Your Learning Path</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tech Stack / Framework
              </label>
              <select 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={roadmapConfig.techStack}
                onChange={(e) => setRoadmapConfig({...roadmapConfig, techStack: e.target.value})}
              >
                <option value="">Choose a tech stack...</option>
                {techStacks.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days: {roadmapConfig.days} (Max: 10 days)
              </label>
              <input 
                type="range"
                min="3"
                max="10"
                value={roadmapConfig.days}
                onChange={(e) => setRoadmapConfig({...roadmapConfig, days: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>3 days</span>
                <span>7 days</span>
                <span>10 days</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Explanation Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setRoadmapConfig({...roadmapConfig, explanationType: level})}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                      roadmapConfig.explanationType === level
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {roadmapConfig.explanationType === 'beginner' && '💡 Simple explanations with basic examples'}
                {roadmapConfig.explanationType === 'intermediate' && '🎯 Real-world applications and trade-offs'}
                {roadmapConfig.explanationType === 'advanced' && '🚀 Deep technical details and optimizations'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button 
              onClick={generateRoadmap}
              disabled={!roadmapConfig.techStack || loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating Your Roadmap...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Generate Personalized Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {roadmap && (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{roadmap.title}</h3>
                  <p className="text-gray-600 mt-1">{roadmap.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {roadmapConfig.days} Days
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {roadmapConfig.explanationType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {roadmap.dailyPlans.map((plan) => (
                  <button
                    key={plan.day}
                    onClick={() => setSelectedDay(plan.day)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDay === plan.day
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedDay === plan.day ? 'text-blue-600' : 'text-gray-900'}`}>
                        Day {plan.day}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {plan.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDay && roadmap.dailyPlans[selectedDay - 1] && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedDay}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {roadmap.dailyPlans[selectedDay - 1].title}
                    </h3>
                    <p className="text-gray-600">Day {selectedDay} of {roadmapConfig.days}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Topics to Cover</h4>
                    </div>
                    <ul className="grid grid-cols-2 gap-3">
                      {roadmap.dailyPlans[selectedDay - 1].topics.map((topic, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-bold text-gray-900">Learning Context</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {roadmap.dailyPlans[selectedDay - 1].content}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Interview Questions & How to Answer</h4>
                    </div>
                    <div className="space-y-6">
                      {roadmap.dailyPlans[selectedDay - 1].interviewQuestions.map((qa, idx) => (
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

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Award className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900">Practice Problems</h4>
                    </div>
                    <ul className="space-y-2">
                      {roadmap.dailyPlans[selectedDay - 1].practiceProblems.map((problem, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-gray-700">
                          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Book className="w-5 h-5 text-gray-600" />
                      <h4 className="font-bold text-gray-900">Additional Resources</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {roadmap.dailyPlans[selectedDay - 1].resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:border-blue-400 hover:shadow transition-all"
                        >
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {resource.type}
                          </span>
                          <span className="text-sm text-gray-700 flex-1">{resource.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-6 border-t">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                    disabled={selectedDay === 1}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    ← Previous Day
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(roadmapConfig.days, selectedDay + 1))}
                    disabled={selectedDay === roadmapConfig.days}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next Day →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QuickHire</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'experiences' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Book className="w-4 h-4 inline mr-2" />
                Experiences
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'learning' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Learning
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'experiences' && <ExperiencesView />}
        {activeTab === 'learning' && <LearningView />}
      </main>
    </div>
  );
};

export default QuickHireEnhanced;