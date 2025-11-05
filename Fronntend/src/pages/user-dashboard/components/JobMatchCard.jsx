import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobMatchCard = ({ job }) => {
  const navigate = useNavigate();

  const handleQuickApply = () => {
    // In real app, this would handle the application process
    navigate('/job-search-results');
  };

  const handleViewDetails = () => {
    navigate('/job-search-results');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-scale transition-smooth">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <Image 
            src={job?.companyLogo} 
            alt={`${job?.company} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
            {job?.title}
          </h3>
          <p className="text-muted-foreground text-xs mb-1">{job?.company}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="MapPin" size={12} />
            <span>{job?.location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-medium text-primary">{job?.salary}</span>
        <span className="text-xs text-muted-foreground">{job?.postedTime}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          job?.matchScore >= 90 ? 'bg-success/10 text-success' :
          job?.matchScore >= 70 ? 'bg-warning/10 text-warning': 'bg-muted text-muted-foreground'
        }`}>
          {job?.matchScore}% match
        </span>
        <span className="text-xs text-muted-foreground">{job?.applicants} applicants</span>
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleViewDetails}
          className="flex-1"
        >
          View Details
        </Button>
        <Button 
          size="sm" 
          onClick={handleQuickApply}
          className="flex-1"
        >
          Quick Apply
        </Button>
      </div>
    </div>
  );
};

export default JobMatchCard;