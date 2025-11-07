import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import CareerEventsCalendar from './pages/career-events-calendar';
import UserDashboard from './pages/user-dashboard';
import JobSearchResults from './pages/job-search-results';
import LearningResources from './pages/learning-resources';
import SeniorExperienceSharing from './pages/senior-experience-sharing';
import InterviewTechPrepPlanner from './pages/interview-tech-prep-planner';
import Profile from './pages/Profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Main Routes */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/career-events-calendar" element={<CareerEventsCalendar />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
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
