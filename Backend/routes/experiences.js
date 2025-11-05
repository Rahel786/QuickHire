import express from 'express';
import { Experience } from '../models/Experience.js';
import { College } from '../models/College.js';

const router = express.Router();

// Get all experiences from all colleges
router.get('/colleges', async (req, res) => {
  try {
    const { search, college, company, rating } = req.query;
    
    // Build query
    const query = { status: 'published' };

    // Filter by college
    if (college) {
      query.college = { $regex: college, $options: 'i' };
    }

    // Filter by company
    if (company) {
      query.company_name = { $regex: company, $options: 'i' };
    }

    // Filter by rating
    if (rating) {
      const minRating = parseFloat(rating);
      query.rating = { $gte: minRating };
    }

    // Search filter
    if (search) {
      query.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { position_title: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { preparation_tips: { $regex: search, $options: 'i' } }
      ];
    }

    const experiences = await Experience.find(query)
      .populate('user_id', 'name email college')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      experiences,
      count: experiences.length
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get experiences by specific college
router.get('/colleges/:collegeName', async (req, res) => {
  try {
    const { collegeName } = req.params;
    const decodedCollege = decodeURIComponent(collegeName);

    const experiences = await Experience.find({
      college: { $regex: decodedCollege, $options: 'i' },
      status: 'published'
    })
      .populate('user_id', 'name email college')
      .sort({ createdAt: -1 });

    res.json({
      experiences,
      count: experiences.length,
      college: decodedCollege
    });
  } catch (error) {
    console.error('Get experiences by college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new experience
router.post('/', async (req, res) => {
  try {
    const experienceData = req.body;
    const userId = req.headers['user-id'] || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const newExperience = new Experience({
      user_id: userId,
      ...experienceData,
      status: 'published'
    });

    await newExperience.save();
    await newExperience.populate('user_id', 'name email college');

    res.status(201).json({
      experience: newExperience,
      message: 'Experience shared successfully'
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like an experience
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByIdAndUpdate(
      id,
      { $inc: { likes_count: 1 } },
      { new: true }
    ).populate('user_id', 'name email college');

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({
      experience,
      message: 'Experience liked successfully'
    });
  } catch (error) {
    console.error('Like experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as experiencesRouter };


