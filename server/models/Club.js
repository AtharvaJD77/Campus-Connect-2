import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // Cloudinary URL
    default: '',
  },
  college: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  followersCount: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  videos: [{
    type: String,
  }]
}, { timestamps: true });

export default mongoose.model('Club', clubSchema);
