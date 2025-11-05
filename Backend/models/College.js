import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  abbreviation: {
    type: String,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['IIT', 'NIT', 'IIIT', 'Private', 'State', 'Central'],
    required: true,
    index: true
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  website: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text index for search
collegeSchema.index({ name: 'text', abbreviation: 'text' });

export const College = mongoose.model('College', collegeSchema);


