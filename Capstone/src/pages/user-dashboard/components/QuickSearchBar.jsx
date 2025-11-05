import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const mockSuggestions = [
    { type: 'job', title: 'Frontend Developer', company: 'Google' },
    { type: 'job', title: 'Software Engineer', company: 'Microsoft' },
    { type: 'learning', title: 'Data Structures - Arrays' },
    { type: 'learning', title: 'DBMS - Normalization' },
    { type: 'event', title: 'React Workshop 2024' },
    { type: 'job', title: 'Full Stack Developer', company: 'Amazon' }
  ];

  const handleSearchChange = (e) => {
    const query = e?.target?.value;
    setSearchQuery(query);
    
    if (query?.length > 0) {
      const filtered = mockSuggestions?.filter(item =>
        item?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
        (item?.company && item?.company?.toLowerCase()?.includes(query?.toLowerCase()))
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion?.title);
    setShowSuggestions(false);
    
    if (suggestion?.type === 'job') {
      navigate('/job-search-results');
    } else if (suggestion?.type === 'learning') {
      navigate('/learning-resources');
    } else if (suggestion?.type === 'event') {
      navigate('/career-events-calendar');
    }
  };

  const handleSearch = () => {
    if (searchQuery?.trim()) {
      navigate('/job-search-results');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'job': return 'Briefcase';
      case 'learning': return 'BookOpen';
      case 'event': return 'Calendar';
      default: return 'Search';
    }
  };

  return (
    <div className="relative mb-8">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
          </div>
          <input
            type="text"
            placeholder="Search jobs, learning resources, or events..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-modal z-50">
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Icon name={getIconForType(suggestion?.type)} size={16} color="var(--color-muted-foreground)" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{suggestion?.title}</div>
                    {suggestion?.company && (
                      <div className="text-xs text-muted-foreground">{suggestion?.company}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button onClick={handleSearch} iconName="Search">
          Search
        </Button>
      </div>
    </div>
  );
};

export default QuickSearchBar;