import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeedItem = ({ activity }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (activity?.route) {
      navigate(activity?.route);
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
        activity?.route ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
        <Icon name={getActivityIcon(activity?.type)} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground mb-1">
              <span className="font-medium">{activity?.action}</span>
              {activity?.target && (
                <span className="text-muted-foreground"> {activity?.target}</span>
              )}
            </p>
            
            {activity?.details && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {activity?.details}
              </p>
            )}
            
            {activity?.company && (
              <div className="flex items-center gap-2 mb-1">
                {activity?.companyLogo && (
                  <div className="w-4 h-4 rounded overflow-hidden">
                    <Image 
                      src={activity?.companyLogo} 
                      alt={`${activity?.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-foreground">{activity?.company}</span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTimeAgo(activity?.timestamp)}
          </span>
        </div>
        
        {activity?.tags && activity?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {activity?.tags?.slice(0, 3)?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {activity?.tags?.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{activity?.tags?.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedItem;