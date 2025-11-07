import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopicCard = ({ topic, onToggleExpand, onBookmark, onStartLesson, onToggleLessonComplete }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  const getIconColor = (progress) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 50) return 'text-warning';
    return 'text-primary';
  };

  const handleTopicClick = () => {
    // Open main course resource when clicking on topic title/description
    onStartLesson(topic?.id, null);
  };

  return (
    <div id={`topic-${topic?.id}`} className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="flex items-center space-x-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleTopicClick}
            title="Click to open course resources"
          >
            <div className={`p-2 rounded-lg bg-muted ${getIconColor(topic?.progress)}`}>
              <Icon name={topic?.icon} size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">{topic?.title}</h3>
                <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{topic?.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Bookmark"
            onClick={() => onBookmark(topic?.id)}
            className={topic?.isBookmarked ? 'text-warning' : 'text-muted-foreground'}
          >
            <span className="sr-only">Bookmark topic</span>
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{topic?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(topic?.progress)}`}
              style={{ width: `${topic?.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="BookOpen" size={16} />
              <span>{topic?.totalLessons} lessons</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} />
              <span>{topic?.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={16} />
              <span>{topic?.completedLessons}/{topic?.totalLessons}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            iconName={topic?.isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => onToggleExpand(topic?.id)}
          >
            {topic?.isExpanded ? 'Hide Lessons' : 'View Lessons'}
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => onStartLesson(topic?.id, topic?.nextLesson)}
            title="Opens course resources in a new tab"
          >
            {topic?.progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        </div>
      </div>
      {topic?.isExpanded && (
        <div className="border-t border-border bg-muted/30">
          <div className="p-4">
            <div className="space-y-2">
              {topic?.lessons?.map((lesson, index) => (
                <div
                  key={lesson?.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-smooth group"
                >
                  <div 
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => onStartLesson(topic?.id, lesson?.id)}
                    title="Click to open lesson in new tab"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      lesson?.isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : lesson?.isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {lesson?.isCompleted ? (
                        <Icon name="Check" size={14} />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">{lesson?.title}</h4>
                        <Icon name="ExternalLink" size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground">{lesson?.duration} • {lesson?.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson?.hasNotes && (
                      <Icon name="FileText" size={16} className="text-warning" />
                    )}
                    {lesson?.difficulty && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        lesson?.difficulty === 'Easy' ?'bg-success/10 text-success' 
                          : lesson?.difficulty === 'Medium' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                      }`}>
                        {lesson?.difficulty}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLessonComplete?.(topic?.id, lesson?.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        lesson?.isCompleted 
                          ? 'bg-success/10 text-success hover:bg-success/20' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      title={lesson?.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Icon name={lesson?.isCompleted ? "CheckCircle2" : "Circle"} size={18} />
                    </button>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCard;