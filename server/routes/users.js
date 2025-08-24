import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Note from '../models/Note.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user's own profile with detailed stats
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Get user's notes
    const userNotes = await Note.find({ author: req.user._id })
      .select('title status createdAt downloads rating')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's statistics
    const stats = await Note.aggregate([
      { $match: { author: req.user._id } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalViews: { $sum: '$viewCount' },
          averageRating: { $avg: '$rating' },
          approvedNotes: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pendingNotes: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalNotes: 0,
      totalDownloads: 0,
      totalViews: 0,
      averageRating: 0,
      approvedNotes: 0,
      pendingNotes: 0
    };

    res.json({
      user: user.getPublicProfile(),
      notes: userNotes,
      stats: userStats
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching profile' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user's own profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('role')
    .optional()
    .isIn(['student', 'teacher'])
    .withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { displayName, avatar, role } = req.body;
    const updateFields = {};

    if (displayName) updateFields.displayName = displayName;
    if (avatar) updateFields.avatar = avatar;
    if (role) updateFields.role = role;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Server error while updating profile' 
    });
  }
});

// @route   GET /api/users/notes
// @desc    Get user's own notes with pagination
// @access  Private
router.get('/notes', [
  authenticateToken,
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  body('status')
    .optional()
    .isIn(['all', 'pending', 'approved', 'rejected'])
    .withMessage('Invalid status filter')
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all'
    } = req.query;

    // Build filter query
    const filter = { author: req.user._id };
    
    if (status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotes: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching user notes' 
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user's detailed statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get notes by status
    const statusStats = await Note.aggregate([
      { $match: { author: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get notes by degree
    const degreeStats = await Note.aggregate([
      { $match: { author: req.user._id } },
      {
        $group: {
          _id: '$degree',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly uploads for the last 12 months
    const monthlyStats = await Note.aggregate([
      { $match: { author: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Get top performing notes
    const topNotes = await Note.find({ author: req.user._id })
      .sort({ downloads: -1, rating: -1 })
      .limit(5)
      .select('title downloads rating status');

    res.json({
      statusStats,
      degreeStats,
      monthlyStats,
      topNotes
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching user statistics' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get public profile of another user
// @access  Public (with optional auth)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('displayName avatar role joinDate uploadCount');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Get user's public notes
    const publicNotes = await Note.find({
      author: req.params.id,
      status: 'approved',
      isPublic: true
    })
      .select('title degree semester subject downloads rating createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user: user.getPublicProfile(),
      notes: publicNotes
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching user' 
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by name or role
// @access  Public (with optional auth)
router.get('/search', async (req, res) => {
  try {
    const { q: searchQuery, role, page = 1, limit = 20 } = req.query;

    // Build filter query
    const filter = { isVerified: true };
    
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }
    
    if (role) {
      filter.role = role;
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
      .select('displayName avatar role joinDate uploadCount')
      .sort({ uploadCount: -1, joinDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      error: 'Server error while searching users' 
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user's own account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    // Delete all user's notes
    await Note.deleteMany({ author: req.user._id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      error: 'Server error while deleting account' 
    });
  }
});

export default router;
