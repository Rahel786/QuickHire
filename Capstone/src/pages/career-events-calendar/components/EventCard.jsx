import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, onRegister, onViewDetails }) => {
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hackathon':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'campus-drive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'networking':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'webinar':
        return 'Video';
      case 'hackathon':
        return 'Code';
      case 'campus-drive':
        return 'Building';
      case 'networking':
        return 'Users';
      default:
        return 'Calendar';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':');
    const date = new Date();
    date?.setHours(parseInt(hours), parseInt(minutes));
    return date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isRegistrationOpen = () => {
    const today = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    return today <= registrationDeadline;
  };

  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(event.registrationDeadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card hover-scale transition-smooth">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <Image
                src={event?.companyLogo}
                alt={event?.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {event?.title}
              </h3>
              <p className="text-sm text-muted-foreground">{event?.company}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event?.type)}`}>
            <div className="flex items-center space-x-1">
              <Icon name={getEventTypeIcon(event?.type)} size={12} />
              <span className="capitalize">{event?.type?.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{formatDate(event?.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>{formatTime(event?.time)} ({event?.duration})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name={event?.format === 'online' ? 'Monitor' : 'MapPin'} size={16} />
            <span className="capitalize">{event?.format}</span>
            {event?.location && <span>• {event?.location}</span>}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event?.description}
        </p>

        {/* Registration Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            {event?.isRegistered ? (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="CheckCircle" size={16} />
                <span>Registered</span>
              </div>
            ) : isRegistrationOpen() ? (
              <div className="text-muted-foreground">
                Registration closes in {getDaysUntilDeadline()} days
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-error">
                <Icon name="XCircle" size={16} />
                <span>Registration closed</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {event?.participants} participants
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {event?.isRegistered ? (
            <Button variant="outline" fullWidth iconName="Calendar" iconPosition="left">
              Add to Calendar
            </Button>
          ) : isRegistrationOpen() ? (
            <Button
              variant="default"
              fullWidth
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => onRegister(event)}
            >
              Register Now
            </Button>
          ) : (
            <Button variant="outline" fullWidth disabled>
              Registration Closed
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            onClick={() => onViewDetails(event)}
          >
            <span className="sr-only">View details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;