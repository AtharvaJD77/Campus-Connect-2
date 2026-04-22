import Message from '../models/Message.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';

// ✅ Broadcast Message to Event (Admins)
export const createMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message_content } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const club = await Club.findById(event.club);
    
    // Auth Check
    if (
      club.createdBy.toString() !== req.user._id.toString() &&
      !['SystemAdmin', 'Admin'].includes(req.user.role)
    ) {
      return res.status(401).json({ message: 'Not authorized to broadcast announcements.' });
    }

    const newMessage = await Message.create({
      event: eventId,
      sender: req.user._id,
      message_content,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Fetch Messages (Approved Students & Admins)
export const getMessages = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    // Validate Student Approval Status
    if (req.user.role === 'Student') {
      const registration = await Registration.findOne({ event: eventId, student: req.user._id });
      if (!registration || registration.status !== 'Approved') {
        return res.status(403).json({ message: 'You must be approved by the organizer to view announcements.' });
      }
    }

    const messages = await Message.find({ event: eventId })
      .populate('sender', 'name')
      .sort({ createdAt: -1 }); // Newest first, frontend can reverse or display directly

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
