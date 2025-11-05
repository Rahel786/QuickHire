import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventDetailsModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!isOpen || !event) return null;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-card shadow-card mx-auto mb-4">
                <Image
                  src={event?.companyLogo}
                  alt={event?.company}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getEventTypeColor(event?.type)}`}>
                <Icon name={getEventTypeIcon(event?.type)} size={16} />
                <span className="capitalize">{event?.type?.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm"
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Company */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{event?.title}</h1>
            <p className="text-xl text-muted-foreground">{event?.company}</p>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">{formatDate(event?.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Time</p>
                  <p className="text-muted-foreground">{formatTime(event?.time)} ({event?.duration})</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={event?.format === 'online' ? 'Monitor' : 'MapPin'} size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Format</p>
                  <p className="text-muted-foreground capitalize">
                    {event?.format}
                    {event?.location && ` • ${event?.location}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Participants</p>
                  <p className="text-muted-foreground">{event?.participants} registered</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Registration Deadline</p>
                  <p className="text-muted-foreground">
                    {new Date(event.registrationDeadline)?.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Cost</p>
                  <p className="text-muted-foreground">{event?.cost || 'Free'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">About This Event</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed">{event?.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {event?.requirements && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Requirements</h3>
              <ul className="space-y-2">
                {event?.requirements?.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Speakers/Organizers */}
          {event?.speakers && event?.speakers?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Speakers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event?.speakers?.map((speaker, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={speaker?.avatar}
                        alt={speaker?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{speaker?.name}</p>
                      <p className="text-sm text-muted-foreground">{speaker?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            {event?.isRegistered ? (
              <>
                <Button variant="outline" size="lg" iconName="Calendar" iconPosition="left">
                  Add to Calendar
                </Button>
                <Button variant="outline" size="lg" iconName="Share" iconPosition="left">
                  Share Event
                </Button>
              </>
            ) : isRegistrationOpen() ? (
              <>
                <Button
                  variant="default"
                  size="lg"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => onRegister(event)}
                >
                  Register for Event
                </Button>
                <Button variant="outline" size="lg" iconName="Share" iconPosition="left">
                  Share Event
                </Button>
              </>
            ) : (
              <Button variant="outline" size="lg" disabled>
                Registration Closed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;