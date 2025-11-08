// Backend/routes/admin.js
import express from 'express';
import { User } from '../models/User.js';
import { Experience } from '../models/Experience.js';
import { LearningPlan } from '../models/LearningPlan.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(isAdmin);

// ==================== DASHBOARD STATS ====================
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalExperiences,
      totalPlans,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ is_active: true }),
      Experience.countDocuments(),
      LearningPlan.countDocuments(),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        new: recentUsers
      },
      experiences: {
        total: totalExperiences,
        pending: 0, // Can be enhanced with status field
        approved: totalExperiences
      },
      plans: {
        total: totalPlans,
        active: await LearningPlan.countDocuments({ status: 'active' }),
        completed: await LearningPlan.countDocuments({ status: 'completed' })
      },
      events: {
        total: 0, // Placeholder
        upcoming: 0,
        past: 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ==================== USER MANAGEMENT ====================
router.get('/users', async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status === 'active') query.is_active = true;
    if (status === 'inactive') query.is_active = false;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user statistics
    const [experiencesCount, plansCount] = await Promise.all([
      Experience.countDocuments({ user_id: user._id }),
      LearningPlan.countDocuments({ user_id: user._id })
    ]);

    res.json({
      user,
      stats: {
        experiences: experiencesCount,
        plans: plansCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/users/:userId', async (req, res) => {
  try {
    const { name, email, role, is_active, college, batch_year } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(typeof is_active === 'boolean' && { is_active }),
        ...(college && { college }),
        ...(batch_year && { batch_year })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete user's related data
    await Promise.all([
      Experience.deleteMany({ user_id: user._id }),
      LearningPlan.deleteMany({ user_id: user._id })
    ]);

    res.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ==================== EXPERIENCE MANAGEMENT ====================
router.get('/experiences', async (req, res) => {
  try {
    const { search, company, status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { position_title: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (company) query.company_name = { $regex: company, $options: 'i' };
    if (status) query.status = status;

    const experiences = await Experience.find(query)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Experience.countDocuments(query);

    res.json({
      experiences,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

router.put('/experiences/:experienceId', async (req, res) => {
  try {
    const { status } = req.body;
    
    const experience = await Experience.findByIdAndUpdate(
      req.params.experienceId,
      { status },
      { new: true }
    ).populate('user_id', 'name email');

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ experience, message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experiences/:experienceId', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.experienceId);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ==================== LEARNING PLAN MANAGEMENT ====================
router.get('/plans', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const plans = await LearningPlan.find(query)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LearningPlan.countDocuments(query);

    res.json({
      plans,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.delete('/plans/:planId', async (req, res) => {
  try {
    const plan = await LearningPlan.findByIdAndDelete(req.params.planId);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// ==================== ACTIVITY LOG ====================
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent activities from different collections
    const [recentUsers, recentExperiences, recentPlans] = await Promise.all([
      User.find()
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .limit(10),
      Experience.find()
        .select('company_name position_title createdAt')
        .populate('user_id', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      LearningPlan.find()
        .select('plan_title technologies createdAt')
        .populate('user_id', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Combine and format activities
    const activities = [
      ...recentUsers.map(u => ({
        type: 'user_joined',
        user: u.name || u.email,
        action: 'joined the platform',
        timestamp: u.createdAt
      })),
      ...recentExperiences.map(e => ({
        type: 'experience_shared',
        user: e.user_id?.name || 'Anonymous',
        action: `shared experience at ${e.company_name}`,
        timestamp: e.createdAt
      })),
      ...recentPlans.map(p => ({
        type: 'plan_created',
        user: p.user_id?.name || 'Anonymous',
        action: `created ${p.plan_title}`,
        timestamp: p.createdAt
      }))
    ];

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      activities: activities.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// ==================== ANALYTICS ====================
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      newUsers,
      newExperiences,
      newPlans,
      topCompanies,
      topColleges
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Experience.countDocuments({ createdAt: { $gte: startDate } }),
      LearningPlan.countDocuments({ createdAt: { $gte: startDate } }),
      Experience.aggregate([
        { $group: { _id: '$company_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      User.aggregate([
        { $match: { college: { $exists: true, $ne: null } } },
        { $group: { _id: '$college', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      period,
      growth: {
        users: newUsers,
        experiences: newExperiences,
        plans: newPlans
      },
      topCompanies: topCompanies.map(c => ({ name: c._id, count: c.count })),
      topColleges: topColleges.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export { router as adminRouter };