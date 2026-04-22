import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  type: {
    type: String,
    enum: ['Suggestion', 'Complaint'],
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
