import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  // For development, using Gmail SMTP
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, type = 'registration') => {
  try {
    const transporter = createTransporter();
    
    const subject = type === 'registration' 
      ? 'QuickHire - Verify Your Email'
      : 'QuickHire - Reset Your Password';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .card {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .otp-box {
            background-color: #f3f4f6;
            border: 2px dashed #3b82f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">
              <h1 style="color: #3b82f6; margin: 0;">QuickHire</h1>
            </div>
            <h2 style="color: #111827; margin-top: 0;">
              ${type === 'registration' ? 'Welcome to QuickHire!' : 'Password Reset Request'}
            </h2>
            <p>
              ${type === 'registration' 
                ? 'Thank you for signing up! Please verify your email address by entering the OTP below.'
                : 'We received a request to reset your password. Use the OTP below to proceed.'}
            </p>
            <div class="otp-box">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
            </p>
            ${type === 'registration' 
              ? '<p style="color: #6b7280; font-size: 14px;">If you didn\'t create an account, please ignore this email.</p>'
              : '<p style="color: #6b7280; font-size: 14px;">If you didn\'t request a password reset, please ignore this email.</p>'}
            <div class="footer">
              <p>This is an automated email from QuickHire. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} QuickHire. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"QuickHire" <${process.env.EMAIL_USER || 'noreply@quickhire.com'}>`,
      to: email,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // In development, log the OTP instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode' };
    }
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .card {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1 style="color: #3b82f6;">Welcome to QuickHire, ${name}!</h1>
            <p>Your account has been successfully created. You can now start exploring interview experiences and learning plans.</p>
            <p>Happy learning!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"QuickHire" <${process.env.EMAIL_USER || 'noreply@quickhire.com'}>`,
      to: email,
      subject: 'Welcome to QuickHire!',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email
  }
};


