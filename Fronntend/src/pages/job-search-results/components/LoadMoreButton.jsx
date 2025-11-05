import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoadMoreButton = ({ onLoadMore, isLoading, hasMore, totalJobs, currentCount }) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-muted-foreground">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-sm">
            You've seen all {totalJobs?.toLocaleString()} available jobs
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">
          Showing {currentCount?.toLocaleString()} of {totalJobs?.toLocaleString()} jobs
        </span>
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={onLoadMore}
        loading={isLoading}
        iconName="ChevronDown"
        iconPosition="right"
        disabled={isLoading}
      >
        {isLoading ? 'Loading more jobs...' : 'Load More Jobs'}
      </Button>
    </div>
  );
};

export default LoadMoreButton;