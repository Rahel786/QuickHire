import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobCard = ({ job, onBookmark, isBookmarked }) => {
  const [imageError, setImageError] = useState(false);

  const handleBookmark = (e) => {
    e?.stopPropagation();
    onBookmark(job?.id);
  };

  const handleViewDetails = () => {
    // In a real app, this would redirect to the company's career page
    window.open(job?.applicationUrl, '_blank');
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `$${min?.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-smooth hover-scale">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {!imageError ? (
              <Image
                src={job?.companyLogo}
                alt={`${job?.company} logo`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon name="Building2" size={24} className="text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
              {job?.title}
            </h3>
            <p className="text-muted-foreground font-medium mb-2">{job?.company}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{getTimeAgo(job?.postedDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Briefcase" size={14} />
                <span>{job?.type}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`flex-shrink-0 ${isBookmarked ? 'text-warning' : 'text-muted-foreground hover:text-warning'}`}
        >
          <Icon name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={20} />
        </Button>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-success">
            {formatSalary(job?.salaryMin, job?.salaryMax)}
          </span>
          <span className="text-sm text-muted-foreground">
            {job?.experienceLevel}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
          {job?.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job?.skills?.slice(0, 4)?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
          {job?.skills?.length > 4 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              +{job?.skills?.length - 4} more
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{job?.companySize}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={14} />
            <span>{job?.applicants} applicants</span>
          </div>
        </div>
        
        <Button variant="default" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default JobCard;