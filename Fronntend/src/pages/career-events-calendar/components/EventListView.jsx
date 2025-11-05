import React from 'react';
import EventCard from './EventCard';
import Icon from '../../../components/AppIcon';

const EventListView = ({ events, onRegister, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6 animate-pulse">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
            </div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any events matching your current filters.
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or check back later for new events.
        </p>
      </div>
    );
  }

  const groupEventsByDate = (events) => {
    const grouped = {};
    events?.forEach(event => {
      const date = new Date(event.date);
      const dateKey = date?.toISOString()?.split('T')?.[0];
      const dateLabel = date?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped?.[dateKey]) {
        grouped[dateKey] = {
          label: dateLabel,
          events: []
        };
      }
      grouped?.[dateKey]?.events?.push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);
  const sortedDates = Object.keys(groupedEvents)?.sort();

  return (
    <div className="space-y-8">
      {sortedDates?.map(dateKey => {
        const group = groupedEvents?.[dateKey];
        const isToday = new Date()?.toISOString()?.split('T')?.[0] === dateKey;
        const isPast = new Date(dateKey) < new Date();
        
        return (
          <div key={dateKey} className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className={`text-lg font-semibold ${
                isToday ? 'text-primary' : isPast ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {group?.label}
                {isToday && (
                  <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Today
                  </span>
                )}
              </h3>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">
                {group?.events?.length} event{group?.events?.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {group?.events?.map(event => (
                <EventCard
                  key={event?.id}
                  event={event}
                  onRegister={onRegister}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventListView;