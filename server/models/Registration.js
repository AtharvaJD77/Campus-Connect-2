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
  phoneNumber: {
    type: String,
    required: false,
  },
  registrationType: {
    type: String,
    enum: ['Individual', 'Group'],
    default: 'Individual',
    required: true,
  },
  teamName: {
    type: String,
    required: false,
  },
  teamMembers: [{
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    rollNumber: { type: String, required: true }
  }],
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: false,
  },
  yearOfStudy: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'registered', 'cancelled', 'attended'],
    default: 'Pending'
  },
  paymentProof: {
    type: String,
  }
}, { timestamps: true });

// Prevent a student from registering for the same event twice
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
