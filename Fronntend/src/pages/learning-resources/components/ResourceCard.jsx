import React from 'react';
import { ExternalLink, Database, Github } from 'lucide-react';

const ResourceCard = ({ resource, onViewResource }) => {
  const getSourceIcon = (source) => {
    if (source?.toLowerCase() === 'github') {
      return <Github className="w-4 h-4" />;
    }
    return <Database className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all shadow-lg">
      {/* Source Badge - Top Right */}
      <div className="flex justify-end mb-3">
        <span className="px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 bg-gray-900 text-white border border-gray-700">
          {getSourceIcon(resource.source)}
          <span>{resource.source}</span>
        </span>
      </div>

      {/* Icon and Title */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="p-3 bg-gray-800 rounded-lg flex-shrink-0">
          <Database className="w-6 h-6 text-gray-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{resource.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* View Resource Button */}
      <button
        onClick={() => onViewResource(resource)}
        className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
      >
        <span>View Resource</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ResourceCard;

