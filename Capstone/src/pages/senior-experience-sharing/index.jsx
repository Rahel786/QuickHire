import React, { useState, useEffect } from 'react';
import { User, Search, Filter, Plus, BookOpen, Users, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
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
  const [filters, setFilters] = useState({
    company: '',
    roundType: '',
    difficulty: '',
    batchYear: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [experiences, searchQuery, filters]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('company_experiences')
        ?.select(`
          *,
          user_profiles!inner(
            full_name,
            batch_year
          ),
          interview_rounds(
            id,
            round_type,
            difficulty,
            questions_pattern,
            detailed_questions,
            duration_minutes,
            tips
          )
        `)
        ?.order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading experiences:', error);
        return;
      }

      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
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
        exp?.position_title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
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

    setFilteredExperiences(filtered);
  };

  const handleLikeExperience = async (experienceId) => {
    if (!user) return;
    
    try {
      const experience = experiences?.find(exp => exp?.id === experienceId);
      const newLikesCount = (experience?.likes_count || 0) + 1;

      const { error } = await supabase
        ?.from('company_experiences')
        ?.update({ likes_count: newLikesCount })
        ?.eq('id', experienceId);

      if (!error) {
        setExperiences(prev => 
          prev?.map(exp => 
            exp?.id === experienceId 
              ? { ...exp, likes_count: newLikesCount }
              : exp
          )
        );
      }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to access experience sharing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
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
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' ? (
          <>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by company or position..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
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
      </div>
    </div>
  );
};

export default SeniorExperienceSharing;