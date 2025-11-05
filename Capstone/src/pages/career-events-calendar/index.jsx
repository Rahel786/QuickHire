import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CalendarView from './components/CalendarView';

import EventFilters from './components/EventFilters';
import EventListView from './components/EventListView';
import NotificationSettings from './components/NotificationSettings';
import EventDetailsModal from './components/EventDetailsModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';


const CareerEventsCalendar = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    company: '',
    format: '',
    registrationStatus: '',
    search: '',
    location: ''
  });

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "AI/ML Career Opportunities at Google",
      company: "Google",
      companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center",
      type: "webinar",
      date: "2025-01-15",
      time: "14:00",
      duration: "2 hours",
      format: "online",
      location: null,
      description: `Join Google's AI/ML team for an exclusive webinar discussing career opportunities in artificial intelligence and machine learning. Learn about current openings, required skills, and application processes.\n\nThis session will cover various roles from research scientists to ML engineers, providing insights into Google's innovative projects and work culture.`,
      participants: 1250,
      registrationDeadline: "2025-01-14",
      cost: null,
      isRegistered: false,
      requirements: [
        "Bachelor\'s degree in Computer Science or related field",
        "Experience with Python and ML frameworks",
        "Understanding of machine learning concepts"
      ],
      speakers: [
        {
          name: "Sarah Chen",
          title: "Senior ML Engineer at Google",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          name: "David Rodriguez",
          title: "AI Research Scientist at Google",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        }
      ]
    },
    {
      id: 2,
      title: "Microsoft Azure Hackathon 2025",
      company: "Microsoft",
      companyLogo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-01-20",
      time: "09:00",
      duration: "48 hours",
      format: "hybrid",
      location: "Seattle, WA",
      description: `Microsoft's premier hackathon event focusing on cloud solutions and Azure services. Teams will compete to build innovative applications using Microsoft's cutting-edge technologies.\n\nPrizes include cash rewards, Azure credits, and potential job opportunities with Microsoft's engineering teams.`,
      participants: 500,
      registrationDeadline: "2025-01-18",
      cost: null,
      isRegistered: true,
      requirements: [
        "Team of 2-4 members",
        "Basic knowledge of cloud computing",
        "Programming experience in any language"
      ],
      speakers: [
        {
          name: "Emily Johnson",
          title: "Azure Product Manager",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ]
    },
    {
      id: 3,
      title: "Amazon Campus Drive - SDE Positions",
      company: "Amazon",
      companyLogo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center",
      type: "campus-drive",
      date: "2025-01-25",
      time: "10:00",
      duration: "Full day",
      format: "offline",
      location: "University Campus",
      description: `Amazon is conducting an on-campus recruitment drive for Software Development Engineer positions. The process includes technical interviews, coding assessments, and behavioral rounds.\n\nThis is an excellent opportunity for fresh graduates to join one of the world's leading technology companies.`,
      participants: 200,
      registrationDeadline: "2025-01-22",
      cost: null,
      isRegistered: false,
      requirements: [
        "Final year students or recent graduates",
        "Strong programming skills in Java/Python/C++",
        "Good understanding of data structures and algorithms"
      ],
      speakers: [
        {
          name: "Michael Park",
          title: "Senior SDE at Amazon",
          avatar: "https://randomuser.me/api/portraits/men/35.jpg"
        }
      ]
    },
    {
      id: 4,
      title: "Tech Networking Mixer - Bay Area",
      company: "TechConnect",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      type: "networking",
      date: "2025-01-28",
      time: "18:00",
      duration: "3 hours",
      format: "offline",
      location: "San Francisco, CA",
      description: `Join fellow tech professionals for an evening of networking, knowledge sharing, and career discussions. This mixer brings together engineers, product managers, and industry leaders from top tech companies.\n\nGreat opportunity to expand your professional network and learn about new opportunities in the Bay Area tech scene.`,
      participants: 150,
      registrationDeadline: "2025-01-26",
      cost: "$25",
      isRegistered: false,
      requirements: [
        "Tech industry professionals",
        "Valid ID for venue entry",
        "Business cards recommended"
      ],
      speakers: []
    },
    {
      id: 5,
      title: "Meta Frontend Engineering Workshop",
      company: "Meta",
      companyLogo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&crop=center",
      type: "webinar",
      date: "2025-02-02",
      time: "15:00",
      duration: "90 minutes",
      format: "online",
      location: null,
      description: `Learn about modern frontend development practices at Meta. This workshop covers React best practices, performance optimization, and the latest tools used by Meta's engineering teams.\n\nPerfect for frontend developers looking to enhance their skills and learn from industry experts.`,
      participants: 800,
      registrationDeadline: "2025-02-01",
      cost: null,
      isRegistered: true,
      requirements: [
        "Experience with React and JavaScript",
        "Understanding of web development fundamentals",
        "Development environment setup"
      ],
      speakers: [
        {
          name: "Alex Thompson",
          title: "Frontend Engineer at Meta",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg"
        }
      ]
    },
    {
      id: 6,
      title: "Netflix Data Science Challenge",
      company: "Netflix",
      companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-02-10",
      time: "12:00",
      duration: "72 hours",
      format: "online",
      location: null,
      description: `Netflix's annual data science challenge focusing on recommendation algorithms and user behavior analysis. Participants will work with real datasets to solve complex problems in content recommendation.\n\nWinners receive internship opportunities and mentorship from Netflix's data science team.`,
      participants: 300,
      registrationDeadline: "2025-02-08",
      cost: null,
      isRegistered: false,
      requirements: [
        "Strong background in data science and statistics",
        "Experience with Python and ML libraries",
        "Knowledge of recommendation systems preferred"
      ],
      speakers: [
        {
          name: "Lisa Wang",
          title: "Senior Data Scientist at Netflix",
          avatar: "https://randomuser.me/api/portraits/women/38.jpg"
        }
      ]
    }
  ];

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    smsNotifications: false,
    eventTypes: ['webinar', 'hackathon', 'campus-drive'],
    companies: ['google', 'microsoft', 'amazon'],
    registrationReminder: '3',
    eventReminder: '1',
    weeklyDigest: true,
    newEventAlerts: true,
    eventUpdates: true
  });

  // Filter events based on current filters
  const filteredEvents = mockEvents?.filter(event => {
    if (filters?.type && event?.type !== filters?.type) return false;
    if (filters?.company && event?.company?.toLowerCase() !== filters?.company) return false;
    if (filters?.format && event?.format !== filters?.format) return false;
    if (filters?.registrationStatus) {
      if (filters?.registrationStatus === 'open' && new Date(event.registrationDeadline) < new Date()) return false;
      if (filters?.registrationStatus === 'registered' && !event?.isRegistered) return false;
      if (filters?.registrationStatus === 'closed' && new Date(event.registrationDeadline) >= new Date()) return false;
    }
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      if (!event?.title?.toLowerCase()?.includes(searchTerm) &&
          !event?.company?.toLowerCase()?.includes(searchTerm) &&
          !event?.description?.toLowerCase()?.includes(searchTerm)) return false;
    }
    if (filters?.location && event?.location && !event?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) return false;
    
    return true;
  });

  // Sort events by date
  const sortedEvents = filteredEvents?.sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleRegister = (event) => {
    // Mock registration logic
    console.log('Registering for event:', event?.title);
    // In a real app, this would make an API call
    alert(`Successfully registered for "${event?.title}"!`);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      company: '',
      format: '',
      registrationStatus: '',
      search: '',
      location: ''
    });
  };

  const handleSaveNotificationSettings = (settings) => {
    setNotificationSettings(settings);
    // In a real app, this would save to backend
    console.log('Notification settings saved:', settings);
  };

  // Get upcoming events for quick stats
  const upcomingEvents = sortedEvents?.filter(event => new Date(event.date) >= new Date());
  const registeredEvents = sortedEvents?.filter(event => event?.isRegistered);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Career Events Calendar</h1>
                <p className="text-muted-foreground">
                  Discover webinars, hackathons, campus drives, and networking opportunities
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  iconName="Bell"
                  iconPosition="left"
                  onClick={() => setShowNotificationSettings(true)}
                >
                  Notifications
                </Button>
                
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                    size="sm"
                    iconName="Calendar"
                    onClick={() => setViewMode('calendar')}
                  >
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    iconName="List"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{upcomingEvents?.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{registeredEvents?.length}</p>
                    <p className="text-sm text-muted-foreground">Registered Events</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {sortedEvents?.reduce((sum, event) => sum + event?.participants, 0)?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <EventFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {viewMode === 'calendar' ? (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                  <CalendarView
                    events={sortedEvents}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onEventClick={handleViewDetails}
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {selectedDate ? `Events on ${selectedDate?.toLocaleDateString()}` : 'Upcoming Events'}
                    </h3>
                    
                    <div className="space-y-4">
                      {(selectedDate ? sortedEvents?.filter(event => event?.date === selectedDate?.toISOString()?.split('T')?.[0]) : upcomingEvents?.slice(0, 3))?.map(event => (
                        <div key={event?.id} className="border border-border rounded-lg p-4 hover-scale transition-smooth cursor-pointer"
                             onClick={() => handleViewDetails(event)}>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={event?.companyLogo}
                                alt={event?.company}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm line-clamp-1">{event?.title}</p>
                              <p className="text-xs text-muted-foreground">{event?.company}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(event.date)?.toLocaleDateString()} • {event?.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EventListView
                events={sortedEvents}
                onRegister={handleRegister}
                onViewDetails={handleViewDetails}
                loading={loading}
              />
            )}
          </div>
        </div>
      </main>
      {/* Modals */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
        settings={notificationSettings}
        onSave={handleSaveNotificationSettings}
      />
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default CareerEventsCalendar;