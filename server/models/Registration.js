import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended'],
    default: 'registered'
  }
}, { timestamps: true });

// Prevent a student from registering for the same event twice
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
