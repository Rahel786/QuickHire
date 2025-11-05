import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import JobCard from './components/JobCard';
import FilterPanel from './components/FilterPanel';
import JobListSkeleton from './components/JobListSkeleton';
import EmptyState from './components/EmptyState';
import LoadMoreButton from './components/LoadMoreButton';

const JobSearchResults = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experienceLevel: '',
    companySize: '',
    jobTypes: [],
    salaryMin: '',
    salaryMax: '',
    sortBy: 'relevance'
  });

  const JOBS_PER_PAGE = 10;

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer - React",
      company: "TechStart Inc.",
      companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=center",
      location: "San Francisco, CA",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 70000,
      salaryMax: 90000,
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      description: `We're looking for a passionate Frontend Developer to join our growing team. You'll work on building modern web applications using React, TypeScript, and other cutting-edge technologies. This is a great opportunity for recent graduates or developers with 0-2 years of experience.`,
      skills: ["React", "JavaScript", "HTML/CSS", "TypeScript", "Git"],
      companySize: "Startup (1-50)",
      applicants: 45,
      applicationUrl: "https://example.com/apply/1"
    },
    {
      id: 2,
      title: "Junior Software Engineer",
      company: "DataFlow Solutions",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      location: "Remote",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 65000,
      salaryMax: 85000,
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: `Join our remote-first team as a Junior Software Engineer. You'll contribute to building scalable backend systems and APIs. We offer mentorship, flexible hours, and opportunities for rapid career growth.`,
      skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
      companySize: "Medium (201-1000)",
      applicants: 78,
      applicationUrl: "https://example.com/apply/2"
    },
    {
      id: 3,
      title: "Full Stack Developer Intern",
      company: "InnovateLab",
      companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=center",
      location: "New York, NY",
      type: "Internship",
      experienceLevel: "Entry Level",
      salaryMin: 25000,
      salaryMax: 35000,
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: `3-month paid internship program for computer science students. Work on real projects, learn from experienced developers, and potentially convert to full-time. Perfect for students in their final year.`,
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
      companySize: "Small (51-200)",
      applicants: 156,
      applicationUrl: "https://example.com/apply/3"
    },
    {
      id: 4,
      title: "Data Analyst - Entry Level",
      company: "Analytics Pro",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center",
      location: "Chicago, IL",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 55000,
      salaryMax: 70000,
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      description: `We're seeking a detail-oriented Data Analyst to help transform raw data into actionable insights. You'll work with SQL, Python, and visualization tools to support business decisions.`,
      skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
      companySize: "Large (1000+)",
      applicants: 89,
      applicationUrl: "https://example.com/apply/4"
    },
    {
      id: 5,
      title: "Mobile App Developer - iOS",
      company: "AppCraft Studios",
      companyLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
      location: "Austin, TX",
      type: "Full-time",
      experienceLevel: "Junior",
      salaryMin: 75000,
      salaryMax: 95000,
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: `Join our mobile development team to create innovative iOS applications. We're looking for someone with Swift experience and a passion for creating user-friendly mobile experiences.`,
      skills: ["Swift", "iOS", "Xcode", "UIKit", "Core Data"],
      companySize: "Small (51-200)",
      applicants: 34,
      applicationUrl: "https://example.com/apply/5"
    },
    {
      id: 6,
      title: "DevOps Engineer - Junior",
      company: "CloudTech Systems",
      companyLogo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop&crop=center",
      location: "Seattle, WA",
      type: "Full-time",
      experienceLevel: "Junior",
      salaryMin: 80000,
      salaryMax: 100000,
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      description: `Help us build and maintain cloud infrastructure. You'll work with AWS, Docker, Kubernetes, and CI/CD pipelines. Great opportunity to learn from senior engineers.`,
      skills: ["AWS", "Docker", "Kubernetes", "Linux", "Python"],
      companySize: "Medium (201-1000)",
      applicants: 67,
      applicationUrl: "https://example.com/apply/6"
    },
    {
      id: 7,
      title: "QA Tester - Manual & Automation",
      company: "QualityFirst Tech",
      companyLogo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=center",
      location: "Boston, MA",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 50000,
      salaryMax: 65000,
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: `We're looking for a QA Tester to ensure our software meets the highest quality standards. You'll perform manual testing and learn automation testing frameworks.`,
      skills: ["Manual Testing", "Selenium", "Java", "JIRA", "Test Planning"],
      companySize: "Medium (201-1000)",
      applicants: 92,
      applicationUrl: "https://example.com/apply/7"
    },
    {
      id: 8,
      title: "UI/UX Designer - Junior",
      company: "DesignHub Agency",
      companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=center",
      location: "Denver, CO",
      type: "Full-time",
      experienceLevel: "Junior",
      salaryMin: 60000,
      salaryMax: 75000,
      postedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      description: `Create beautiful and intuitive user interfaces for web and mobile applications. You'll work closely with developers and product managers to bring designs to life.`,
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      companySize: "Small (51-200)",
      applicants: 123,
      applicationUrl: "https://example.com/apply/8"
    },
    {
      id: 9,
      title: "Backend Developer - Node.js",
      company: "ServerSide Solutions",
      companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=center",
      location: "Atlanta, GA",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 68000,
      salaryMax: 88000,
      postedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      description: `Build robust server-side applications using Node.js and Express. You'll work on APIs, databases, and server architecture. Great learning environment with experienced mentors.`,
      skills: ["Node.js", "Express", "MongoDB", "REST APIs", "JavaScript"],
      companySize: "Startup (1-50)",
      applicants: 56,
      applicationUrl: "https://example.com/apply/9"
    },
    {
      id: 10,
      title: "Cybersecurity Analyst - Entry Level",
      company: "SecureNet Corp",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      location: "Remote",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 65000,
      salaryMax: 80000,
      postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      description: `Protect our organization from cyber threats. You'll monitor security systems, analyze threats, and help implement security measures. Security+ certification preferred.`,
      skills: ["Network Security", "SIEM", "Incident Response", "Risk Assessment", "Compliance"],
      companySize: "Large (1000+)",
      applicants: 78,
      applicationUrl: "https://example.com/apply/10"
    },
    {
      id: 11,
      title: "Product Manager - Associate",
      company: "ProductVision Inc",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center",
      location: "San Francisco, CA",
      type: "Full-time",
      experienceLevel: "Entry Level",
      salaryMin: 85000,
      salaryMax: 105000,
      postedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      description: `Join our product team to help define and execute product strategy. You'll work with engineering, design, and marketing teams to deliver exceptional user experiences.`,
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Roadmapping"],
      companySize: "Medium (201-1000)",
      applicants: 145,
      applicationUrl: "https://example.com/apply/11"
    },
    {
      id: 12,
      title: "Machine Learning Engineer - Junior",
      company: "AI Innovations Lab",
      companyLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
      location: "Boston, MA",
      type: "Full-time",
      experienceLevel: "Junior",
      salaryMin: 90000,
      salaryMax: 110000,
      postedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      description: `Work on cutting-edge machine learning projects. You'll develop and deploy ML models, work with large datasets, and contribute to AI research initiatives.`,
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"],
      companySize: "Small (51-200)",
      applicants: 89,
      applicationUrl: "https://example.com/apply/12"
    }
  ];

  // Initialize jobs and load bookmarks
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJobs(mockJobs);
      setIsLoading(false);
      
      // Load bookmarked jobs from localStorage
      const savedBookmarks = localStorage.getItem('bookmarkedJobs');
      if (savedBookmarks) {
        setBookmarkedJobs(new Set(JSON.parse(savedBookmarks)));
      }
    };

    loadJobs();
  }, []);

  // Filter and sort jobs
  useEffect(() => {
    let filtered = [...jobs];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(job =>
        job?.title?.toLowerCase()?.includes(searchTerm) ||
        job?.company?.toLowerCase()?.includes(searchTerm) ||
        job?.description?.toLowerCase()?.includes(searchTerm) ||
        job?.skills?.some(skill => skill?.toLowerCase()?.includes(searchTerm))
      );
    }

    // Apply location filter
    if (filters?.location) {
      if (filters?.location === 'remote') {
        filtered = filtered?.filter(job => job?.location?.toLowerCase()?.includes('remote'));
      } else {
        filtered = filtered?.filter(job => 
          job?.location?.toLowerCase()?.includes(filters?.location?.replace('-', ' '))
        );
      }
    }

    // Apply experience level filter
    if (filters?.experienceLevel) {
      filtered = filtered?.filter(job => {
        const jobLevel = job?.experienceLevel?.toLowerCase();
        const filterLevel = filters?.experienceLevel?.toLowerCase();
        return jobLevel?.includes(filterLevel?.replace('-', ' '));
      });
    }

    // Apply company size filter
    if (filters?.companySize) {
      filtered = filtered?.filter(job => {
        const jobSize = job?.companySize?.toLowerCase();
        const filterSize = filters?.companySize?.toLowerCase();
        return jobSize?.includes(filterSize);
      });
    }

    // Apply job type filter
    if (filters?.jobTypes && filters?.jobTypes?.length > 0) {
      filtered = filtered?.filter(job =>
        filters?.jobTypes?.some(type => 
          job?.type?.toLowerCase()?.includes(type?.toLowerCase()?.replace('-', ' '))
        )
      );
    }

    // Apply salary filters
    if (filters?.salaryMin) {
      const minSalary = parseInt(filters?.salaryMin);
      filtered = filtered?.filter(job => 
        (job?.salaryMin && job?.salaryMin >= minSalary) || 
        (job?.salaryMax && job?.salaryMax >= minSalary)
      );
    }

    if (filters?.salaryMax) {
      const maxSalary = parseInt(filters?.salaryMax);
      filtered = filtered?.filter(job => 
        (job?.salaryMax && job?.salaryMax <= maxSalary) || 
        (job?.salaryMin && job?.salaryMin <= maxSalary)
      );
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'date':
        filtered?.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'salary-high':
        filtered?.sort((a, b) => (b?.salaryMax || 0) - (a?.salaryMax || 0));
        break;
      case 'salary-low':
        filtered?.sort((a, b) => (a?.salaryMin || 0) - (b?.salaryMin || 0));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters]);

  // Update displayed jobs based on pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * JOBS_PER_PAGE;
    setDisplayedJobs(filteredJobs?.slice(startIndex, endIndex));
  }, [filteredJobs, currentPage]);

  const handleBookmark = useCallback((jobId) => {
    setBookmarkedJobs(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks?.has(jobId)) {
        newBookmarks?.delete(jobId);
      } else {
        newBookmarks?.add(jobId);
      }
      
      // Save to localStorage
      localStorage.setItem('bookmarkedJobs', JSON.stringify([...newBookmarks]));
      return newBookmarks;
    });
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      location: '',
      experienceLevel: '',
      companySize: '',
      jobTypes: [],
      salaryMin: '',
      salaryMax: '',
      sortBy: 'relevance'
    });
  };

  const retrySearch = () => {
    window.location?.reload();
  };

  const hasActiveFilters = () => {
    return filters?.search || filters?.location || filters?.experienceLevel || 
           filters?.companySize || (filters?.jobTypes && filters?.jobTypes?.length > 0) ||
           filters?.salaryMin || filters?.salaryMax;
  };

  const hasMoreJobs = displayedJobs?.length < filteredJobs?.length;

  return (
    <>
      <Helmet>
        <title>Job Search Results - QuickHire</title>
        <meta name="description" content="Find entry-level jobs and internships perfect for fresh graduates. Browse opportunities from top companies with filters for location, salary, and experience level." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Job Search Results
              </h1>
              <p className="text-muted-foreground">
                Discover entry-level opportunities from top companies
              </p>
            </div>

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              resultCount={filteredJobs?.length}
              isLoading={isLoading}
            />

            {/* Job Results */}
            <div className="space-y-6">
              {isLoading ? (
                <JobListSkeleton count={6} />
              ) : filteredJobs?.length === 0 ? (
                <EmptyState
                  hasFilters={hasActiveFilters()}
                  onClearFilters={clearAllFilters}
                  onRetry={retrySearch}
                />
              ) : (
                <>
                  <div className="space-y-4">
                    {displayedJobs?.map((job) => (
                      <JobCard
                        key={job?.id}
                        job={job}
                        onBookmark={handleBookmark}
                        isBookmarked={bookmarkedJobs?.has(job?.id)}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  <LoadMoreButton
                    onLoadMore={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={hasMoreJobs}
                    totalJobs={filteredJobs?.length}
                    currentCount={displayedJobs?.length}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobSearchResults;