import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/career-events-calendar');
  };

  const handleViewDetails = () => {
    navigate('/career-events-calendar');
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'webinar': return 'Video';
      case 'hackathon': return 'Code';
      case 'workshop': return 'Users';
      case 'campus-drive': return 'Building';
      default: return 'Calendar';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'webinar': return 'bg-blue-100 text-blue-700';
      case 'hackathon': return 'bg-purple-100 text-purple-700';
      case 'workshop': return 'bg-green-100 text-green-700';
      case 'campus-drive': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-scale transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name={getEventTypeIcon(event?.type)} size={16} color="var(--color-primary)" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event?.type)}`}>
            {event?.type?.replace('-', ' ')}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{event?.date}</span>
      </div>
      <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
        {event?.title}
      </h3>
      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
        {event?.description}
      </p>
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <Icon name="Clock" size={12} />
        <span>{event?.time}</span>
        <Icon name="Users" size={12} />
        <span>{event?.attendees} attending</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Organized by:</span>
        <span className="text-xs font-medium text-foreground">{event?.organizer}</span>
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleViewDetails}
          className="flex-1"
        >
          Details
        </Button>
        <Button 
          size="sm" 
          onClick={handleRegister}
          className="flex-1"
          disabled={event?.isRegistered}
        >
          {event?.isRegistered ? 'Registered' : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;