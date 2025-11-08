import express from 'express';
import { User } from '../models/User.js';
import { Experience } from '../models/Experience.js';
import { LearningPlan } from '../models/LearningPlan.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply authentication and admin check to all routes
router.use(requireAuth);
router.use(requireAdmin);

// ============= USER MANAGEMENT =============

// Get user statistics
router.get('/users/stats', async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ is_active: true });
    
    // Users created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total,
      active,
      newThisMonth
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search query
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { company_name: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(searchQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      total,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get specific user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { is_active, role, ...otherUpdates } = req.body;
    
    const updates = {};
    if (is_active !== undefined) updates.is_active = is_active;
    if (role) updates.role = role;
    
    // Add other allowed updates
    const allowedFields = ['name', 'college', 'batch_year', 'company_name', 'years_experience'];
    allowedFields.forEach(field => {
      if (otherUpdates[field] !== undefined) {
        updates[field] = otherUpdates[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete user's related data
    await Experience.deleteMany({ user_id: req.params.id });
    await LearningPlan.deleteMany({ user_id: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ============= EXPERIENCE MANAGEMENT =============

// Get experience statistics
router.get('/experiences/stats', async (req, res) => {
  try {
    const total = await Experience.countDocuments();
    
    // Experiences created this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const thisWeek = await Experience.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    res.json({
      total,
      thisWeek
    });
  } catch (error) {
    console.error('Error fetching experience stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all experiences with pagination and filtering
router.get('/experiences', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = status ? { status } : {};

    const experiences = await Experience.find(query)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Experience.countDocuments(query);

    res.json({
      experiences,
      total,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Update experience status
router.put('/experiences/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate('user_id', 'name email');

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({
      experience,
      message: 'Experience updated successfully'
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Delete experience
router.delete('/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ============= LEARNING PLAN MANAGEMENT =============

// Get learning plan statistics
router.get('/learnings/stats', async (req, res) => {
  try {
    const total = await LearningPlan.countDocuments();
    const active = await LearningPlan.countDocuments({ status: 'active' });
    const completed = await LearningPlan.countDocuments({ status: 'completed' });

    res.json({
      total,
      active,
      completed
    });
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all learning plans with pagination
router.get('/learnings', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const plans = await LearningPlan.find()
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LearningPlan.countDocuments();

    res.json({
      plans,
      total,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    res.status(500).json({ error: 'Failed to fetch learning plans' });
  }
});

// Delete learning plan
router.delete('/learnings/:id', async (req, res) => {
  try {
    const plan = await LearningPlan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({ message: 'Learning plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning plan:', error);
    res.status(500).json({ error: 'Failed to delete learning plan' });
  }
});

// ============= DASHBOARD STATISTICS =============

// Get overall dashboard statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalExperiences,
      totalLearningPlans,
      recentUsers,
      recentExperiences
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ is_active: true }),
      Experience.countDocuments(),
      LearningPlan.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Experience.find().sort({ createdAt: -1 }).limit(5).populate('user_id', 'name')
    ]);

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalExperiences,
        totalLearningPlans
      },
      recentActivity: {
        users: recentUsers,
        experiences: recentExperiences
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export { router as adminRouter };