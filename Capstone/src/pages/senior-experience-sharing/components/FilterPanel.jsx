import React from 'react';
import { X } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, companies, batchYears }) => {
  const roundTypes = [
    { value: 'mcq', label: 'MCQ Round' },
    { value: 'coding', label: 'Coding Round' },
    { value: 'technical', label: 'Technical Interview' },
    { value: 'hr', label: 'HR Interview' },
    { value: 'group_discussion', label: 'Group Discussion' },
    { value: 'case_study', label: 'Case Study' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'very_hard', label: 'Very Hard' }
  ];

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      roundType: '',
      difficulty: '',
      batchYear: ''
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Company Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            value={filters?.company}
            onChange={(e) => updateFilter('company', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Companies</option>
            {companies?.map(company => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* Round Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Round Type
          </label>
          <select
            value={filters?.roundType}
            onChange={(e) => updateFilter('roundType', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Round Types</option>
            {roundTypes?.map(type => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={filters?.difficulty}
            onChange={(e) => updateFilter('difficulty', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Difficulties</option>
            {difficulties?.map(difficulty => (
              <option key={difficulty?.value} value={difficulty?.value}>
                {difficulty?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Year Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Batch Year
          </label>
          <select
            value={filters?.batchYear}
            onChange={(e) => updateFilter('batchYear', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {batchYears?.map(year => (
              <option key={year} value={year?.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters)?.map(([key, value]) => {
            if (!value) return null;
            
            let displayValue = value;
            if (key === 'roundType') {
              const roundType = roundTypes?.find(type => type?.value === value);
              displayValue = roundType?.label || value;
            } else if (key === 'difficulty') {
              const difficulty = difficulties?.find(diff => diff?.value === value);
              displayValue = difficulty?.label || value;
            }

            return (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {displayValue}
                <button
                  onClick={() => updateFilter(key, '')}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;