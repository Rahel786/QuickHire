import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ActionCard = ({ action }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(action?.route);
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'job-search': return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'dsa-practice': return 'bg-gradient-to-br from-purple-500 to-purple-600';
      case 'learning': return 'bg-gradient-to-br from-green-500 to-green-600';
      case 'events': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`${getCardColor(action?.type)} rounded-xl p-6 text-white cursor-pointer hover-scale transition-smooth group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Icon name={action?.icon} size={24} color="white" />
        </div>
        <Icon 
          name="ArrowRight" 
          size={20} 
          color="white" 
          className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{action?.title}</h3>
      <p className="text-white/80 text-sm mb-4 line-clamp-2">{action?.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-white/70 text-xs">{action?.subtitle}</span>
        {action?.badge && (
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
            {action?.badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActionCard;