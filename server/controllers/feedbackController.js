import Feedback from '../models/Feedback.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { eventId, type, message } = req.body;
    const studentId = req.user.id;

    if (!eventId || !type || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!['Suggestion', 'Complaint'].includes(type)) {
      return res.status(400).json({ message: 'Invalid feedback type.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const feedback = new Feedback({
      student: studentId,
      event: eventId,
      club: event.club,
      type,
      message
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

// Get Feedback for a specific event
export const getEventFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Optional: add a check to verify if the requester is the ClubAdmin of the club that hosts the event.
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    
    // We already verify that the user is a ClubAdmin in the authMiddleware roleCheck
    // But we should verify they own this club.
    const club = await Club.findById(event.club);
    if (!club) {
      return res.status(404).json({ message: 'Club not found for this event.' });
    }

    if (club.createdBy.toString() !== req.user.id && req.user.role !== 'SystemAdmin') {
      return res.status(403).json({ message: 'You do not have permission to view this feedback.' });
    }

    const feedbacks = await Feedback.find({ event: eventId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Failed to find feedback.' });
  }
};
