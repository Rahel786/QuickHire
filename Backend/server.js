import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { experiencesRouter } from './routes/experiences.js';
import { authRouter } from './routes/auth.js';
import { collegesRouter } from './routes/colleges.js';
import { learningsRouter } from './routes/learnings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/colleges', collegesRouter);
app.use('/api/learnings', learningsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickHire API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
});


