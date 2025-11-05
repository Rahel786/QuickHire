import React, { useState, useEffect, useCallback } from 'react';
import { User, Search, Filter, Plus, BookOpen, Users, Award, Building2, GraduationCap, Star } from 'lucide-react';
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
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
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
          // Merge API data with localStorage data
          const storedExperiences = localStorage.getItem('company_experiences');
          const localExperiences = storedExperiences ? JSON.parse(storedExperiences) : [];
          
          // Combine API experiences with local ones, removing duplicates
          const allExperiences = [...data.experiences, ...localExperiences];
          const uniqueExperiences = allExperiences.filter((exp, index, self) => 
            index === self.findIndex(e => e.id === exp.id)
          );
          
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
        const localExperiences = JSON.parse(storedExperiences);
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

    // Company filter
    if (filters?.company) {
      filtered = filtered?.filter(exp => exp?.company_name === filters?.company);
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

  const handleLikeExperience = async (experienceId) => {
    // Allow likes for all users during testing
    try {
      const experience = experiences?.find(exp => exp?.id === experienceId);
      const newLikesCount = (experience?.likes_count || 0) + 1;

      const updatedExperiences = experiences?.map(exp => 
        exp?.id === experienceId 
          ? { ...exp, likes_count: newLikesCount }
          : exp
      );
      
      setExperiences(updatedExperiences);
      localStorage.setItem('company_experiences', JSON.stringify(updatedExperiences));
    } catch (error) {
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.company}
                      onChange={(e) => setFilters({...filters, company: e.target.value})}
                    >
                      <option value="">All Companies</option>
                      <option value="Google">Google</option>
                      <option value="Microsoft">Microsoft</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Adobe">Adobe</option>
                      <option value="Meta">Meta</option>
                      {getUniqueCompanies().filter(c => !['Google', 'Microsoft', 'Amazon', 'Adobe', 'Meta'].includes(c)).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
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
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company, college, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                {filteredExperiences?.map((experience) => (
                  <ExperienceCard
                    key={experience?.id}
                    experience={experience}
                    onLike={handleLikeExperience}
                    currentUser={user}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <ShareExperienceForm
            onExperienceShared={() => {
              loadExperiences();
              setActiveTab('browse');
            }}
          />
        )}
      </main>
    </div>
  );
};

export default SeniorExperienceSharing;