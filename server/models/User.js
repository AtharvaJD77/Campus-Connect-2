import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'ClubAdmin', 'SystemAdmin', 'Admin'],
    default: 'Student',
  },
  followedClubs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
