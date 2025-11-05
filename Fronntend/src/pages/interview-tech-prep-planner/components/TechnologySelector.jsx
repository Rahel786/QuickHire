import React, { useState, useEffect } from 'react';
import { Search, Code, Database, Globe, Smartphone, Brain, Settings, ChevronRight } from 'lucide-react';


const TechnologySelector = ({ onTechSelect }) => {
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Brain },
    { value: 'programming', label: 'Programming', icon: Code },
    { value: 'web_development', label: 'Web Development', icon: Globe },
    { value: 'mobile_development', label: 'Mobile Development', icon: Smartphone },
    { value: 'database', label: 'Database', icon: Database },
    { value: 'data_structures', label: 'Data Structures', icon: Brain },
    { value: 'algorithms', label: 'Algorithms', icon: Brain },
    { value: 'system_design', label: 'System Design', icon: Settings },
    { value: 'devops', label: 'DevOps', icon: Settings }
  ];

  useEffect(() => {
    loadTechnologies();
  }, []);

  useEffect(() => {
    filterTechnologies();
  }, [technologies, searchQuery, selectedCategory]);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      // Mock technologies data
      const mockTechnologies = [
        { id: 'tech_1', name: 'React', category: 'web_development', description: 'A JavaScript library for building user interfaces' },
        { id: 'tech_2', name: 'Java', category: 'programming', description: 'Object-oriented programming language' },
        { id: 'tech_3', name: 'JavaScript', category: 'programming', description: 'High-level programming language' },
        { id: 'tech_4', name: 'Python', category: 'programming', description: 'High-level general-purpose programming language' },
        { id: 'tech_5', name: 'SQL', category: 'database', description: 'Structured Query Language for databases' },
        { id: 'tech_6', name: 'Data Structures', category: 'data_structures', description: 'Fundamental data organization methods' },
        { id: 'tech_7', name: 'Algorithms', category: 'algorithms', description: 'Step-by-step procedures for solving problems' },
        { id: 'tech_8', name: 'System Design', category: 'system_design', description: 'Designing scalable and efficient systems' },
        { id: 'tech_9', name: 'Node.js', category: 'web_development', description: 'JavaScript runtime for server-side development' },
        { id: 'tech_10', name: 'TypeScript', category: 'programming', description: 'Typed superset of JavaScript' },
        { id: 'tech_11', name: 'MongoDB', category: 'database', description: 'NoSQL database system' },
        { id: 'tech_12', name: 'Docker', category: 'devops', description: 'Containerization platform' }
      ];
      
      // Load from localStorage if available, otherwise use mock data
      const storedTechs = localStorage.getItem('technologies');
      if (storedTechs) {
        setTechnologies(JSON.parse(storedTechs));
      } else {
        setTechnologies(mockTechnologies);
        localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
      }
    } catch (error) {
      console.error('Error loading technologies:', error);
      setTechnologies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTechnologies = () => {
    let filtered = [...technologies];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(tech => tech?.category === selectedCategory);
    }

    // Search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(tech =>
        tech?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        tech?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    setFilteredTechs(filtered);
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories?.find(cat => cat?.value === category);
    return categoryData?.icon || Code;
  };

  const getCategoryColor = (category) => {
    const colors = {
      programming: 'bg-blue-100 text-blue-800',
      web_development: 'bg-green-100 text-green-800',
      mobile_development: 'bg-purple-100 text-purple-800',
      database: 'bg-orange-100 text-orange-800',
      data_structures: 'bg-pink-100 text-pink-800',
      algorithms: 'bg-red-100 text-red-800',
      system_design: 'bg-indigo-100 text-indigo-800',
      devops: 'bg-gray-100 text-gray-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading technologies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Technology to Study</h2>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories?.map(category => {
              const Icon = category?.icon;
              const isActive = selectedCategory === category?.value;
              
              return (
                <button
                  key={category?.value}
                  onClick={() => setSelectedCategory(category?.value)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechs?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No technologies found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredTechs?.map(tech => {
            const CategoryIcon = getCategoryIcon(tech?.category);
            
            return (
              <button
                key={tech?.id}
                onClick={() => onTechSelect?.(tech)}
                className="bg-white rounded-lg shadow-sm border p-6 text-left hover:shadow-md hover:border-purple-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CategoryIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tech?.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tech?.category)}`}>
                        {tech?.category?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                {tech?.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tech?.description}
                  </p>
                )}
                <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
                  Create study plan
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </button>
            );
          })
        )}
      </div>
      {/* Popular Technologies Quick Select */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular for Interviews</h3>
          <div className="flex flex-wrap gap-3">
            {technologies
              ?.filter(tech => ['React', 'Java', 'JavaScript', 'Python', 'SQL', 'Data Structures', 'Algorithms', 'System Design']?.includes(tech?.name))
              ?.map(tech => (
                <button
                  key={tech?.id}
                  onClick={() => onTechSelect?.(tech)}
                  className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  {tech?.name}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologySelector;