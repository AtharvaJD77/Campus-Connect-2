import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  }
}, { timestamps: true });

// Prevent a student from following the same club twice
followerSchema.index({ student: 1, club: 1 }, { unique: true });

export default mongoose.model('Follower', followerSchema);
