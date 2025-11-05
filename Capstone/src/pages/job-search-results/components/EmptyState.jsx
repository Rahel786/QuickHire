import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onClearFilters, onRetry }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No jobs match your filters
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or clearing some filters to see more results.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={onClearFilters} iconName="X" iconPosition="left">
            Clear All Filters
          </Button>
          <Button variant="default" onClick={onRetry} iconName="RefreshCw" iconPosition="left">
            Search Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Briefcase" size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No jobs available
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any job listings at the moment. This might be due to a temporary issue with our job sources.
      </p>
      <Button variant="default" onClick={onRetry} iconName="RefreshCw" iconPosition="left">
        Try Again
      </Button>
    </div>
  );
};

export default EmptyState;