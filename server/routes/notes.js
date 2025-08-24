import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, query, validationResult } from 'express-validator';
import Note from '../models/Note.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, TXT, JPG, JPEG, PNG files are allowed'));
    }
  }
});

// @route   POST /api/notes/upload
// @desc    Upload a new note
// @access  Private
router.post('/upload', [
  authenticateToken,
  upload.single('file'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required'),
  body('semester')
    .trim()
    .notEmpty()
    .withMessage('Semester is required'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('unit')
    .optional()
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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

    if (!req.file) {
      return res.status(400).json({ 
        error: 'File is required' 
      });
    }

    const {
      title,
      description,
      degree,
      semester,
      subject,
      unit,
      tags
    } = req.body;

    // Create new note
    const note = new Note({
      title,
      description,
      author: req.user._id,
      authorName: req.user.displayName,
      degree,
      semester,
      subject,
      unit: unit || '',
      tags: tags ? JSON.parse(tags) : [],
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: path.extname(req.file.originalname).substring(1).toUpperCase()
    });

    await note.save();

    // Update user upload count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { uploadCount: 1 }
    });

    res.status(201).json({
      message: 'Note uploaded successfully',
      note
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Server error during upload' 
    });
  }
});

// @route   GET /api/notes
// @desc    Get all notes with filtering and pagination
// @access  Public (with optional auth)
router.get('/', [
  optionalAuth,
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('degree')
    .optional()
    .trim(),
  query('semester')
    .optional()
    .trim(),
  query('subject')
    .optional()
    .trim(),
  query('search')
    .optional()
    .trim(),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'rating', 'downloads', 'views'])
    .withMessage('Invalid sort parameter')
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

    const {
      page = 1,
      limit = 20,
      degree,
      semester,
      subject,
      search,
      sort = 'newest'
    } = req.query;

    // Build filter query
    const filter = { status: 'approved', isPublic: true };
    
    if (degree) filter.degree = degree;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'rating':
        sortQuery = { rating: -1 };
        break;
      case 'downloads':
        sortQuery = { downloads: -1 };
        break;
      case 'views':
        sortQuery = { viewCount: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const notes = await Note.find(filter)
      .populate('author', 'displayName avatar')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-comments');

    const total = await Note.countDocuments(filter);

    // Increment view count for each note
    if (req.user) {
      const noteIds = notes.map(note => note._id);
      await Note.updateMany(
        { _id: { $in: noteIds } },
        { $inc: { viewCount: 1 } }
      );
    }

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
    console.error('Get notes error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching notes' 
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note by ID
// @access  Public (with optional auth)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'displayName avatar role joinDate')
      .populate('comments.user', 'displayName avatar');

    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    if (!note.isPublic || note.status !== 'approved') {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Increment view count
    await note.incrementView();

    res.json({ note });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching note' 
    });
  }
});

// @route   POST /api/notes/:id/download
// @desc    Download a note (increment download count)
// @access  Public (with optional auth)
router.post('/:id/download', optionalAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    if (!note.isPublic || note.status !== 'approved') {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Increment download count
    await note.incrementDownload();

    // Update user download count if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { downloadCount: 1 }
      });
    }

    res.json({
      message: 'Download recorded successfully',
      downloadUrl: note.fileUrl
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Server error while recording download' 
    });
  }
});

// @route   POST /api/notes/:id/rate
// @desc    Rate a note
// @access  Private
router.post('/:id/rate', [
  authenticateToken,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
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

    const { rating } = req.body;
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    if (!note.isPublic || note.status !== 'approved') {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Check if user is rating their own note
    if (note.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        error: 'You cannot rate your own note' 
      });
    }

    // Add rating
    await note.addRating(rating);

    res.json({
      message: 'Rating added successfully',
      note: {
        id: note._id,
        rating: note.rating,
        ratingCount: note.ratingCount
      }
    });

  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ 
      error: 'Server error while adding rating' 
    });
  }
});

// @route   POST /api/notes/:id/comment
// @desc    Add a comment to a note
// @access  Private
router.post('/:id/comment', [
  authenticateToken,
  body('comment')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
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

    const { comment } = req.body;
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    if (!note.isPublic || note.status !== 'approved') {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Add comment
    await note.addComment(req.user._id, req.user.displayName, comment);

    res.json({
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ 
      error: 'Server error while adding comment' 
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note (only by author or admin)
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Check if user is author or admin
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Not authorized to delete this note' 
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    // Update user upload count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { uploadCount: -1 }
    });

    res.json({
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      error: 'Server error while deleting note' 
    });
  }
});

export default router;
