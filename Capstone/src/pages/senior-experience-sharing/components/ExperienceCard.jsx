import React, { useState } from 'react';
import { Building2, User, Calendar, ThumbsUp, Clock, Award, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const ExperienceCard = ({ experience, onLike, currentUser }) => {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'very_hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoundTypeColor = (roundType) => {
    switch (roundType) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'coding': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-indigo-100 text-indigo-800';
      case 'hr': return 'bg-green-100 text-green-800';
      case 'group_discussion': return 'bg-yellow-100 text-yellow-800';
      case 'case_study': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoundType = (roundType) => {
    switch (roundType) {
      case 'mcq': return 'MCQ';
      case 'coding': return 'Coding';
      case 'technical': return 'Technical';
      case 'hr': return 'HR';
      case 'group_discussion': return 'GD';
      case 'case_study': return 'Case Study';
      default: return roundType;
    }
  };

  const formatDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'very_hard': return 'Very Hard';
      default: return difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {experience?.company_name}
              </h3>
              <span className="ml-2 text-sm text-gray-500">•</span>
              <span className="ml-2 text-sm text-gray-600">
                {experience?.position_title}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">
                {experience?.user_profiles?.full_name}
              </span>
              {experience?.batch_year && (
                <>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">Batch {experience?.batch_year}</span>
                </>
              )}
              <Award className="h-4 w-4 mr-1" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experience?.overall_difficulty)}`}>
                {formatDifficulty(experience?.overall_difficulty)}
              </span>
            </div>

            {/* Interview Rounds Summary */}
            <div className="flex flex-wrap gap-2 mb-3">
              {experience?.interview_rounds?.map((round, index) => (
                <span
                  key={round?.id || index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRoundTypeColor(round?.round_type)}`}
                >
                  {formatRoundType(round?.round_type)}
                  {round?.duration_minutes && (
                    <span className="ml-1">({round?.duration_minutes}min)</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={() => onLike?.(experience?.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              disabled={!currentUser}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{experience?.likes_count || 0}</span>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Content Preview */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Preparation Tips
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {expanded 
              ? experience?.preparation_tips 
              : `${experience?.preparation_tips?.slice(0, 200)}${experience?.preparation_tips?.length > 200 ? '...' : ''}`
            }
          </p>
        </div>

        {experience?.resources && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
            <p className="text-gray-700 text-sm">
              {expanded 
                ? experience?.resources 
                : `${experience?.resources?.slice(0, 150)}${experience?.resources?.length > 150 ? '...' : ''}`
              }
            </p>
          </div>
        )}

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            Read more
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Interview Rounds Details</h4>
            <div className="space-y-4">
              {experience?.interview_rounds?.map((round, index) => (
                <div key={round?.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoundTypeColor(round?.round_type)}`}>
                        Round {round?.round_number}: {formatRoundType(round?.round_type)}
                      </span>
                      {round?.duration_minutes && (
                        <span className="ml-3 flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {round?.duration_minutes} minutes
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(round?.difficulty)}`}>
                      {formatDifficulty(round?.difficulty)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Questions Pattern</h5>
                      <p className="text-gray-700 text-sm">{round?.questions_pattern}</p>
                    </div>

                    {round?.detailed_questions && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Detailed Questions</h5>
                        <p className="text-gray-700 text-sm">{round?.detailed_questions}</p>
                      </div>
                    )}

                    {round?.tips && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Tips</h5>
                        <p className="text-gray-700 text-sm">{round?.tips}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
              >
                Show less
                <ChevronUp className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;