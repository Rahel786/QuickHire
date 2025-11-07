import React, { useState, useEffect, useCallback } from 'react';
import { User, Search, Filter, Plus, BookOpen, Users, Award, Building2, GraduationCap, Star, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { experiencesAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import ShareExperienceForm from './components/ShareExperienceForm';
import ExperienceCard from './components/ExperienceCard';
import FilterPanel from './components/FilterPanel';

const SeniorExperienceSharing = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [experiences, setExperiences] = useState([]);
  const [myExperiences, setMyExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMy, setLoadingMy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [availableColleges, setAvailableColleges] = useState([]);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  
  // Common college names for dropdown
  const commonColleges = [
    'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT Indore', 'IIT Varanasi',
    'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
    'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'NIT Rourkela',
    'IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Delhi', 'IIIT Allahabad',
    'DTU', 'NSIT', 'JMI', 'JNU', 'DU',
    'VIT Vellore', 'SRM', 'Manipal', 'Amity', 'LPU'
  ];
  const [filters, setFilters] = useState({
    company: '',
    roundType: '',
    difficulty: '',
    batchYear: '',
    college: '',
    rating: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // Fetch colleges from API
  const fetchColleges = useCallback(async (searchTerm = '') => {
    try {
      const data = await experiencesAPI.getColleges(searchTerm, 50);
      
      if (data && data.colleges) {
        const collegeNames = data.colleges.map(c => c.name || c);
        setAvailableColleges(prev => {
          // Merge with existing colleges, avoiding duplicates
          const merged = [...new Set([...prev, ...collegeNames])].sort();
          return merged;
        });
        return;
      }
    } catch (error) {
      console.log('Failed to fetch colleges from API, using local data:', error);
      // Extract colleges from local experiences if API fails
      const storedExperiences = localStorage.getItem('company_experiences');
      if (storedExperiences) {
        const localExperiences = JSON.parse(storedExperiences);
        const colleges = [...new Set(
          localExperiences
            .map(exp => exp.college || exp.user_profiles?.college)
            .filter(Boolean)
            .filter(college => 
              !searchTerm || college.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )].sort();
        setAvailableColleges(colleges);
      }
    }
  }, []);
  
  // Initialize available colleges with common ones on mount
  useEffect(() => {
    setAvailableColleges(prev => {
      const merged = [...new Set([...prev, ...commonColleges])].sort();
      return merged;
    });
  }, []);

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    if (user) {
      loadMyExperiences();
    } else {
      setMyExperiences([]);
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [experiences, searchQuery, filters, collegeSearchQuery]);
  
  // Debounce college search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges(collegeSearchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [collegeSearchQuery, fetchColleges]);
  
  // Load colleges on mount
  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const data = await experiencesAPI.getAllExperiences();
        
        if (data && data.experiences) {
          // Normalize API experiences to include id and created_at
          const normalizedApi = data.experiences.map(exp => ({
            ...exp,
            id: exp._id || exp.id,
            created_at: exp.createdAt || exp.created_at,
            linkedin_profile: exp.linkedin_profile || exp.linkedIn_profile || null,
          }));

          // Merge API data with localStorage data
          const storedExperiences = localStorage.getItem('company_experiences');
          const localExperiences = storedExperiences ? JSON.parse(storedExperiences) : [];
          
          // Combine API experiences with local ones, removing duplicates by id/_id
          const normalizedLocal = localExperiences.map(exp => ({
            ...exp,
            liked_by: exp.liked_by || [],
            id: exp.id || exp._id,
            linkedin_profile: exp.linkedin_profile || exp.linkedIn_profile || null,
          }));
          const allExperiences = [...normalizedApi, ...normalizedLocal];
          const uniqueExperiences = allExperiences.filter((exp, index, self) => {
            const key = exp._id || exp.id;
            return index === self.findIndex(e => (e._id || e.id) === key);
          });
          
          setExperiences(uniqueExperiences);
          
          // Extract unique colleges from experiences
          const colleges = [...new Set(
            uniqueExperiences
              .map(exp => exp.college || exp.user_profiles?.college)
              .filter(Boolean)
          )].sort();
          setAvailableColleges(colleges);
          
          return;
        }
      } catch (apiError) {
        console.log('API call failed, using localStorage:', apiError);
        // Fallback to localStorage if API fails
      }
      
      // Load from localStorage as fallback
      const storedExperiences = localStorage.getItem('company_experiences');
      if (storedExperiences) {
        const localExperiences = JSON.parse(storedExperiences).map(exp => ({
          ...exp,
          liked_by: exp.liked_by || [],
          id: exp.id || exp._id,
          linkedin_profile: exp.linkedin_profile || exp.linkedIn_profile || null,
        }));
        setExperiences(localExperiences);
        
        // Extract unique colleges from local experiences
        const colleges = [...new Set(
          localExperiences
            .map(exp => exp.college || exp.user_profiles?.college)
            .filter(Boolean)
        )].sort();
        setAvailableColleges(colleges);
      } else {
        setExperiences([]);
        setAvailableColleges([]);
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences([]);
      setAvailableColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyExperiences = async () => {
    try {
      if (!user) {
        setMyExperiences([]);
        return;
      }
      // Try backend API
      setLoadingMy(true);
      try {
        const data = await experiencesAPI.getMyExperiences();
        if (data && data.experiences) {
          const normalized = data.experiences.map(exp => ({
            ...exp,
            id: exp._id || exp.id,
            liked_by: exp.liked_by || [],
            created_at: exp.createdAt || exp.created_at,
            linkedin_profile: exp.linkedin_profile || exp.linkedIn_profile || null,
          }));
          setMyExperiences(normalized);
          return;
        }
      } catch (apiError) {
        console.log('My experiences API failed, using localStorage:', apiError);
      }
      // Fallback to localStorage
      const stored = localStorage.getItem('company_experiences');
      if (stored) {
        const local = JSON.parse(stored).map(exp => ({
          ...exp,
          liked_by: exp.liked_by || [],
          id: exp.id || exp._id,
          linkedin_profile: exp.linkedin_profile || exp.linkedIn_profile || null,
        }));
        setMyExperiences(local.filter(exp => exp.user_id === user?.id));
      } else {
        setMyExperiences([]);
      }
    } catch (e) {
      console.error('Error loading my experiences:', e);
      setMyExperiences([]);
    } finally {
      setLoadingMy(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...experiences];

    // Search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(exp => 
        exp?.company_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        exp?.position_title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        exp?.college?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        exp?.user_profiles?.college?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        exp?.preparation_tips?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Company filter - case insensitive
    if (filters?.company) {
      filtered = filtered?.filter(exp => 
        exp?.company_name?.toLowerCase() === filters?.company?.toLowerCase()
      );
    }

    // Round type filter
    if (filters?.roundType) {
      filtered = filtered?.filter(exp => 
        exp?.interview_rounds?.some(round => round?.round_type === filters?.roundType)
      );
    }

    // Difficulty filter
    if (filters?.difficulty) {
      filtered = filtered?.filter(exp => exp?.overall_difficulty === filters?.difficulty);
    }

    // Batch year filter
    if (filters?.batchYear) {
      filtered = filtered?.filter(exp => exp?.batch_year?.toString() === filters?.batchYear);
    }

    // College filter (for campus placement experiences) - supports search
    if (filters?.college || collegeSearchQuery?.trim()) {
      const searchTerm = (filters?.college || collegeSearchQuery || '').toLowerCase();
      filtered = filtered?.filter(exp => {
        const college = exp?.college?.toLowerCase() || exp?.user_profiles?.college?.toLowerCase() || '';
        return college.includes(searchTerm);
      });
    }

    // Rating filter (for campus placement experiences)
    if (filters?.rating) {
      const minRating = parseFloat(filters?.rating);
      filtered = filtered?.filter(exp => {
        const rating = exp?.rating || exp?.overall_rating || 0;
        return rating >= minRating;
      });
    }

    setFilteredExperiences(filtered);
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!user) return;
    try {
      await experiencesAPI.deleteExperience(experienceId);
      
      // Remove from experiences list
      setExperiences(prev => prev.filter(exp => (exp._id || exp.id) !== experienceId));
      
      // Remove from my experiences list
      setMyExperiences(prev => prev.filter(exp => (exp._id || exp.id) !== experienceId));
      
      // Also remove from localStorage if exists
      const stored = localStorage.getItem('company_experiences');
      if (stored) {
        const local = JSON.parse(stored).filter(exp => (exp.id || exp._id) !== experienceId);
        localStorage.setItem('company_experiences', JSON.stringify(local));
      }
      
      // Update filtered experiences
      setFilteredExperiences(prev => prev.filter(exp => (exp._id || exp.id) !== experienceId));
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  const handleLikeExperience = async (experienceId, onSuccess) => {
    if (!user) return;
    try {
      const response = await experiencesAPI.likeExperience(experienceId);
      const updated = response?.experience;
      if (updated) {
        const merge = (list) => list?.map(exp => {
          const key = exp._id || exp.id;
          if (key === (updated._id || updated.id || experienceId)) {
            return {
              ...exp,
              ...updated,
              id: updated._id || updated.id
            };
          }
          return exp;
        });
        setExperiences(prev => merge(prev));
        setMyExperiences(prev => merge(prev));
        // update localStorage fallback if present
        const stored = localStorage.getItem('company_experiences');
        if (stored) {
          const local = JSON.parse(stored).map(exp => {
            const key = exp._id || exp.id;
            if (key === (updated._id || updated.id || experienceId)) {
              return {
                ...exp,
                ...updated,
                id: updated._id || updated.id
              };
            }
            return exp;
          });
          localStorage.setItem('company_experiences', JSON.stringify(local));
        }
        onSuccess?.();
      }
    } catch (error) {
      if (error.response?.status === 200) {
        onSuccess?.();
      }
      console.error('Error liking experience:', error);
    }
  };

  const getUniqueCompanies = () => {
    return [...new Set(experiences.map(exp => exp?.company_name).filter(Boolean))]?.sort();
  };

  const getUniqueBatchYears = () => {
    return [...new Set(experiences.map(exp => exp?.batch_year).filter(Boolean))]?.sort((a, b) => b - a);
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
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                Senior Experience Sharing
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Share and discover interview experiences from seniors
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'browse' ?'bg-white text-blue-600 shadow-sm' :'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BookOpen className="h-4 w-4 inline mr-2" />
                  Browse Experiences
                </button>
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'mine' ?'bg-white text-blue-600 shadow-sm' :'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  My Experiences
                </button>
                <button
                  onClick={() => setActiveTab('share')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'share' ?'bg-white text-blue-600 shadow-sm' :'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Share Experience
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'browse' ? (
          <>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Campus Placement Experiences</h2>
                <p className="text-gray-600 mb-6">Real experiences from students about company drives at their campus</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Company Search/Select - Similar to College */}
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search or select company..."
                        value={companySearchQuery || filters.company}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCompanySearchQuery(value);
                          setFilters({...filters, company: value});
                          setShowCompanyDropdown(true);
                        }}
                        onFocus={() => setShowCompanyDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      {/* Company Dropdown */}
                      {showCompanyDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCompanySearchQuery('');
                                setFilters({...filters, company: ''});
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 flex items-center font-medium"
                            >
                              <Building2 className="w-3 h-3 mr-2 text-gray-400" />
                              All Companies
                            </button>
                            {getUniqueCompanies()
                              .filter(company => 
                                !companySearchQuery || 
                                company.toLowerCase().includes(companySearchQuery.toLowerCase())
                              )
                              .map((company, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setCompanySearchQuery(company);
                                    setFilters({...filters, company: company});
                                    setShowCompanyDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 flex items-center"
                                >
                                  <Building2 className="w-3 h-3 mr-2 text-gray-400" />
                                  {company}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search or select college..."
                        value={collegeSearchQuery || filters.college}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCollegeSearchQuery(value);
                          setFilters({...filters, college: value});
                          setShowCollegeDropdown(true);
                        }}
                        onFocus={() => setShowCollegeDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      {/* Dropdown with common colleges + search results */}
                      {showCollegeDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {/* Common Colleges Section */}
                          <div className="p-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                              Common Colleges
                            </div>
                            {commonColleges
                              .filter(college => 
                                !collegeSearchQuery || 
                                college.toLowerCase().includes(collegeSearchQuery.toLowerCase())
                              )
                              .map((college, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setCollegeSearchQuery(college);
                                    setFilters({...filters, college: college});
                                    setShowCollegeDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 flex items-center"
                                >
                                  <GraduationCap className="w-3 h-3 mr-2 text-gray-400" />
                                  {college}
                                </button>
                              ))}
                            
                            {/* Other Colleges from API/local */}
                            {availableColleges.length > 0 && (
                              <>
                                <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 mt-2 border-t pt-2">
                                  Other Colleges
                                </div>
                                {availableColleges
                                  .filter(college => 
                                    !commonColleges.includes(college) &&
                                    (!collegeSearchQuery || 
                                     college.toLowerCase().includes(collegeSearchQuery.toLowerCase()))
                                  )
                                  .slice(0, 10)
                                  .map((college, idx) => (
                                    <button
                                      key={`other-${idx}`}
                                      type="button"
                                      onClick={() => {
                                        setCollegeSearchQuery(college);
                                        setFilters({...filters, college: college});
                                        setShowCollegeDropdown(false);
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 flex items-center"
                                    >
                                      <GraduationCap className="w-3 h-3 mr-2 text-gray-400" />
                                      {college}
                                    </button>
                                  ))}
                              </>
                            )}
                            
                            {collegeSearchQuery && 
                             commonColleges.filter(c => 
                               c.toLowerCase().includes(collegeSearchQuery.toLowerCase())
                             ).length === 0 && 
                             availableColleges.filter(c => 
                               !commonColleges.includes(c) &&
                               c.toLowerCase().includes(collegeSearchQuery.toLowerCase())
                             ).length === 0 && (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No colleges found matching "{collegeSearchQuery}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Close dropdown when clicking outside */}
                    {showCollegeDropdown && (
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCollegeDropdown(false)}
                      />
                    )}
                  </div>
                  
                  {/* Close company dropdown when clicking outside */}
                  {showCompanyDropdown && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowCompanyDropdown(false)}
                    />
                  )}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company, college, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Advanced Filters Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                    {showAdvancedFilters ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </button>
                  
                  {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Rating Filter */}
                      <div className="relative">
                        <Star className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <select 
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.rating}
                          onChange={(e) => setFilters({...filters, rating: e.target.value})}
                        >
                          <option value="">All Ratings</option>
                          <option value="5">5 Stars</option>
                          <option value="4">4+ Stars</option>
                          <option value="3">3+ Stars</option>
                        </select>
                      </div>

                      {/* Difficulty Filter */}
                      <div className="relative">
                        <Award className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <select 
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.difficulty}
                          onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                        >
                          <option value="">All Difficulties</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      {/* Round Type Filter */}
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <select 
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.roundType}
                          onChange={(e) => setFilters({...filters, roundType: e.target.value})}
                        >
                          <option value="">All Round Types</option>
                          <option value="Online Assessment">Online Assessment</option>
                          <option value="Technical Round">Technical Round</option>
                          <option value="HR Round">HR Round</option>
                          <option value="Managerial Round">Managerial Round</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filters
                </button>
              </div>

              {showFilters && (
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  companies={getUniqueCompanies()}
                  batchYears={getUniqueBatchYears()}
                />
              )}
            </div>

            {/* Experiences List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading experiences...</span>
              </div>
            ) : filteredExperiences?.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
                <p className="text-gray-500 mb-4">
                  {experiences?.length === 0 
                    ? 'Be the first to share your interview experience!' :'Try adjusting your search or filters.'}
                </p>
                <button
                  onClick={() => setActiveTab('share')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Your Experience
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredExperiences?.map((experience) => {
                  const liked = user && (experience?.liked_by || []).some((likedId) => {
                    if (!likedId) return false;
                    if (typeof likedId === 'string') return likedId === user.id;
                    if (likedId?._id) return likedId._id === user.id;
                    return likedId === user.id;
                  });
                  return (
                  <ExperienceCard
                    key={experience?.id || experience?._id}
                    experience={{ ...experience, id: experience?.id || experience?._id }}
                    onLike={handleLikeExperience}
                    currentUser={user}
                    liked={liked}
                  />
                  );
                })}
              </div>
            )}
          </>
        ) : activeTab === 'mine' ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">My Experiences</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search my experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {loadingMy ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading your experiences...</span>
              </div>
            ) : myExperiences
                ?.filter(exp => {
                  const q = (searchQuery || '').toLowerCase();
                  if (!q) return true;
                  return (
                    exp?.company_name?.toLowerCase()?.includes(q) ||
                    exp?.position_title?.toLowerCase()?.includes(q) ||
                    exp?.preparation_tips?.toLowerCase()?.includes(q)
                  );
                })?.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences yet</h3>
                <p className="text-gray-500 mb-4">Share your first experience to see it here.</p>
                <button
                  onClick={() => setActiveTab('share')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Experience
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myExperiences
                  ?.filter(exp => {
                    const q = (searchQuery || '').toLowerCase();
                    if (!q) return true;
                    return (
                      exp?.company_name?.toLowerCase()?.includes(q) ||
                      exp?.position_title?.toLowerCase()?.includes(q) ||
                      exp?.preparation_tips?.toLowerCase()?.includes(q)
                    );
                  })
                  ?.map((experience) => {
                    const liked = user && (experience?.liked_by || []).some((likedId) => {
                      if (!likedId) return false;
                      if (typeof likedId === 'string') return likedId === user.id;
                      if (likedId?._id) return likedId._id === user.id;
                      return likedId === user.id;
                    });
                    return (
                    <ExperienceCard
                      key={experience?._id || experience?.id}
                      experience={{ ...experience, id: experience?._id || experience?.id }}
                      onLike={handleLikeExperience}
                      currentUser={user}
                      liked={liked}
                      onDelete={handleDeleteExperience}
                      isOwnExperience={true}
                    />
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <ShareExperienceForm
            onExperienceShared={() => {
              loadExperiences();
              loadMyExperiences();
              setActiveTab('browse');
            }}
          />
        )}
      </main>
    </div>
  );
};

export default SeniorExperienceSharing;