import React from 'react';

const JobCardSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start space-x-4 flex-1">
        <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-muted rounded w-20"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="w-8 h-8 bg-muted rounded flex-shrink-0"></div>
    </div>

    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="h-5 bg-muted rounded w-32"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-4/5"></div>
        <div className="h-3 bg-muted rounded w-3/5"></div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-muted rounded w-16"></div>
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-6 bg-muted rounded w-18"></div>
        <div className="h-6 bg-muted rounded w-14"></div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <div className="h-3 bg-muted rounded w-20"></div>
        <div className="h-3 bg-muted rounded w-24"></div>
      </div>
      <div className="h-8 bg-muted rounded w-24"></div>
    </div>
  </div>
);

const JobListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count })?.map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default JobListSkeleton;