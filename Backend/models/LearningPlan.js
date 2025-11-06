import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
  day_number: {
    type: Number,
    required: true
  },
  core_concepts: [{
    type: String,
    trim: true
  }],
  learning_resources: [{
    type: String,
    trim: true
  }],
  practice_questions: [{
    type: String,
    trim: true
  }],
  interview_questions: [{
    question: String,
    answer: String,
    answerType: String,
    impressTip: String
  }],
  learning_context: {
    type: String,
    trim: true
  },
  estimated_hours: {
    type: Number,
    default: 2
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  completed_at: {
    type: Date
  }
}, { _id: true });

const learningPlanSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  technology_id: {
    type: String
  },
  technologies: {
    name: String,
    id: String,
    category: String
  },
  total_days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  daily_hours: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  plan_title: {
    type: String,
    required: true,
    trim: true
  },
  explanation_type: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  daily_plans: [dailyPlanSchema],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  started_at: {
    type: Date
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
learningPlanSchema.index({ user_id: 1, created_at: -1 });
learningPlanSchema.index({ status: 1 });
learningPlanSchema.index({ 'technologies.name': 1 });

export const LearningPlan = mongoose.model('LearningPlan', learningPlanSchema);



