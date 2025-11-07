import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeedItem = ({ activity, type, title, description, time, isRead }) => {
  const navigate = useNavigate();
  
  // Support both old prop format and new activity object format
  const activityData = activity || { type, title, description, time, isRead };

  const handleClick = () => {
    if (activityData?.route) {
      navigate(activityData?.route);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job-bookmark': return 'Bookmark';
      case 'coding-problem': return 'Code';
      case 'event-registration': return 'Calendar';
      case 'learning-complete': return 'CheckCircle';
      case 'application-submit': return 'Send';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'job-bookmark': return 'text-blue-600';
      case 'coding-problem': return 'text-purple-600';
      case 'event-registration': return 'text-orange-600';
      case 'learning-complete': return 'text-green-600';
      case 'application-submit': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-smooth ${
        activityData?.route ? 'cursor-pointer' : ''
      } ${activityData?.isRead ? 'opacity-75' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activityData?.type)}`}>
        <Icon name={getActivityIcon(activityData?.type)} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground mb-1">
              <span className="font-medium">{activityData?.action || activityData?.title}</span>
              {activityData?.target && (
                <span className="text-muted-foreground"> {activityData?.target}</span>
              )}
            </p>
            
            {(activityData?.details || activityData?.description) && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {activityData?.details || activityData?.description}
              </p>
            )}
            
            {activityData?.company && (
              <div className="flex items-center gap-2 mb-1">
                {activityData?.companyLogo && (
                  <div className="w-4 h-4 rounded overflow-hidden">
                    <Image 
                      src={activityData?.companyLogo} 
                      alt={`${activityData?.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-foreground">{activityData?.company}</span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {activityData?.timestamp ? formatTimeAgo(activityData?.timestamp) : (activityData?.time || '')}
          </span>
        </div>
        
        {activityData?.tags && activityData?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {activityData?.tags?.slice(0, 3)?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {activityData?.tags?.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{activityData?.tags?.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedItem;