import express from 'express';
import { LearningPlan } from '../models/LearningPlan.js';

const router = express.Router();

// Get all learning plans for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || req.query.user_id;
    
    const query = {};
    if (userId) {
      query.user_id = userId;
    }

    const plans = await LearningPlan.find(query)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      plans,
      count: plans.length
    });
  } catch (error) {
    console.error('Get learning plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific learning plan
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await LearningPlan.findById(planId)
      .populate('user_id', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Get learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new learning plan
router.post('/', async (req, res) => {
  try {
    const planData = req.body;
    const userId = req.headers['user-id'] || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const newPlan = new LearningPlan({
      user_id: userId,
      ...planData,
      status: 'active',
      started_at: new Date(),
      progress: 0
    });

    await newPlan.save();
    await newPlan.populate('user_id', 'name email');

    res.status(201).json({
      plan: newPlan,
      message: 'Learning plan created successfully'
    });
  } catch (error) {
    console.error('Create learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update learning plan
router.put('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await LearningPlan.findByIdAndUpdate(
      planId,
      req.body,
      { new: true, runValidators: true }
    ).populate('user_id', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({
      plan,
      message: 'Learning plan updated successfully'
    });
  } catch (error) {
    console.error('Update learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete learning plan
router.delete('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await LearningPlan.findByIdAndDelete(planId);

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({ message: 'Learning plan deleted successfully' });
  } catch (error) {
    console.error('Delete learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as learningsRouter };


