import React from "react";
import { User, MapPin, Calendar } from "lucide-react";

const WelcomeSection = ({ user }) => {
  const currentDate = new Date()?.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || 'Job Seeker'}! 👋
          </h1>
          <p className="text-blue-100 mb-4">{currentDate}</p>
          
          {user?.user_metadata && (
            <div className="flex items-center space-x-4 text-sm text-blue-100">
              {user?.user_metadata?.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user?.user_metadata?.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Member since {new Date(user?.created_at)?.toLocaleDateString()}
              </div>
            </div>
          )}
          
          <p className="text-lg text-blue-50 mt-4">
            You have <span className="font-semibold text-white">3 new job matches</span> and 
            <span className="font-semibold text-white"> 2 upcoming interviews</span> this week.
          </p>
        </div>
        
        <div className="hidden md:block">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user?.user_metadata?.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;