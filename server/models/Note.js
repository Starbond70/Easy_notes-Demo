import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  pages: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: '📚'
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
noteSchema.index({ title: 'text', description: 'text', tags: 'text' });
noteSchema.index({ degree: 1, semester: 1, subject: 1 });
noteSchema.index({ author: 1 });
noteSchema.index({ status: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ rating: -1 });
noteSchema.index({ downloads: -1 });

// Virtual for average rating
noteSchema.virtual('averageRating').get(function() {
  return this.ratingCount > 0 ? (this.totalRating / this.ratingCount).toFixed(1) : 0;
});

// Method to add rating
noteSchema.methods.addRating = function(rating) {
  this.totalRating += rating;
  this.ratingCount += 1;
  this.rating = (this.totalRating / this.ratingCount).toFixed(1);
  return this.save();
};

// Method to increment download count
noteSchema.methods.incrementDownload = function() {
  this.downloads += 1;
  return this.save();
};

// Method to increment view count
noteSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to add comment
noteSchema.methods.addComment = function(userId, userName, comment) {
  this.comments.push({
    user: userId,
    userName,
    comment,
    createdAt: new Date()
  });
  return this.save();
};

// Ensure virtual fields are serialized
noteSchema.set('toJSON', { virtuals: true });
noteSchema.set('toObject', { virtuals: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;
