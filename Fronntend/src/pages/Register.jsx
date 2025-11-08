import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, UserPlus, AlertCircle, Eye, EyeOff, User, Building2, GraduationCap, Briefcase, Calendar, ArrowLeft } from 'lucide-react';
import Header from '../components/ui/Header';
import SuccessNotification from '../components/SuccessNotification';
import { authAPI } from '../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'professional'
  const [college, setCollege] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [devOTP, setDevOTP] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email?.trim()) {
      setError('Email is required.');
      return;
    }
    if (!name?.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Validate based on user type
    if (userType === 'student') {
      if (!college?.trim()) {
        setError('Please enter your college name.');
        return;
      }
      if (!batchYear || Number.isNaN(parseInt(batchYear, 10))) {
        setError('Please enter a valid graduation year.');
        return;
      }
    } else if (userType === 'professional') {
      if (!companyName?.trim()) {
        setError('Please enter your company name.');
        return;
      }
      if (!yearsExperience || Number.isNaN(parseFloat(yearsExperience)) || parseFloat(yearsExperience) < 0) {
        setError('Please enter a valid number of years of experience.');
        return;
      }
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setOtpLoading(true);

    try {
      const response = await authAPI.sendOTP(email, 'registration');
      if (response.error) {
        setError(response.error);
      } else {
        setOtpSent(true);
        setShowOTP(true);
        // Store OTP for dev mode display
        if (response.otp) {
          setDevOTP(response.otp);
          console.log('OTP for development:', response.otp);
        }
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const gradYear = userType === 'student' ? (batchYear ? parseInt(batchYear, 10) : null) : null;
      const expYears = userType === 'professional' ? (yearsExperience ? parseFloat(yearsExperience) : null) : null;
      
      const result = await authAPI.verifyOTPRegister(
        email, 
        otp, 
        password, 
        name, 
        userType === 'student' ? college : null, 
        gradYear,
        userType,
        expYears,
        userType === 'professional' ? companyName : null
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        // Token and user are already stored by authAPI.verifyOTPRegister
        // Trigger a custom event to update auth context
        window.dispatchEvent(new Event('localStorageUpdated'));
        // Show success notification then redirect
        const userName = result.user?.name || result.name || 'User';
        setSuccessMessage(`Welcome ${userName}! Account created successfully.`);
        setShowSuccess(true);
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!name || !name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email || !email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate based on user type
    if (userType === 'student') {
      if (!college || !college.trim()) {
        setError('College name is required');
        return;
      }

      if (!batchYear || Number.isNaN(parseInt(batchYear, 10))) {
        setError('Please enter a valid graduation year');
        return;
      }
    } else if (userType === 'professional') {
      if (!companyName || !companyName.trim()) {
        setError('Company name is required');
        return;
      }

      if (!yearsExperience || Number.isNaN(parseFloat(yearsExperience)) || parseFloat(yearsExperience) < 0) {
        setError('Please enter a valid number of years of experience');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      // For sign up, send OTP first
      await handleSendOTP();
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    // Check if user needs onboarding, otherwise go to dashboard
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.onboarding_completed) {
      navigate('/onboarding', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showSuccess && (
        <SuccessNotification
          message={successMessage}
          onComplete={handleSuccessComplete}
          duration={2000}
        />
      )}
      
      <main className="flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Sign up to get started with QuickHire</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            {!showOTP ? (
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('student');
                      // Clear professional fields
                      setYearsExperience('');
                      setCompanyName('');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      userType === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium text-sm">Student / Non-working</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('professional');
                      // Clear student fields
                      setCollege('');
                      setBatchYear('');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      userType === 'professional'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium text-sm">Working Professional</span>
                  </button>
                </div>
              </div>

              {/* Conditional Fields for Student */}
              {userType === 'student' && (
                <>
                  {/* College Field */}
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                      College Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="college"
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g., IIT Delhi"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Graduation Year Field */}
                  <div>
                    <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="batchYear"
                        type="number"
                        required
                        value={batchYear}
                        onChange={(e) => setBatchYear(e.target.value)}
                        placeholder="2025"
                        min="2000"
                        max="2100"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Conditional Fields for Professional */}
              {userType === 'professional' && (
                <>
                  {/* Company Name Field */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="companyName"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Google, Microsoft"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Years of Experience Field */}
                  <div>
                    <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="yearsExperience"
                        type="number"
                        required
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="e.g., 2.5"
                        min="0"
                        max="50"
                        step="0.5"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpLoading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading || otpLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </>
                )}
              </button>
            </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent a 6-digit OTP to <strong>{email}</strong>
                  </p>
                  {otpSent && devOTP && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Development Mode - OTP:</p>
                      <p className="text-lg font-mono font-bold text-blue-700">{devOTP}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOTP(false);
                      setOtpSent(false);
                      setOtp('');
                      setDevOTP('');
                    }}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || loading}
                    className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify OTP</span>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {otpLoading ? 'Resending...' : "Didn't receive OTP? Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;




