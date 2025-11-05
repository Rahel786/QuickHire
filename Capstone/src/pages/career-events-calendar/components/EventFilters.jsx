import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EventFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const eventTypeOptions = [
    { value: '', label: 'All Event Types' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'campus-drive', label: 'Campus Drives' },
    { value: 'networking', label: 'Networking Events' }
  ];

  const formatOptions = [
    { value: '', label: 'All Formats' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const registrationStatusOptions = [
    { value: '', label: 'All Events' },
    { value: 'open', label: 'Registration Open' },
    { value: 'registered', label: 'My Registered Events' },
    { value: 'closed', label: 'Registration Closed' }
  ];

  const companyOptions = [
    { value: '', label: 'All Companies' },
    { value: 'google', label: 'Google' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'meta', label: 'Meta' },
    { value: 'apple', label: 'Apple' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'uber', label: 'Uber' },
    { value: 'airbnb', label: 'Airbnb' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Events</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Event Type"
          options={eventTypeOptions}
          value={filters?.type}
          onChange={(value) => handleFilterChange('type', value)}
          placeholder="Select event type"
        />

        <Select
          label="Company"
          options={companyOptions}
          value={filters?.company}
          onChange={(value) => handleFilterChange('company', value)}
          placeholder="Select company"
          searchable
        />

        <Select
          label="Format"
          options={formatOptions}
          value={filters?.format}
          onChange={(value) => handleFilterChange('format', value)}
          placeholder="Select format"
        />

        <Select
          label="Registration Status"
          options={registrationStatusOptions}
          value={filters?.registrationStatus}
          onChange={(value) => handleFilterChange('registrationStatus', value)}
          placeholder="Select status"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Search Events"
          type="search"
          placeholder="Search by title, company, or description..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
        />

        <Input
          label="Location"
          type="text"
          placeholder="Enter city or location..."
          value={filters?.location}
          onChange={(e) => handleFilterChange('location', e?.target?.value)}
        />
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters?.type && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>Type: {eventTypeOptions?.find(opt => opt?.value === filters?.type)?.label}</span>
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <span className="sr-only">Remove filter</span>
                  ×
                </button>
              </div>
            )}
            {filters?.company && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>Company: {companyOptions?.find(opt => opt?.value === filters?.company)?.label}</span>
                <button
                  onClick={() => handleFilterChange('company', '')}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <span className="sr-only">Remove filter</span>
                  ×
                </button>
              </div>
            )}
            {filters?.format && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>Format: {formatOptions?.find(opt => opt?.value === filters?.format)?.label}</span>
                <button
                  onClick={() => handleFilterChange('format', '')}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <span className="sr-only">Remove filter</span>
                  ×
                </button>
              </div>
            )}
            {filters?.search && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>Search: "{filters?.search}"</span>
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <span className="sr-only">Remove filter</span>
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;