# QuickHire Backend Server

Backend API server for QuickHire application with MongoDB database.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running:
```bash
# If using local MongoDB, start the service
# On Windows: MongoDB should start automatically
# On Mac/Linux: sudo systemctl start mongod
```

3. Create `.env` file (copy from `.env.example`):
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create .env file with:
PORT=8000
JWT_SECRET=quickhire_secret_key_change_in_production
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quickhire
```

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:8000`

## MongoDB Connection

The server will automatically:
- Connect to MongoDB on startup
- Create database `quickhire` if it doesn't exist
- Seed initial colleges data on first run

### MongoDB Atlas (Cloud)

If using MongoDB Atlas, update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickhire
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Experiences
- `GET /api/experiences/colleges` - Get all experiences from all colleges
- `GET /api/experiences/colleges/:collegeName` - Get experiences by college
- `POST /api/experiences` - Create new experience
- `POST /api/experiences/:id/like` - Like an experience

### Colleges
- `GET /api/colleges` - Get all colleges (with search)
- `GET /api/colleges/:collegeName` - Get specific college

### Learnings
- `GET /api/learnings` - Get all learning plans
- `GET /api/learnings/:planId` - Get specific learning plan
- `POST /api/learnings` - Create new learning plan
- `PUT /api/learnings/:planId` - Update learning plan
- `DELETE /api/learnings/:planId` - Delete learning plan

## Dummy Credentials

For testing purposes, use these credentials:

1. **Email:** `test@quickhire.com`  
   **Password:** `test123`

2. **Email:** `student@quickhire.com`  
   **Password:** `student123`

3. **Email:** `admin@quickhire.com`  
   **Password:** `admin123`

## Notes

- The server uses in-memory data storage (mockData.js)
- For production, replace with a database (MongoDB, PostgreSQL, etc.)
- JWT tokens expire after 7 days
- All endpoints support CORS for frontend integration


