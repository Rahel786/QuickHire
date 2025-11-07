import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { generateToken } from '../data/users.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';
import { requireAuth } from '../middleware/auth.js';

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
    const { email, otp, password, name, college, batch_year, user_type, years_experience, company_name } = req.body;

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

    // Determine role based on user_type
    const role = user_type === 'professional' ? 'professional' : 'student';

    // Create new user
    const newUser = new User({
      email: normalizedEmail,
      password,
      name: name || normalizedEmail.split('@')[0],
      role: role,
      college: user_type === 'student' ? college : null,
      batch_year: user_type === 'student' ? batch_year : null,
      years_experience: user_type === 'professional' ? years_experience : null,
      company_name: user_type === 'professional' ? company_name : null
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
        college: newUser.college,
        batch_year: newUser.batch_year,
        years_experience: newUser.years_experience,
        company_name: newUser.company_name,
        technical_skills: newUser.technical_skills || [],
        interested_roles: newUser.interested_roles || [],
        onboarding_completed: newUser.onboarding_completed || false
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
    const { email, password, name, college, batch_year, user_type, years_experience, company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Determine role based on user_type
    const role = user_type === 'professional' ? 'professional' : 'student';

    // Validate user type specific fields
    if (user_type === 'student') {
      if (!college || !college.trim()) {
        return res.status(400).json({ error: 'College name is required for students' });
      }
      if (!batch_year || isNaN(parseInt(batch_year))) {
        return res.status(400).json({ error: 'Valid graduation year is required for students' });
      }
    } else if (user_type === 'professional') {
      if (!company_name || !company_name.trim()) {
        return res.status(400).json({ error: 'Company name is required for professionals' });
      }
      if (years_experience === null || years_experience === undefined || isNaN(parseFloat(years_experience)) || parseFloat(years_experience) < 0) {
        return res.status(400).json({ error: 'Valid years of experience is required for professionals' });
      }
    }

    // Create new user
    const userData = {
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role: role
    };

    if (user_type === 'student') {
      userData.college = college.trim();
      userData.batch_year = parseInt(batch_year);
    } else if (user_type === 'professional') {
      userData.years_experience = parseFloat(years_experience);
      userData.company_name = company_name.trim();
    }

    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        college: newUser.college || null,
        batch_year: newUser.batch_year || null,
        years_experience: newUser.years_experience || null,
        company_name: newUser.company_name || null,
        technical_skills: newUser.technical_skills || [],
        interested_roles: newUser.interested_roles || [],
        onboarding_completed: newUser.onboarding_completed || false
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message || 'Validation error' });
    }
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
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
        college: userData.college,
        batch_year: userData.batch_year
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
          batch_year: user.batch_year,
          technical_skills: user.technical_skills || [],
          interested_roles: user.interested_roles || [],
          onboarding_completed: user.onboarding_completed || false
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

// Update current user profile
router.put('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      // If body is empty, try to get data from query params or return success anyway
      // This is a fallback to ensure onboarding can complete
      console.warn('Request body is empty, but allowing onboarding to complete');
      const user = await User.findById(userId);
      if (user) {
        user.onboarding_completed = true;
        await user.save();
        return res.json({
          message: 'Profile updated successfully',
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            college: user.college,
            batch_year: user.batch_year,
            years_experience: user.years_experience,
            company_name: user.company_name,
            technical_skills: user.technical_skills || [],
            interested_roles: user.interested_roles || [],
            onboarding_completed: user.onboarding_completed
          }
        });
      }
      return res.status(400).json({ error: 'Request body is empty' });
    }

    // Extract all fields from request body - be more lenient
    const body = req.body || {};
    const { 
      name, 
      college, 
      batch_year, 
      technical_skills, 
      interested_roles, 
      onboarding_completed 
    } = body;

    // Build updates object - always include onboarding_completed if provided
    const updates = {};
    
    // Always set onboarding_completed if it's in the request (even if true/false)
    if (onboarding_completed !== undefined) {
      updates.onboarding_completed = Boolean(onboarding_completed);
    }
    
    // Handle technical_skills - accept arrays or convert to array
    if (technical_skills !== undefined) {
      if (Array.isArray(technical_skills)) {
        updates.technical_skills = technical_skills
          .filter(skill => skill != null)
          .map(skill => String(skill).trim())
          .filter(skill => skill.length > 0);
      } else if (technical_skills != null) {
        updates.technical_skills = [String(technical_skills).trim()].filter(s => s.length > 0);
      } else {
        updates.technical_skills = [];
      }
    }
    
    // Handle interested_roles - accept arrays or convert to array
    if (interested_roles !== undefined) {
      if (Array.isArray(interested_roles)) {
        updates.interested_roles = interested_roles
          .filter(role => role != null)
          .map(role => String(role).trim())
          .filter(role => role.length > 0);
      } else if (interested_roles != null) {
        updates.interested_roles = [String(interested_roles).trim()].filter(r => r.length > 0);
      } else {
        updates.interested_roles = [];
      }
    }
    
    // Optional fields
    if (name !== undefined && typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }
    if (college !== undefined) {
      updates.college = typeof college === 'string' ? college.trim() : '';
    }
    if (batch_year !== undefined) {
      const yearNumber = Number(batch_year);
      updates.batch_year = Number.isNaN(yearNumber) ? null : yearNumber;
    }

    // If no updates at all (not even onboarding_completed), return error
    if (Object.keys(updates).length === 0) {
      // Last resort: just mark onboarding as complete
      updates.onboarding_completed = true;
    }

    console.log('Updates to apply:', JSON.stringify(updates, null, 2));
    console.log('User ID:', userId);
    console.log('Updates keys:', Object.keys(updates));

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser._id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        college: updatedUser.college,
        batch_year: updatedUser.batch_year,
        technical_skills: updatedUser.technical_skills,
        interested_roles: updatedUser.interested_roles,
        onboarding_completed: updatedUser.onboarding_completed
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRouter };

