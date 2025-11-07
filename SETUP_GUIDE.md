# QuickHire - Complete Setup Guide

This guide will help you set up and run the QuickHire application with full authentication functionality.

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **Git** (optional, for version control)

---

## Step 1: Install Dependencies

### Backend Dependencies

```bash
cd QuickHire/Backend
npm install
```

### Frontend Dependencies

```bash
cd QuickHire/Fronntend
npm install
```

---

## Step 2: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **Mac/Linux**: Run `mongod` in terminal
3. Default connection: `mongodb://localhost:27017/quickhire`

### Option B: MongoDB Atlas (Cloud - Recommended for Testing)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/quickhire`)
4. Use this connection string in your `.env` file

---

## Step 3: Configure Environment Variables

### Backend Configuration

Create a `.env` file in `QuickHire/Backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quickhire
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickhire

# Server Port
PORT=8000

# JWT Secret (change this to a random string in production)
JWT_SECRET=quickhire_secret_key_change_in_production

# Node Environment
NODE_ENV=development

# Email Configuration (Optional for Development)
# For development, OTP will be shown in console if email is not configured
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Demo User (Optional)
DEMO_EMAIL=demo@quickhire.com
DEMO_PASSWORD=demo123
DEMO_NAME=Demo User
```

### Email Setup (Optional - For Development)

**Note**: In development mode, OTPs are automatically displayed in the console and on the frontend, so email setup is optional.

If you want to enable email sending:

1. **Gmail Setup**:
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an "App Password" for this application
   - Use your Gmail address and the app password in `.env`

2. **Alternative Email Services**:
   - You can modify `Backend/utils/emailService.js` to use other services like:
     - SendGrid
     - AWS SES
     - Mailgun
     - SMTP servers

### Frontend Configuration (Optional)

Create a `.env` file in `QuickHire/Fronntend/` directory if you need to change the API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Step 4: Start the Application

### Terminal 1 - Start Backend Server

```bash
cd QuickHire/Backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:8000
📚 API endpoints available at http://localhost:8000/api
```

### Terminal 2 - Start Frontend Server

```bash
cd QuickHire/Fronntend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test the Authentication

### 1. Open the Application

Navigate to `http://localhost:5173` in your browser

### 2. Test User Sign Up

1. Click "Sign Up" tab
2. Enter:
   - Name: Your Name
   - Email: your-email@example.com
   - Password: (at least 6 characters)
3. Click "Sign Up"
4. **In Development Mode**: The OTP will be displayed on the screen and in the backend console
5. Enter the OTP
6. You'll be redirected to the dashboard

### 3. Test User Login

1. Click "Sign In" tab
2. Use one of these test credentials:
   - Email: `test@quickhire.com` | Password: `test123`
   - Email: `student@quickhire.com` | Password: `student123`
   - Email: `admin@quickhire.com` | Password: `admin123`
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 4. Test Forgot Password

1. Click "Forgot password?" link
2. Enter your registered email
3. **In Development Mode**: The OTP will be displayed on the screen
4. Enter the OTP
5. Set a new password
6. Login with the new password

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
```
❌ MongoDB connection error: ...
```
- **Solution**: Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For Atlas: Ensure your IP is whitelisted in Atlas dashboard

**Port Already in Use**:
```
Error: listen EADDRINUSE: address already in use :::8000
```
- **Solution**: Change `PORT` in `.env` or stop the process using port 8000

**Module Not Found**:
```
Error: Cannot find module '...'
```
- **Solution**: Run `npm install` in the Backend directory

### Frontend Issues

**API Connection Error**:
- **Solution**: Make sure backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env` file
- Check browser console for CORS errors (backend CORS is already configured)

**Build Errors**:
```
Error: Cannot find module '...'
```
- **Solution**: Run `npm install` in the Fronntend directory

### Authentication Issues

**OTP Not Showing**:
- In development mode, OTP is shown:
  1. On the frontend screen (blue box)
  2. In backend console
  3. In browser console
- If email is configured, check email inbox

**Login Not Working**:
- Check backend console for errors
- Verify user exists in database
- Check JWT_SECRET is set in `.env`
- Clear browser localStorage and try again

**Token Expired**:
- Tokens expire after 7 days
- Simply login again to get a new token

---

## Development vs Production

### Development Mode (Current Setup)

- OTP displayed on screen and in console
- Email sending optional (falls back to console)
- Detailed error messages
- Hot reload enabled

### Production Mode

To run in production:

1. **Backend**:
   ```bash
   NODE_ENV=production npm start
   ```

2. **Frontend**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Changes Needed**:
   - Set proper `JWT_SECRET` (use a strong random string)
   - Configure email service properly
   - Set `NODE_ENV=production`
   - Use a production MongoDB instance
   - Set up proper CORS origins
   - Use environment variables for all secrets

---

## API Endpoints

All endpoints are prefixed with `/api`:

### Authentication
- `POST /api/auth/send-otp` - Send OTP for registration
- `POST /api/auth/verify-otp-register` - Verify OTP and register
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send OTP for password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user (requires auth token)

### Health Check
- `GET /api/health` - Check if API is running

---

## Next Steps

Once authentication is working:

1. ✅ User can sign up with OTP verification
2. ✅ User can login
3. ✅ User can reset password
4. ✅ Protected routes work
5. ✅ User state persists across page reloads

You can now:
- Test other features of the application
- Add more protected routes
- Customize the UI
- Add additional authentication features

---

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Check backend console for errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

---

## Security Notes

⚠️ **Important for Production**:

1. Change `JWT_SECRET` to a strong random string
2. Never commit `.env` files to version control
3. Use HTTPS in production
4. Implement rate limiting for OTP requests
5. Use a proper email service (not Gmail SMTP)
6. Validate and sanitize all user inputs
7. Use environment-specific configurations

---

Happy Coding! 🚀

