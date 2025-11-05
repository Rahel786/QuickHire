import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningProgress = ({ progressData }) => {
  const getStreakColor = (streak) => {
    if (streak >= 7) return 'text-success';
    if (streak >= 3) return 'text-warning';
    return 'text-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Learning Progress</h2>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{progressData?.totalHours}</div>
          <div className="text-sm text-muted-foreground">Hours Studied</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success mb-1">{progressData?.completedLessons}</div>
          <div className="text-sm text-muted-foreground">Lessons Done</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${getStreakColor(progressData?.currentStreak)}`}>
            {progressData?.currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning mb-1">{progressData?.conceptsMastered}</div>
          <div className="text-sm text-muted-foreground">Concepts</div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Weekly Goal</span>
            <span className="text-sm text-muted-foreground">
              {progressData?.weeklyProgress?.current}/{progressData?.weeklyProgress?.target} hours
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((progressData?.weeklyProgress?.current / progressData?.weeklyProgress?.target) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {progressData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  activity?.type === 'completed' ? 'bg-success' : 
                  activity?.type === 'started' ? 'bg-primary' : 'bg-warning'
                }`} />
                <span className="text-muted-foreground flex-1">{activity?.description}</span>
                <span className="text-xs text-muted-foreground">{activity?.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;