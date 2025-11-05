import express from 'express';
import { College } from '../models/College.js';

const router = express.Router();

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, type } = req.query;

    // Build query
    const query = { is_active: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { abbreviation: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const colleges = await College.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.json({
      colleges,
      count: colleges.length
    });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific college
router.get('/:collegeName', async (req, res) => {
  try {
    const { collegeName } = req.params;
    const decodedName = decodeURIComponent(collegeName);

    const college = await College.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${decodedName}$`, 'i') } },
        { abbreviation: { $regex: new RegExp(`^${decodedName}$`, 'i') } }
      ],
      is_active: true
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json({ college });
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as collegesRouter };


