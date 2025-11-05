import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['registration', 'forgot_password'],
    required: true,
    index: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
otpSchema.index({ email: 1, type: 1, is_verified: 1 });

export const OTP = mongoose.model('OTP', otpSchema);

