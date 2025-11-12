import React, { useState } from 'react';
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
    location: 'India' // Default to India
  });

  // Events data - India-specific student events (November 2025 - January 2026)
  const events = [
    {
      id: 1,
      title: "TechGig Code Gladiators 2025 - India's Largest Coding Competition",
      company: "TechGig",
      companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-11-15",
      time: "10:00",
      duration: "48 hours",
      format: "online",
      location: "Online",
      description: `India's largest coding competition for students and professionals. Compete in multiple tracks including AI/ML, Web Development, and Mobile Apps. Open to all engineering students and fresh graduates.\n\nPrizes worth ₹50 Lakhs, job opportunities with top tech companies, and internship offers for winners.`,
      participants: 50,
      registrationDeadline: "2025-11-10",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students or recent graduates",
        "Basic programming knowledge",
        "Valid college ID"
      ],
      speakers: [
        {
          name: "Rajesh Kumar",
          title: "CTO at TechGig",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      ]
    },
    {
      id: 2,
      title: "Microsoft Campus Recruitment Drive - Bangalore",
      company: "Microsoft",
      companyLogo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=100&h=100&fit=crop&crop=center",
      type: "campus-drive",
      date: "2025-11-22",
      time: "09:00",
      duration: "Full day",
      format: "offline",
      location: "Bangalore, Karnataka",
      description: `Microsoft India is conducting a campus recruitment drive for Software Engineer positions. Open to final year students and recent graduates from engineering colleges.\n\nProcess includes coding test, technical interviews, and HR round. Selected candidates will join Microsoft's India Development Center.`,
      participants: 45,
      registrationDeadline: "2025-11-18",
      cost: null,
      isRegistered: false,
      requirements: [
        "Final year B.Tech/M.Tech students or 2024/2025 graduates",
        "Strong programming skills in C++/Java/Python",
        "Good understanding of data structures and algorithms",
        "CGPA 7.0 or above"
      ],
      speakers: [
        {
          name: "Priya Sharma",
          title: "Senior Recruiter at Microsoft India",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ]
    },
    {
      id: 3,
      title: "Amazon SDE Internship Program 2025 - Hyderabad",
      company: "Amazon",
      companyLogo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center",
      type: "campus-drive",
      date: "2025-11-28",
      time: "10:00",
      duration: "Full day",
      format: "offline",
      location: "Hyderabad, Telangana",
      description: `Amazon India is hiring SDE Interns for their Hyderabad Development Center. Open to pre-final and final year engineering students.\n\n6-month internship program with potential full-time conversion. Work on real projects, mentorship from senior engineers, and competitive stipend.`,
      participants: 40,
      registrationDeadline: "2025-11-25",
      cost: null,
      isRegistered: false,
      requirements: [
        "Pre-final or final year B.Tech/M.Tech students",
        "Strong programming skills in Java/Python/C++",
        "Good understanding of data structures and algorithms",
        "CGPA 7.5 or above preferred"
      ],
      speakers: [
        {
          name: "Arjun Patel",
          title: "Senior SDE at Amazon India",
          avatar: "https://randomuser.me/api/portraits/men/35.jpg"
        }
      ]
    },
    {
      id: 4,
      title: "Google India - Student Developer Workshop Series",
      company: "Google",
      companyLogo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&crop=center",
      type: "webinar",
      date: "2025-12-05",
      time: "15:00",
      duration: "2 hours",
      format: "online",
      location: "Online",
      description: `Google India's free workshop series for students. Learn about Google Cloud Platform, Android Development, and Web Technologies.\n\nPerfect for students looking to build their skills and prepare for Google's internship and full-time opportunities. Certificates provided.`,
      participants: 45,
      registrationDeadline: "2025-12-03",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students or recent graduates",
        "Basic programming knowledge",
        "Laptop with internet connection"
      ],
      speakers: [
        {
          name: "Rahul Mehta",
          title: "Developer Advocate at Google India",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg"
        }
      ]
    },
    {
      id: 5,
      title: "Flipkart Tech Challenge 2025 - Campus Edition",
      company: "Flipkart",
      companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-12-10",
      time: "10:00",
      duration: "24 hours",
      format: "online",
      location: "Online",
      description: `Flipkart's annual tech challenge for engineering students. Build innovative solutions for e-commerce problems using cutting-edge technologies.\n\nTop performers get PPO (Pre-Placement Offers), internships, and cash prizes. Open to all engineering students in India.`,
      participants: 45,
      registrationDeadline: "2025-12-08",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students from any year",
        "Team of 2-4 members",
        "Basic programming and problem-solving skills"
      ],
      speakers: [
        {
          name: "Anjali Reddy",
          title: "Engineering Manager at Flipkart",
          avatar: "https://randomuser.me/api/portraits/women/38.jpg"
        }
      ]
    },
    {
      id: 6,
      title: "Infosys Campus Connect - Career Guidance Session",
      company: "Infosys",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      type: "webinar",
      date: "2025-12-18",
      time: "14:00",
      duration: "90 minutes",
      format: "online",
      location: "Online",
      description: `Infosys Campus Connect program for engineering students. Learn about career opportunities, interview preparation, and skill development.\n\nGet insights into Infosys hiring process, required skills, and how to prepare for campus placements.`,
      participants: 40,
      registrationDeadline: "2025-12-16",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students (2nd year onwards)",
        "Interest in software development",
        "Registration required"
      ],
      speakers: [
        {
          name: "Vikram Singh",
          title: "Talent Acquisition at Infosys",
          avatar: "https://randomuser.me/api/portraits/men/50.jpg"
        }
      ]
    },
    {
      id: 7,
      title: "TCS CodeVita Season 13 - Programming Contest",
      company: "TCS",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-12-20",
      time: "10:00",
      duration: "6 hours",
      format: "online",
      location: "Online",
      description: `TCS CodeVita is one of India's largest coding competitions. Compete with students from across the country in algorithmic programming challenges.\n\nWinners get direct interview opportunities with TCS, cash prizes, and recognition. Open to all engineering students.`,
      participants: 50,
      registrationDeadline: "2025-12-18",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students or recent graduates",
        "Strong problem-solving and coding skills",
        "Valid college email ID"
      ],
      speakers: []
    },
    {
      id: 8,
      title: "Wipro Campus Placement Drive - Multiple Cities",
      company: "Wipro",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      type: "campus-drive",
      date: "2026-01-08",
      time: "09:00",
      duration: "Full day",
      format: "offline",
      location: "Multiple Cities",
      description: `Wipro is conducting campus placement drives across major engineering colleges in India. Hiring for Project Engineer and Software Developer roles.\n\nOpen to final year B.Tech/M.Tech students. Process includes aptitude test, technical interview, and HR round.`,
      participants: 40,
      registrationDeadline: "2026-01-05",
      cost: null,
      isRegistered: false,
      requirements: [
        "Final year engineering students",
        "CGPA 6.0 or above",
        "No active backlogs",
        "Good communication skills"
      ],
      speakers: [
        {
          name: "Sneha Verma",
          title: "Campus Recruitment Manager at Wipro",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        }
      ]
    },
    {
      id: 9,
      title: "HackerEarth November Challenge 2025",
      company: "HackerEarth",
      companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2025-11-25",
      time: "12:00",
      duration: "72 hours",
      format: "online",
      location: "Online",
      description: `HackerEarth's monthly coding challenge for students and professionals. Solve algorithmic problems and compete for cash prizes and job opportunities.\n\nOpen to all engineering students. Leaderboard rankings, certificates for all participants, and direct interview opportunities for top performers.`,
      participants: 50,
      registrationDeadline: "2025-11-23",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students or recent graduates",
        "Strong problem-solving skills",
        "HackerEarth account"
      ],
      speakers: []
    },
    {
      id: 10,
      title: "Accenture Innovation Challenge 2026",
      company: "Accenture",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      type: "hackathon",
      date: "2026-01-15",
      time: "10:00",
      duration: "48 hours",
      format: "hybrid",
      location: "Bangalore & Online",
      description: `Accenture's annual innovation challenge for engineering students. Build innovative solutions using emerging technologies like AI, Cloud, and Blockchain.\n\nWinners receive PPO offers, internships, cash prizes, and mentorship from Accenture leaders. Open to all engineering students in India.`,
      participants: 45,
      registrationDeadline: "2026-01-12",
      cost: null,
      isRegistered: false,
      requirements: [
        "Engineering students (2nd year onwards)",
        "Team of 2-4 members",
        "Innovation and problem-solving mindset"
      ],
      speakers: [
        {
          name: "Amit Khanna",
          title: "Innovation Lead at Accenture India",
          avatar: "https://randomuser.me/api/portraits/men/55.jpg"
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
  const filteredEvents = events?.filter(event => {
    if (filters?.type && event?.type !== filters?.type) return false;
    if (filters?.company && event?.company?.toLowerCase() !== filters?.company?.toLowerCase()) return false;
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
    // Location filter: 'India' shows all events, otherwise match specific location
    if (filters?.location && filters?.location !== 'India') {
      if (!event?.location || !event?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) return false;
    }
    
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
      location: 'India' // Reset to default
    });
  };

  const handleSaveNotificationSettings = (settings) => {
    setNotificationSettings(settings);
    // In a real app, this would save to backend
    console.log('Notification settings saved:', settings);
  };

  // Get upcoming events for quick stats
  const upcomingEvents = sortedEvents?.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  const registeredEvents = sortedEvents?.filter(event => event?.isRegistered);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Career Events Calendar</h1>
                <p className="text-muted-foreground">
                  Discover student-friendly events in India: hackathons, campus drives, workshops, and tech competitions
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
                    <p className="text-2xl font-bold text-foreground">{upcomingEvents?.length || 0}</p>
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