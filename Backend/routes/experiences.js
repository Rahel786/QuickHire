import express from 'express';
import { Experience } from '../models/Experience.js';
import { requireAuth } from '../middleware/auth.js';
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

// Get current user's experiences
router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const experiences = await Experience.find({ user_id: userId })
      .populate('user_id', 'name email college')
      .sort({ createdAt: -1 });

    res.json({
      experiences,
      count: experiences.length
    });
  } catch (error) {
    console.error('Get my experiences error:', error);
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
router.post('/', requireAuth, async (req, res) => {
  try {
    const experienceData = req.body;
    const userId = req.user?.id || req.headers['user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const newExperience = new Experience({
      user_id: userId,
      ...experienceData,
      status: 'published',
      liked_by: []
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

// Like an experience (one per user)
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const alreadyLiked = experience.liked_by?.some((likedId) => likedId.toString() === userId);
    if (alreadyLiked) {
      return res.status(200).json({
        experience,
        message: 'Already liked'
      });
    }

    experience.likes_count = (experience.likes_count || 0) + 1;
    experience.liked_by = [...(experience.liked_by || []), userId];
    await experience.save();
    await experience.populate('user_id', 'name email college');

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

// Delete an experience (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Check if user is the owner
    if (experience.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own experiences' });
    }

    await Experience.findByIdAndDelete(id);

    res.json({
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as experiencesRouter };


