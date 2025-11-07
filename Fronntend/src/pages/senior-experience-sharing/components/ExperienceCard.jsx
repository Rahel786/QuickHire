import React, { useState } from 'react';
import { Building2, User, Calendar, ThumbsUp, Clock, Award, ChevronDown, ChevronUp, BookOpen, Star, Linkedin, Trash2, GraduationCap } from 'lucide-react';

const ExperienceCard = ({ experience, onLike, currentUser, liked, onDelete, isOwnExperience }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasLiked, setHasLiked] = useState(liked || false);
  const authorName = experience?.user_profiles?.full_name || experience?.user_id?.name || 'Anonymous';
  const experienceStory = experience?.experience_story || '';
  const preparationTips = experience?.preparation_tips || '';
  const resources = experience?.resources || '';
  const linkedinUrl = experience?.linkedin_profile || experience?.linkedIn_profile || '';
  const PREVIEW_LENGTH = 200; // Characters to show in preview


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
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
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
            
          <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-2">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {authorName}
              </span>
              {(experience?.college || experience?.user_profiles?.college || experience?.user_id?.college) && (
                <span className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {experience?.college || experience?.user_profiles?.college || experience?.user_id?.college}
                </span>
              )}
              {experience?.batch_year && (
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Batch {experience?.batch_year}
                </span>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  <span className="text-xs">LinkedIn</span>
                </a>
              )}
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experience?.overall_difficulty)}`}>
                  {formatDifficulty(experience?.overall_difficulty)}
                </span>
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
              onClick={(e) => {
                e.stopPropagation();
                if (hasLiked) return;
                onLike?.(experience?.id || experience?._id, () => setHasLiked(true));
              }}
              className={`flex items-center space-x-1 ${hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} transition-colors`}
              disabled={!currentUser || hasLiked}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{experience?.likes_count || 0}</span>
            </button>
            {isOwnExperience && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this experience?')) {
                    onDelete(experience?.id || experience?._id);
                  }
                }}
                className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                title="Delete experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content - Inline expansion like Reddit/Twitter */}
      <div className="p-6 pt-4">
        {/* Experience Story */}
        {experienceStory && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Experience Story
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
              {expanded ? experienceStory : (
                <>
                  {experienceStory.length > PREVIEW_LENGTH 
                    ? `${experienceStory.slice(0, PREVIEW_LENGTH)}...` 
                    : experienceStory}
                </>
              )}
            </p>
            {experienceStory.length > PREVIEW_LENGTH && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}

        {/* Preparation Tips (if no experience story) */}
        {!experienceStory && preparationTips && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Preparation Tips
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
              {expanded ? preparationTips : (
                <>
                  {preparationTips.length > PREVIEW_LENGTH 
                    ? `${preparationTips.slice(0, PREVIEW_LENGTH)}...` 
                    : preparationTips}
                </>
              )}
            </p>
            {preparationTips.length > PREVIEW_LENGTH && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}

        {/* Resources */}
        {resources && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
              {expanded ? resources : (
                <>
                  {resources.length > PREVIEW_LENGTH 
                    ? `${resources.slice(0, PREVIEW_LENGTH)}...` 
                    : resources}
                </>
              )}
            </p>
            {resources.length > PREVIEW_LENGTH && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}

        {/* LinkedIn Profile - Always show in post box if provided */}
        {linkedinUrl && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center">
                <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Connect on LinkedIn</span>
              </div>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Connect
              </a>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Feel free to reach out for any questions or networking opportunities!
            </p>
          </div>
        )}

        {/* Interview Rounds Details - Always show when expanded */}
        {expanded && experience?.interview_rounds?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-indigo-600" />
              Interview Rounds Details
            </h4>
            <div className="space-y-3">
              {experience?.interview_rounds?.map((round, index) => (
                <div key={round?.id || index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoundTypeColor(round?.round_type)}`}>
                      Round {round?.round_number || index + 1}: {formatRoundType(round?.round_type)}
                    </span>
                    {round?.duration_minutes && (
                      <span className="flex items-center text-xs text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {round?.duration_minutes} min
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(round?.difficulty)}`}>
                      {formatDifficulty(round?.difficulty)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {round?.questions_pattern && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Questions Pattern:</h5>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">{round?.questions_pattern}</p>
                      </div>
                    )}

                    {round?.detailed_questions && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Detailed Questions:</h5>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">{round?.detailed_questions}</p>
                      </div>
                    )}

                    {round?.tips && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Tips:</h5>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">{round?.tips}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;