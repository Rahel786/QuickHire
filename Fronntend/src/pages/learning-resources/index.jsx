import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

import TopicCard from './components/TopicCard';
import LearningProgress from './components/LearningProgress';
import SearchAndFilter from './components/SearchAndFilter';
import BookmarkedContent from './components/BookmarkedContent';
import StudyNotes from './components/StudyNotes';

const LearningResources = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    status: 'all',
    sortBy: 'relevance'
  });

  // Base template for learning topics (all start at 0% progress)
  const baseTopicsTemplate = [
    {
      id: 1,
      title: "Data Structures",
      description: "Master fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
      icon: "Database",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      estimatedTime: "8-10 hours",
      nextLesson: "binary-trees",
      isBookmarked: true,
      isExpanded: false,
      lessons: [
        {
          id: "arrays",
          title: "Arrays and Dynamic Arrays",
          duration: "45 min",
          type: "Video + Practice",
          difficulty: "Easy",
          isCompleted: true,
          isActive: false,
          hasNotes: true
        },
        {
          id: "linked-lists",
          title: "Linked Lists Implementation",
          duration: "60 min",
          type: "Interactive",
          difficulty: "Medium",
          isCompleted: true,
          isActive: false,
          hasNotes: false
        },
        {
          id: "stacks-queues",
          title: "Stacks and Queues",
          duration: "50 min",
          type: "Video + Quiz",
          difficulty: "Easy",
          isCompleted: true,
          isActive: false,
          hasNotes: true
        },
        {
          id: "binary-trees",
          title: "Binary Trees and BST",
          duration: "75 min",
          type: "Interactive",
          difficulty: "Medium",
          isCompleted: false,
          isActive: true,
          hasNotes: false
        },
        {
          id: "graphs",
          title: "Graph Algorithms",
          duration: "90 min",
          type: "Video + Practice",
          difficulty: "Hard",
          isCompleted: false,
          isActive: false,
          hasNotes: false
        }
      ]
    },
    {
      id: 2,
      title: "Database Management Systems",
      description: "Learn SQL, database design, normalization, indexing, and advanced DBMS concepts.",
      icon: "Server",
      progress: 40,
      totalLessons: 18,
      completedLessons: 7,
      estimatedTime: "6-8 hours",
      nextLesson: "joins",
      isBookmarked: false,
      isExpanded: false,
      lessons: [
        {
          id: "sql-basics",
          title: "SQL Fundamentals",
          duration: "40 min",
          type: "Interactive",
          difficulty: "Easy",
          isCompleted: true,
          isActive: false,
          hasNotes: true
        },
        {
          id: "database-design",
          title: "Database Design Principles",
          duration: "55 min",
          type: "Video + Quiz",
          difficulty: "Medium",
          isCompleted: true,
          isActive: false,
          hasNotes: false
        },
        {
          id: "joins",
          title: "SQL Joins and Relationships",
          duration: "50 min",
          type: "Practice",
          difficulty: "Medium",
          isCompleted: false,
          isActive: true,
          hasNotes: false
        },
        {
          id: "indexing",
          title: "Indexing and Performance",
          duration: "65 min",
          type: "Video + Practice",
          difficulty: "Hard",
          isCompleted: false,
          isActive: false,
          hasNotes: false
        }
      ]
    },
    {
      id: 3,
      title: "Object-Oriented Programming",
      description: "Understand OOP principles, design patterns, and best practices for clean code architecture.",
      icon: "Code",
      progress: 85,
      totalLessons: 20,
      completedLessons: 17,
      estimatedTime: "7-9 hours",
      nextLesson: "design-patterns",
      isBookmarked: true,
      isExpanded: false,
      lessons: [
        {
          id: "oop-basics",
          title: "OOP Fundamentals",
          duration: "35 min",
          type: "Video",
          difficulty: "Easy",
          isCompleted: true,
          isActive: false,
          hasNotes: true
        },
        {
          id: "inheritance",
          title: "Inheritance and Polymorphism",
          duration: "50 min",
          type: "Interactive",
          difficulty: "Medium",
          isCompleted: true,
          isActive: false,
          hasNotes: true
        },
        {
          id: "encapsulation",
          title: "Encapsulation and Abstraction",
          duration: "45 min",
          type: "Video + Quiz",
          difficulty: "Medium",
          isCompleted: true,
          isActive: false,
          hasNotes: false
        },
        {
          id: "design-patterns",
          title: "Common Design Patterns",
          duration: "80 min",
          type: "Interactive",
          difficulty: "Hard",
          isCompleted: false,
          isActive: true,
          hasNotes: false
        }
      ]
    }
  ];

  // Initialize topics with 0% progress for all users
  const getDefaultTopics = () => {
    return baseTopicsTemplate.map(topic => ({
      ...topic,
      progress: 0,
      completedLessons: 0,
      lessons: topic.lessons.map((lesson, index) => ({
        ...lesson,
        isCompleted: false,
        isActive: index === 0 // First lesson is active
      }))
    }));
  };

  const [topics, setTopics] = useState(getDefaultTopics);

  // Save user progress to localStorage
  const saveUserProgress = (updatedTopics) => {
    const userId = user?.id || 'guest';
    const storageKey = `learning_progress_${userId}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedTopics));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  // Reload topics when user changes
  useEffect(() => {
    const userId = user?.id || 'guest';
    const storageKey = `learning_progress_${userId}`;
    
    // Load user's progress from localStorage
    const savedProgress = localStorage.getItem(storageKey);
    
    if (savedProgress) {
      try {
        const userProgress = JSON.parse(savedProgress);
        // Merge base template with user progress
        const mergedTopics = baseTopicsTemplate.map(topic => {
          const savedTopic = userProgress.find(t => t.id === topic.id);
          if (savedTopic) {
            // Calculate progress based on completed lessons
            const completedCount = savedTopic.lessons?.filter(l => l.isCompleted).length || 0;
            const totalLessons = savedTopic.lessons?.length || topic.lessons.length;
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            
            // Find next incomplete lesson
            const nextIncompleteLesson = savedTopic.lessons?.find(l => !l.isCompleted);
            const nextLesson = nextIncompleteLesson?.id || savedTopic.lessons?.[0]?.id || topic.nextLesson;
            
            return {
              ...topic,
              ...savedTopic,
              progress,
              completedLessons: completedCount,
              nextLesson
            };
          }
          // New topic for this user - all lessons incomplete
          return {
            ...topic,
            progress: 0,
            completedLessons: 0,
            lessons: topic.lessons.map(lesson => ({
              ...lesson,
              isCompleted: false,
              isActive: lesson.id === topic.lessons[0]?.id
            }))
          };
        });
        setTopics(mergedTopics);
      } catch (error) {
        console.error('Error loading user progress:', error);
        // Fallback to default
        const defaultTopics = baseTopicsTemplate.map(topic => ({
          ...topic,
          progress: 0,
          completedLessons: 0,
          lessons: topic.lessons.map((lesson, index) => ({
            ...lesson,
            isCompleted: false,
            isActive: index === 0
          }))
        }));
        setTopics(defaultTopics);
      }
    } else {
      // New user - initialize all topics with 0% progress
      const defaultTopics = baseTopicsTemplate.map(topic => ({
        ...topic,
        progress: 0,
        completedLessons: 0,
        lessons: topic.lessons.map((lesson, index) => ({
          ...lesson,
          isCompleted: false,
          isActive: index === 0
        }))
      }));
      setTopics(defaultTopics);
    }
  }, [user?.id]);

  // Mock progress data
  const progressData = {
    totalHours: 42,
    completedLessons: 40,
    currentStreak: 5,
    conceptsMastered: 127,
    weeklyProgress: {
      current: 8,
      target: 12
    },
    recentActivity: [
      {
        type: 'completed',
        description: 'Completed "Binary Trees and BST" lesson',
        time: '2 hours ago'
      },
      {
        type: 'started',
        description: 'Started "Graph Algorithms" practice',
        time: '1 day ago'
      },
      {
        type: 'note',
        description: 'Added notes to "SQL Joins" lesson',
        time: '2 days ago'
      },
      {
        type: 'completed',
        description: 'Finished "Encapsulation" quiz with 95%',
        time: '3 days ago'
      }
    ]
  };

  // Mock bookmarks data
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: "Binary Search Tree Implementation",
      description: "Complete implementation of BST with insertion, deletion, and traversal methods in multiple programming languages.",
      topic: "Data Structures",
      icon: "Database",
      difficulty: "Medium",
      duration: "45 min",
      savedDate: "2 days ago",
      lastAccessed: "1 day ago"
    },
    {
      id: 2,
      title: "Database Normalization Rules",
      description: "Comprehensive guide to 1NF, 2NF, 3NF, and BCNF with practical examples and step-by-step normalization process.",
      topic: "DBMS",
      icon: "Server",
      difficulty: "Hard",
      duration: "60 min",
      savedDate: "1 week ago",
      lastAccessed: "3 days ago"
    },
    {
      id: 3,
      title: "Observer Design Pattern",
      description: "Implementation and use cases of the Observer pattern in different programming languages with real-world examples.",
      topic: "OOP",
      icon: "Code",
      difficulty: "Medium",
      duration: "35 min",
      savedDate: "3 days ago",
      lastAccessed: null
    }
  ]);

  // Mock study notes data
  const [studyNotes, setStudyNotes] = useState([
    {
      id: 1,
      title: "Time Complexity Cheat Sheet",
      content: `Big O Notation Quick Reference:\n\nO(1) - Constant time\nO(log n) - Logarithmic time\nO(n) - Linear time\nO(n log n) - Linearithmic time\nO(n²) - Quadratic time\n\nCommon algorithms:\n- Binary Search: O(log n)\n- Merge Sort: O(n log n)\n- Quick Sort: Average O(n log n), Worst O(n²)`,
      topic: "Data Structures",
      tags: ["algorithms", "complexity", "big-o"],
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-16T14:20:00Z"
    },
    {
      id: 2,
      title: "SQL Join Types Summary",
      content: `Different types of SQL joins:\n\nINNER JOIN - Returns matching records from both tables\nLEFT JOIN - Returns all records from left table + matching from right\nRIGHT JOIN - Returns all records from right table + matching from left\nFULL OUTER JOIN - Returns all records when there's a match in either table\n\nRemember: Use appropriate join type based on data requirements!`,
      topic: "DBMS",
      tags: ["sql", "joins", "database"],
      createdAt: "2025-01-10T09:15:00Z",
      updatedAt: "2025-01-10T09:15:00Z"
    },
    {
      id: 3,
      title: "SOLID Principles",
      content: `SOLID Design Principles:\n\nS - Single Responsibility Principle\nO - Open/Closed Principle\nL - Liskov Substitution Principle\nI - Interface Segregation Principle\nD - Dependency Inversion Principle\n\nThese principles help create maintainable, flexible, and robust software designs.`,
      topic: "OOP",
      tags: ["solid", "design-principles", "clean-code"],
      createdAt: "2025-01-12T16:45:00Z",
      updatedAt: "2025-01-14T11:30:00Z"
    }
  ]);

  const tabs = [
    { id: 'topics', label: 'Learning Topics', icon: 'BookOpen' },
    { id: 'progress', label: 'My Progress', icon: 'TrendingUp' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
    { id: 'notes', label: 'Study Notes', icon: 'FileText' }
  ];

  // Filter and search logic
  const getFilteredTopics = () => {
    let filtered = [...topics];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(topic =>
        topic?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        topic?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        topic?.lessons?.some(lesson =>
          lesson?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      );
    }

    // Apply topic filter
    if (filters?.topic !== 'all') {
      const topicMap = {
        'data-structures': 'Data Structures',
        'dbms': 'Database Management Systems',
        'oop': 'Object-Oriented Programming'
      };
      filtered = filtered?.filter(topic => topic?.title === topicMap?.[filters?.topic]);
    }

    // Apply difficulty filter (based on lessons)
    if (filters?.difficulty !== 'all') {
      filtered = filtered?.filter(topic =>
        topic?.lessons?.some(lesson =>
          lesson?.difficulty?.toLowerCase() === filters?.difficulty
        )
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(topic => {
        if (filters?.status === 'completed') return topic?.progress === 100;
        if (filters?.status === 'in-progress') return topic?.progress > 0 && topic?.progress < 100;
        if (filters?.status === 'not-started') return topic?.progress === 0;
        return true;
      });
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'progress':
          return b?.progress - a?.progress;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          const aDiff = Math.max(...a?.lessons?.map(l => difficultyOrder?.[l?.difficulty] || 0));
          const bDiff = Math.max(...b?.lessons?.map(l => difficultyOrder?.[l?.difficulty] || 0));
          return aDiff - bDiff;
        case 'duration':
          return parseInt(a?.estimatedTime) - parseInt(b?.estimatedTime);
        case 'recent':
          return b?.id - a?.id;
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Event handlers
  const handleToggleExpand = (topicId) => {
    setTopics(topics?.map(topic =>
      topic?.id === topicId
        ? { ...topic, isExpanded: !topic?.isExpanded }
        : topic
    ));
  };

  // Mark lesson as complete/incomplete
  const handleToggleLessonComplete = (topicId, lessonId) => {
    const updatedTopics = topics.map(topic => {
      if (topic.id === topicId) {
        const updatedLessons = topic.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            const newCompletedState = !lesson.isCompleted;
            return {
              ...lesson,
              isCompleted: newCompletedState,
              isActive: !newCompletedState // Make it active if marking as incomplete
            };
          }
          // If we're marking a lesson as complete, find and activate the next incomplete lesson
          return lesson;
        });

        // After marking complete, activate the next incomplete lesson
        if (updatedLessons.find(l => l.id === lessonId)?.isCompleted) {
          const currentIndex = updatedLessons.findIndex(l => l.id === lessonId);
          const nextIncomplete = updatedLessons.slice(currentIndex + 1).find(l => !l.isCompleted);
          if (nextIncomplete) {
            const nextIndex = updatedLessons.findIndex(l => l.id === nextIncomplete.id);
            updatedLessons[nextIndex] = { ...updatedLessons[nextIndex], isActive: true };
          }
        }

        // Calculate new progress
        const completedCount = updatedLessons.filter(l => l.isCompleted).length;
        const totalLessons = updatedLessons.length;
        const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Find next incomplete lesson
        const nextIncompleteLesson = updatedLessons.find(l => !l.isCompleted);
        const nextLesson = nextIncompleteLesson?.id || updatedLessons[updatedLessons.length - 1]?.id;

        return {
          ...topic,
          lessons: updatedLessons,
          progress,
          completedLessons: completedCount,
          nextLesson
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
    saveUserProgress(updatedTopics);
  };

  const handleBookmark = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    const isCurrentlyBookmarked = topic?.isBookmarked;
    
    // Toggle bookmark status on topic
    setTopics(topics?.map(t =>
      t?.id === topicId
        ? { ...t, isBookmarked: !t?.isBookmarked }
        : t
    ));
    
    // Add or remove from bookmarks array
    if (isCurrentlyBookmarked) {
      // Remove from bookmarks
      setBookmarks(bookmarks.filter(b => b.topicId !== topicId));
    } else if (topic) {
      // Add to bookmarks
      const newBookmark = {
        id: Date.now(),
        topicId: topicId,
        title: topic.title,
        description: topic.description,
        topic: topic.category || 'General',
        icon: topic.icon,
        difficulty: topic.difficulty,
        duration: topic.estimatedTime,
        savedDate: 'Just now'
      };
      setBookmarks([newBookmark, ...bookmarks]);
    }
  };

  // Map topics and lessons to external learning resources
  const getLearningResourceUrl = (topicId, lessonId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return null;

    const topicTitle = topic.title.toLowerCase();
    const lesson = lessonId ? topic.lessons?.find(l => l.id === lessonId) : null;
    const lessonTitle = lesson?.title?.toLowerCase() || '';

    // Data Structures & Algorithms resources
    if (topicTitle.includes('data structure') || topicTitle.includes('dsa')) {
      if (lessonTitle.includes('array') || lessonTitle.includes('list')) {
        return 'https://www.geeksforgeeks.org/array-data-structure/';
      } else if (lessonTitle.includes('linked list')) {
        return 'https://www.geeksforgeeks.org/data-structures/linked-list/';
      } else if (lessonTitle.includes('stack') || lessonTitle.includes('queue')) {
        return 'https://www.geeksforgeeks.org/stack-data-structure/';
      } else if (lessonTitle.includes('tree') || lessonTitle.includes('bst')) {
        return 'https://www.geeksforgeeks.org/binary-tree-data-structure/';
      } else if (lessonTitle.includes('graph')) {
        return 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/';
      } else if (lessonTitle.includes('sort') || lessonTitle.includes('search')) {
        return 'https://www.geeksforgeeks.org/sorting-algorithms/';
      } else {
        return 'https://www.geeksforgeeks.org/data-structures/';
      }
    }
    
    // DBMS resources
    if (topicTitle.includes('database') || topicTitle.includes('dbms')) {
      if (lessonTitle.includes('sql') || lessonTitle.includes('query')) {
        return 'https://www.w3schools.com/sql/';
      } else if (lessonTitle.includes('normalization') || lessonTitle.includes('normal')) {
        return 'https://www.geeksforgeeks.org/normalization-in-dbms/';
      } else if (lessonTitle.includes('join')) {
        return 'https://www.w3schools.com/sql/sql_join.asp';
      } else if (lessonTitle.includes('index')) {
        return 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/';
      } else if (lessonTitle.includes('design')) {
        return 'https://www.geeksforgeeks.org/database-design-in-dbms/';
      } else {
        return 'https://www.geeksforgeeks.org/dbms/';
      }
    }
    
    // OOP resources
    if (topicTitle.includes('object-oriented') || topicTitle.includes('oop')) {
      if (lessonTitle.includes('inheritance') || lessonTitle.includes('polymorphism')) {
        return 'https://www.freecodecamp.org/news/object-oriented-programming-concepts/';
      } else if (lessonTitle.includes('encapsulation') || lessonTitle.includes('abstraction')) {
        return 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/';
      } else if (lessonTitle.includes('design pattern')) {
        return 'https://refactoring.guru/design-patterns';
      } else if (lessonTitle.includes('basic') || lessonTitle.includes('fundamental')) {
        return 'https://www.freecodecamp.org/news/object-oriented-programming-concepts/';
      } else {
        return 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/';
      }
    }

    // Default fallback - YouTube search
    const searchQuery = encodeURIComponent(`${topic.title} ${lesson?.title || 'tutorial'}`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  const handleStartLesson = (topicId, lessonId) => {
    const resourceUrl = getLearningResourceUrl(topicId, lessonId);
    
    if (resourceUrl) {
      // Open in new tab
      window.open(resourceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: scroll to topic if URL not found
      const topicElement = document.getElementById(`topic-${topicId}`);
      if (topicElement) {
        topicElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const topic = topics.find(t => t.id === topicId);
        if (topic && !topic.isExpanded) {
          handleToggleExpand(topicId);
        }
      }
    }
  };

  const handleRemoveBookmark = (bookmarkId) => {
    setBookmarks(bookmarks?.filter(bookmark => bookmark?.id !== bookmarkId));
  };

  const handleOpenContent = (bookmark) => {
    // Open bookmarked content in external resource
    if (bookmark.topicId) {
      const resourceUrl = getLearningResourceUrl(bookmark.topicId, null);
      if (resourceUrl) {
        window.open(resourceUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback: scroll to topic
        const topicElement = document.getElementById(`topic-${bookmark.topicId}`);
        if (topicElement) {
          topicElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const topic = topics.find(t => t.id === bookmark.topicId);
          if (topic && !topic.isExpanded) {
            handleToggleExpand(bookmark.topicId);
          }
        }
      }
    }
  };

  const handleAddNote = (noteData) => {
    const newNote = {
      id: Date.now(),
      ...noteData
    };
    setStudyNotes([newNote, ...studyNotes]);
  };

  const handleEditNote = (noteId, updatedData) => {
    setStudyNotes(studyNotes?.map(note =>
      note?.id === noteId ? { ...note, ...updatedData } : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    setStudyNotes(studyNotes?.filter(note => note?.id !== noteId));
  };

  const filteredTopics = getFilteredTopics();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="GraduationCap" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Learning Resources</h1>
                <p className="text-muted-foreground">
                  Master essential concepts in Data Structures, DBMS, and OOP
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'topics' && (
              <>
                <SearchAndFilter
                  onSearch={setSearchQuery}
                  onFilter={setFilters}
                  filters={filters}
                  searchQuery={searchQuery}
                />
                
                {filteredTopics?.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg shadow-card p-12 text-center">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No topics found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters to find relevant content.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTopics?.map((topic) => (
                  <TopicCard
                    key={topic?.id}
                    topic={topic}
                    onToggleExpand={handleToggleExpand}
                    onBookmark={handleBookmark}
                    onStartLesson={handleStartLesson}
                    onToggleLessonComplete={handleToggleLessonComplete}
                  />
                ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'progress' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LearningProgress progressData={progressData} />
                </div>
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="text-sm font-medium text-foreground">
                          {Math.round((progressData?.completedLessons / 62) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Session</span>
                        <span className="text-sm font-medium text-foreground">1.2 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Best Streak</span>
                        <span className="text-sm font-medium text-foreground">12 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Favorite Topic</span>
                        <span className="text-sm font-medium text-foreground">Data Structures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <BookmarkedContent
                bookmarks={bookmarks}
                onRemoveBookmark={handleRemoveBookmark}
                onOpenContent={handleOpenContent}
              />
            )}

            {activeTab === 'notes' && (
              <StudyNotes
                notes={studyNotes}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onSearchNotes={() => {}}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningResources;