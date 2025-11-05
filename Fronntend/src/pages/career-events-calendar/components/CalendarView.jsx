import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarView = ({ events, selectedDate, onDateSelect, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getEventsForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return events?.filter(event => event?.date === dateStr);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days?.push(
        <div key={`empty-${i}`} className="h-24 bg-muted/30 border border-border"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && 
        selectedDate?.toDateString() === date?.toDateString();
      const isToday = new Date()?.toDateString() === date?.toDateString();

      days?.push(
        <div
          key={day}
          className={`h-24 border border-border cursor-pointer transition-smooth hover:bg-muted/50 ${
            isSelected ? 'bg-primary/10 border-primary' : 'bg-card'
          } ${isToday ? 'ring-2 ring-primary/30' : ''}`}
          onClick={() => onDateSelect(date)}
        >
          <div className="p-2 h-full flex flex-col">
            <div className={`text-sm font-medium mb-1 ${
              isToday ? 'text-primary' : 'text-foreground'
            }`}>
              {day}
            </div>
            <div className="flex-1 space-y-1 overflow-hidden">
              {dayEvents?.slice(0, 2)?.map((event, index) => (
                <div
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${
                    event?.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                    event?.type === 'hackathon' ? 'bg-purple-100 text-purple-800' :
                    event?.type === 'campus-drive'? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}
                  onClick={(e) => {
                    e?.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  {event?.title}
                </div>
              ))}
              {dayEvents?.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayEvents?.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">
          {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          >
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => navigateMonth(1)}
          >
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
          {renderCalendarDays()}
        </div>
      </div>
      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-muted-foreground">Webinar</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span className="text-muted-foreground">Hackathon</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span className="text-muted-foreground">Campus Drive</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-100 rounded"></div>
            <span className="text-muted-foreground">Networking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;