import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message_content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
