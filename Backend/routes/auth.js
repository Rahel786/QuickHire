import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { generateToken } from '../data/users.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

const router = express.Router();

// Send OTP for registration
router.post('/send-otp', async (req, res) => {
  try {
    const { email, type = 'registration' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists (for registration)
    if (type === 'registration') {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists. Please sign in instead.' });
      }
    } else if (type === 'forgot_password') {
      // Check if user exists (for forgot password)
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email: normalizedEmail, type });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const otpDoc = new OTP({
      email: normalizedEmail,
      otp,
      type,
      expires_at: expiresAt
    });
    await otpDoc.save();

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp, type);
      res.json({
        message: 'OTP sent successfully to your email',
        email: normalizedEmail
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // In development, still return success
      if (process.env.NODE_ENV === 'development') {
        res.json({
          message: 'OTP generated (check console in dev mode)',
          email: normalizedEmail,
          otp: otp // Only in dev mode
        });
      } else {
        res.status(500).json({ error: 'Failed to send email. Please try again.' });
      }
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP and register
router.post('/verify-otp-register', async (req, res) => {
  try {
    const { email, otp, password, name, college, batch_year } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ error: 'Email, OTP, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP
    const otpDoc = await OTP.findOne({
      email: normalizedEmail,
      type: 'registration',
      is_verified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpDoc.expires_at) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (otpDoc.attempts >= 5) {
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      email: normalizedEmail,
      password,
      name: name || normalizedEmail.split('@')[0],
      role: 'student',
      college,
      batch_year
    });

    await newUser.save();

    // Mark OTP as verified
    otpDoc.is_verified = true;
    await otpDoc.save();

    // Send welcome email
    await sendWelcomeEmail(normalizedEmail, newUser.name);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        college: newUser.college
      },
      token,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Verify OTP register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint (legacy - kept for backward compatibility)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, college, batch_year } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      name: name || email.split('@')[0],
      role: 'student',
      college,
      batch_year
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        college: newUser.college
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Demo credentials (for testing)
    const demoCredentials = {
      'test@quickhire.com': { password: 'test123', name: 'Test User' },
      'student@quickhire.com': { password: 'student123', name: 'Student User' },
      'admin@quickhire.com': { password: 'admin123', name: 'Admin User' }
    };

    // Try to find user in database
    let user = await User.findOne({ email: email.toLowerCase() });
    
    let isValid = false;
    let userData = null;

    if (user) {
      // User exists in database, check password
      isValid = await user.comparePassword(password);
      if (isValid) {
        userData = user;
      }
    } else if (demoCredentials[email.toLowerCase()]) {
      // Check demo credentials and create user if valid
      isValid = demoCredentials[email.toLowerCase()].password === password;
      if (isValid) {
        // Create user in database
        user = new User({
          email: email.toLowerCase(),
          password: password,
          name: demoCredentials[email.toLowerCase()].name,
          role: 'student'
        });
        await user.save();
        userData = user;
      }
    }

    if (!isValid || !userData) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(userData);

    res.json({
      user: {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        college: userData.college
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If the email exists, an OTP has been sent' });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail, type: 'forgot_password' });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const otpDoc = new OTP({
      email: normalizedEmail,
      otp,
      type: 'forgot_password',
      expires_at: expiresAt
    });
    await otpDoc.save();

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp, 'forgot_password');
      res.json({
        message: 'If the email exists, an OTP has been sent',
        email: normalizedEmail
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      if (process.env.NODE_ENV === 'development') {
        res.json({
          message: 'OTP generated (check console in dev mode)',
          email: normalizedEmail,
          otp: otp // Only in dev mode
        });
      } else {
        res.status(500).json({ error: 'Failed to send email. Please try again.' });
      }
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password - Verify OTP and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP
    const otpDoc = await OTP.findOne({
      email: normalizedEmail,
      type: 'forgot_password',
      is_verified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpDoc.expires_at) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (otpDoc.attempts >= 5) {
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark OTP as verified
    otpDoc.is_verified = true;
    await otpDoc.save();

    res.json({
      message: 'Password reset successfully. Please sign in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'quickhire_secret_key');
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          college: user.college,
          batch_year: user.batch_year
        }
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRouter };

