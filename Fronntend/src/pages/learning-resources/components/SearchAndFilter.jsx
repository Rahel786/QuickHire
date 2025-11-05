import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilter = ({ onSearch, onFilter, filters, searchQuery }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const topicOptions = [
    { value: 'all', label: 'All Topics' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'dbms', label: 'Database Management' },
    { value: 'oop', label: 'Object-Oriented Programming' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'progress', label: 'Progress' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'duration', label: 'Duration' },
    { value: 'recent', label: 'Recently Updated' }
  ];

  const handleFilterChange = (key, value) => {
    onFilter({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilter({
      difficulty: 'all',
      topic: 'all',
      status: 'all',
      sortBy: 'relevance'
    });
    onSearch('');
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== 'all') || searchQuery;

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search lessons, concepts, or topics..."
              value={searchQuery}
              onChange={(e) => onSearch(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={hasActiveFilters ? 'border-primary text-primary' : ''}
          >
            Filters {hasActiveFilters && '(Active)'}
          </Button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-3">
          <Select
            options={topicOptions}
            value={filters?.topic}
            onChange={(value) => handleFilterChange('topic', value)}
            placeholder="Topic"
            className="w-40"
          />
          <Select
            options={difficultyOptions}
            value={filters?.difficulty}
            onChange={(value) => handleFilterChange('difficulty', value)}
            placeholder="Difficulty"
            className="w-32"
          />
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
            className="w-36"
          />
          <Select
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Sort by"
            className="w-36"
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Topic"
              options={topicOptions}
              value={filters?.topic}
              onChange={(value) => handleFilterChange('topic', value)}
            />
            <Select
              label="Difficulty"
              options={difficultyOptions}
              value={filters?.difficulty}
              onChange={(value) => handleFilterChange('difficulty', value)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            <Select
              label="Sort by"
              options={sortOptions}
              value={filters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;