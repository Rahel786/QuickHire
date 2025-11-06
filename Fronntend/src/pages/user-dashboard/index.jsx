import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, BookOpen, Bell, Search, ChevronRight, Briefcase } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import Header from "../../components/ui/Header";
import WelcomeSection from "./components/WelcomeSection";
import QuickSearchBar from "./components/QuickSearchBar";
import JobMatchCard from "./components/JobMatchCard";
import ActionCard from "./components/ActionCard";
import LearningProgressCard from "./components/LearningProgressCard";
import EventCard from "./components/EventCard";
import ActivityFeedItem from "./components/ActivityFeedItem";

export default function UserDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const { user } = useAuth();

  // Mock job applications data
  const jobApplications = [
    { id: 1, job_title: 'Frontend Developer', company_name: 'Google', status: 'applied', applied_at: new Date().toISOString() },
    { id: 2, job_title: 'Software Engineer', company_name: 'Microsoft', status: 'interview', applied_at: new Date().toISOString() }
  ];
  const applicationsLoading = false;

  // Mock learning data
  const learningData = [];
  const learningLoading = false;

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    stats: {
      applications: 12,
      skillsPracticed: 45,
      modulesCompleted: 8
    }
  };

  // Mock recent job matches
  const recentJobMatches = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center",
      location: "Mountain View, CA",
      salary: "$95,000 - $130,000",
      postedTime: "2 hours ago",
      matchScore: 92,
      applicants: 45
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Microsoft",
      companyLogo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=100&h=100&fit=crop&crop=center",
      location: "Seattle, WA",
      salary: "$100,000 - $140,000",
      postedTime: "4 hours ago",
      matchScore: 88,
      applicants: 67
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Amazon",
      companyLogo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center",
      location: "Austin, TX",
      salary: "$90,000 - $125,000",
      postedTime: "6 hours ago",
      matchScore: 85,
      applicants: 89
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "React Advanced Patterns Workshop",
      type: "workshop",
      date: "Dec 15",
      time: "2:00 PM - 5:00 PM",
      description: "Deep dive into advanced React patterns including render props, compound components, and custom hooks.",
      organizer: "Tech Academy",
      attendees: 156,
      isRegistered: false
    },
    {
      id: 2,
      title: "AI/ML Career Opportunities Webinar",
      type: "webinar",
      date: "Dec 18",
      time: "6:00 PM - 7:30 PM",
      description: "Explore career paths in artificial intelligence and machine learning with industry experts.",
      organizer: "DataScience Hub",
      attendees: 234,
      isRegistered: true
    },
    {
      id: 3,
      title: "Winter Coding Hackathon 2024",
      type: "hackathon",
      date: "Dec 20-22",
      time: "48 hours",
      description: "Build innovative solutions for real-world problems. Prizes worth $50,000 up for grabs!",
      organizer: "CodeFest",
      attendees: 512,
      isRegistered: false
    }
  ];

  // Mock learning progress
  const learningProgress = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      type: "dsa",
      description: "Master arrays, linked lists, trees, and graphs",
      progress: 75,
      completed: "18/24 topics",
      timeSpent: "32 hours",
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Database Management Systems",
      type: "dbms",
      description: "Learn SQL, normalization, and database design",
      progress: 60,
      completed: "12/20 modules",
      timeSpent: "24 hours",
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      title: "Object-Oriented Programming",
      type: "oop",
      description: "Understand OOP concepts and design patterns",
      progress: 90,
      completed: "27/30 lessons",
      timeSpent: "45 hours",
      lastActivity: "3 hours ago"
    }
  ];

  // Mock action cards
  const actionCards = [
    {
      id: 1,
      title: "Campus Placement Experiences",
      description: "Read real experiences from students about company drives at their campus",
      icon: "BookOpen",
      type: "experiences",
      route: "/senior-experience-sharing",
      subtitle: "Filter by company, college & rating",
      badge: "New"
    },
    {
      id: 2,
      title: "Interview Prep Roadmap",
      description: "Get personalized learning roadmap with interview Q&A based on your timeline",
      icon: "Target",
      type: "learning-roadmap",
      route: "/interview-tech-prep-planner",
      subtitle: "Tech stack selection & daily plans",
      badge: "New"
    },
    {
      id: 3,
      title: "Find Your Dream Job",
      description: "Browse thousands of job opportunities from top companies worldwide",
      icon: "Briefcase",
      type: "job-search",
      route: "/job-search-results",
      subtitle: "500+ new jobs today"
    },
    {
      id: 4,
      title: "Attend Career Events",
      description: "Join webinars, workshops, and networking events",
      icon: "Calendar",
      type: "events",
      route: "/career-events-calendar",
      subtitle: "15+ events this month"
    }
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "job-bookmark",
      action: "Bookmarked",
      target: "Senior React Developer at Netflix",
      details: "Full-time • Remote • $120,000 - $160,000",
      company: "Netflix",
      companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=50&h=50&fit=crop&crop=center",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      route: "/job-search-results",
      tags: ["React", "JavaScript", "Remote"]
    },
    {
      id: 2,
      type: "coding-problem",
      action: "Solved",
      target: "Two Sum Problem",
      details: "Successfully solved using HashMap approach in O(n) time complexity",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      route: "/learning-resources",
      tags: ["Arrays", "HashMap", "Easy"]
    },
    {
      id: 3,
      type: "event-registration",
      action: "Registered for",
      target: "AI/ML Career Opportunities Webinar",
      details: "December 18, 2024 • 6:00 PM - 7:30 PM • DataScience Hub",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      route: "/career-events-calendar",
      tags: ["AI", "ML", "Career"]
    },
    {
      id: 4,
      type: "learning-complete",
      action: "Completed",
      target: "Binary Trees Module",
      details: "Finished all 8 lessons and passed the final quiz with 95% score",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      route: "/learning-resources",
      tags: ["DSA", "Trees", "Quiz"]
    },
    {
      id: 5,
      type: "application-submit",
      action: "Applied to",
      target: "Frontend Developer at Spotify",
      details: "Application submitted with resume and cover letter",
      company: "Spotify",
      companyLogo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=50&h=50&fit=crop&crop=center",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      route: "/job-search-results",
      tags: ["Frontend", "React", "Music"]
    }
  ];

  const handleSearch = (query, location) => {
    setSearchQuery(query);
    setSelectedLocation(location);
    // Search functionality (mock implementation)
    console.log("Searching for:", { query, location });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - QuickHire</title>
        <meta 
          name="description" 
          content="Your personalized job search dashboard with AI-powered recommendations, learning resources, and career insights."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section with User Info */}
          <WelcomeSection user={user} />

          {/* Quick Search */}
          <div className="mb-8">
            <QuickSearchBar onSearch={handleSearch} />
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Job Matches Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Perfect Job Matches</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentJobMatches?.slice(0, 4)?.map((job) => (
                    <JobMatchCard key={job?.id} job={job} />
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {actionCards?.map((action) => (
                    <ActionCard 
                      key={action?.id} 
                      title={action?.title}
                      description={action?.description}
                      icon={action?.icon}
                      color={action?.color}
                      href={action?.href}
                    />
                  ))}
                </div>
              </section>

              {/* Learning Progress */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All Courses
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningProgress?.map((course) => (
                    <LearningProgressCard 
                      key={course?.id}
                      title={course?.title}
                      description={course?.description}
                      progress={course?.progress}
                      completed={course?.completed}
                      timeSpent={course?.timeSpent}
                      lastActivity={course?.lastActivity}
                      type={course?.type}
                      module={course}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Upcoming Events */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Upcoming Events
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {upcomingEvents?.map((event) => (
                    <EventCard 
                      key={event?.id}
                      title={event?.title}
                      date={event?.date}
                      time={event?.time}
                      type={event?.type}
                    />
                  ))}
                </div>
              </section>

              {/* Activity Feed */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Mark All Read
                  </button>
                </div>

                <div className="space-y-3">
                  {recentActivity?.map((activity) => (
                    <ActivityFeedItem 
                      key={activity?.id}
                      type={activity?.type}
                      title={activity?.title}
                      description={activity?.description}
                      time={activity?.time}
                      isRead={activity?.isRead}
                    />
                  ))}
                </div>
              </section>

              {/* Quick Stats */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applications Sent</span>
                    <span className="font-semibold text-blue-600">{jobApplications?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold text-green-600">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interviews Scheduled</span>
                    <span className="font-semibold text-orange-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Course Completions</span>
                    <span className="font-semibold text-purple-600">2</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}