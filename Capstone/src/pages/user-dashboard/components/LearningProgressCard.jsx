import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LearningProgressCard = ({ module }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/learning-resources');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'dsa': return 'Code2';
      case 'dbms': return 'Database';
      case 'oop': return 'Layers';
      case 'system-design': return 'Network';
      default: return 'BookOpen';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-scale transition-smooth">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name={getModuleIcon(module.type)} size={20} color="var(--color-primary)" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm mb-1">
            {module.title}
          </h3>
          <p className="text-muted-foreground text-xs mb-2">
            {module.description}
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">{module.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.progress)}`}
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Icon name="CheckCircle" size={12} />
          <span>{module.completed} completed</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Clock" size={12} />
          <span>{module.timeSpent}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Last activity:</span>
        <span className="text-xs font-medium text-foreground">{module.lastActivity}</span>
      </div>
      
      <Button 
        size="sm" 
        onClick={handleContinue}
        iconName="Play"
        iconPosition="left"
        fullWidth
      >
        Continue Learning
      </Button>
    </div>
  );
};

export default LearningProgressCard;