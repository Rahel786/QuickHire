import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import CareerEventsCalendar from './pages/career-events-calendar';
import UserDashboard from './pages/user-dashboard';
import JobSearchResults from './pages/job-search-results';
import LearningResources from './pages/learning-resources';
import SeniorExperienceSharing from './pages/senior-experience-sharing';
import InterviewTechPrepPlanner from './pages/interview-tech-prep-planner';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CareerEventsCalendar />} />
        <Route path="/career-events-calendar" element={<CareerEventsCalendar />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/job-search-results" element={<JobSearchResults />} />
        <Route path="/learning-resources" element={<LearningResources />} />
        <Route path="/senior-experience-sharing" element={<SeniorExperienceSharing />} />
        <Route path="/interview-tech-prep-planner" element={<InterviewTechPrepPlanner />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
