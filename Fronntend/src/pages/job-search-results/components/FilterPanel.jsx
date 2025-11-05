import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, resultCount, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'remote', label: 'Remote' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'san-francisco', label: 'San Francisco, CA' },
    { value: 'seattle', label: 'Seattle, WA' },
    { value: 'austin', label: 'Austin, TX' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'denver', label: 'Denver, CO' },
    { value: 'atlanta', label: 'Atlanta, GA' }
  ];

  const experienceLevelOptions = [
    { value: '', label: 'All Experience Levels' },
    { value: 'entry-level', label: 'Entry Level (0-1 years)' },
    { value: 'junior', label: 'Junior (1-3 years)' },
    { value: 'mid-level', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (5+ years)' }
  ];

  const companySizeOptions = [
    { value: '', label: 'All Company Sizes' },
    { value: 'startup', label: 'Startup (1-50)' },
    { value: 'small', label: 'Small (51-200)' },
    { value: 'medium', label: 'Medium (201-1000)' },
    { value: 'large', label: 'Large (1000+)' }
  ];

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleJobTypeChange = (type, checked) => {
    const currentTypes = filters?.jobTypes || [];
    const updatedTypes = checked
      ? [...currentTypes, type]
      : currentTypes?.filter(t => t !== type);
    
    handleFilterChange('jobTypes', updatedTypes);
  };

  const clearAllFilters = () => {
    onFiltersChange({
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

  const hasActiveFilters = () => {
    return filters?.search || filters?.location || filters?.experienceLevel || 
           filters?.companySize || (filters?.jobTypes && filters?.jobTypes?.length > 0) ||
           filters?.salaryMin || filters?.salaryMax;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          Filters & Sort
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        {/* Search and Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Search jobs, companies, or keywords..."
              value={filters?.search || ''}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>
          <Select
            options={sortOptions}
            value={filters?.sortBy || 'relevance'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Sort by"
          />
        </div>

        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Select
            label="Location"
            options={locationOptions}
            value={filters?.location || ''}
            onChange={(value) => handleFilterChange('location', value)}
            searchable
          />
          
          <Select
            label="Experience Level"
            options={experienceLevelOptions}
            value={filters?.experienceLevel || ''}
            onChange={(value) => handleFilterChange('experienceLevel', value)}
          />
          
          <Select
            label="Company Size"
            options={companySizeOptions}
            value={filters?.companySize || ''}
            onChange={(value) => handleFilterChange('companySize', value)}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Job Type</label>
            <div className="space-y-2">
              {jobTypeOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={(filters?.jobTypes || [])?.includes(option?.value)}
                  onChange={(e) => handleJobTypeChange(option?.value, e?.target?.checked)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            type="number"
            label="Minimum Salary ($)"
            placeholder="e.g., 50000"
            value={filters?.salaryMin || ''}
            onChange={(e) => handleFilterChange('salaryMin', e?.target?.value)}
          />
          <Input
            type="number"
            label="Maximum Salary ($)"
            placeholder="e.g., 100000"
            value={filters?.salaryMax || ''}
            onChange={(e) => handleFilterChange('salaryMax', e?.target?.value)}
          />
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Searching...' : `${resultCount?.toLocaleString()} jobs found`}
            </span>
            {isLoading && (
              <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
            )}
          </div>
          
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;