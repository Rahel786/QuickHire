import mongoose from 'mongoose';

const interviewRoundSchema = new mongoose.Schema({
  round_type: {
    type: String,
    enum: ['mcq', 'coding', 'technical', 'hr', 'group_discussion', 'case_study'],
    required: true
  },
  round_number: {
    type: Number,
    required: true
  },
  questions_pattern: {
    type: String,
    trim: true
  },
  detailed_questions: {
    type: String,
    trim: true
  },
  duration_minutes: {
    type: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'very_hard']
  },
  tips: {
    type: String,
    trim: true
  }
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  position_title: {
    type: String,
    required: true,
    trim: true
  },
  college: {
    type: String,
    trim: true,
    index: true
  },
  batch_year: {
    type: Number,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  overall_difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'very_hard'],
    default: 'medium'
  },
  preparation_tips: {
    type: String,
    trim: true
  },
  resources: {
    type: String,
    trim: true
  },
  experience_story: {
    type: String,
    trim: true
  },
  linkedin_profile: {
    type: String,
    trim: true,
    default: null
  },
  interview_rounds: [interviewRoundSchema],
  likes_count: {
    type: Number,
    default: 0
  },
  liked_by: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  helpful_count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
experienceSchema.index({ company_name: 1, college: 1 });
experienceSchema.index({ createdAt: -1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ 'interview_rounds.round_type': 1 });

export const Experience = mongoose.model('Experience', experienceSchema);

