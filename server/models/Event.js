import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  poster: {
    type: String, // Cloudinary URL
    default: '',
  },
  registrationLink: {
    type: String,
  },
  externalLink: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  registrationFee: {
    type: Number,
    default: 0,
  },
  participantLimit: {
    type: Number,
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  short_videos: [{
    type: String, // Array of URLs
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  likes_count: {
    type: Number,
    default: 0,
  },
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
