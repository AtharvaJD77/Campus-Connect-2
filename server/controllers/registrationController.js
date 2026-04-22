import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import { sendEmail } from '../utils/sendEmail.js';

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user._id;
    const { registrationType, teamName, teamMembers, fullName, email, phoneNumber, rollNumber, department, yearOfStudy, paymentProof } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check participant limit
    const registrationCount = await Registration.countDocuments({ event: eventId, status: { $ne: 'cancelled' } });
    if (event.participantLimit && registrationCount >= event.participantLimit) {
      return res.status(400).json({ message: 'Registration full' });
    }

    // Check payment proof for paid events
    if (event.isPaid && !paymentProof) {
      return res.status(400).json({ message: 'Payment proof is required for paid events' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ student: studentId, event: eventId });
    if (existingRegistration) {
      if (existingRegistration.status === 'cancelled') {
        existingRegistration.status = 'registered';
        await existingRegistration.save();
        return res.status(200).json({ message: 'Registration reactivated' });
      }
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    await Registration.create({
      student: studentId,
      event: eventId,
      registrationType,
      teamName,
      teamMembers: registrationType === 'Group' ? teamMembers : [],
      fullName,
      email,
      phoneNumber,
      rollNumber,
      department,
      yearOfStudy,
      paymentProof
    });

    // Send Confirmation Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Registration Confirmed! 🎉</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hi <strong>${req.user.name}</strong>,</p>
          <p>You have successfully registered for the event: <strong style="color: #2563eb;">${event.title}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Event Details</h3>
            <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p style="margin: 5px 0;">⏰ <strong>Time:</strong> ${event.time}</p>
            <p style="margin: 5px 0;">📍 <strong>Venue:</strong> ${event.venue}</p>
          </div>
          
          <p>We look forward to seeing you there!</p>
          <br/>
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            This is an automated message from Campus Connect.
          </p>
        </div>
      </div>
    `;

    // Fire and forget email to not block the response
    sendEmail({
      to: req.user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: emailHtml
    });

    res.status(201).json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user._id;

    const registration = await Registration.findOne({ student: studentId, event: eventId });
    if (!registration) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a student's registered events (Excluding explicitly rejected/cancelled)
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      student: req.user._id, 
      status: { $in: ['registered', 'Pending', 'Approved', 'attended'] } 
    }).populate({
      path: 'event',
      populate: { path: 'club', select: 'name logo' }
    });
    res.json(registrations.map(r => r.event));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a student's registration status for a specific event
export const getMyRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      student: req.user._id,
      event: req.params.id
    });
    if (!registration) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }
    res.json({ status: registration.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations for an event (ClubAdmin only)
export const getEventRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const club = await Club.findById(event.club);
    
    if (club.createdBy.toString() !== req.user._id.toString() && !['SystemAdmin', 'Admin'].includes(req.user.role)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ 
      event: eventId, 
      status: { $in: ['registered', 'Pending', 'Approved', 'Rejected', 'attended'] } 
    }).populate('student', 'name email');
    
    res.json(registrations.map(r => {
      const studentData = r.student ? r.student.toObject() : { name: 'Unknown', email: 'N/A' };
      return {
        ...studentData,
        _id: r._id, // Send the registration ID itself out for updates
        registrationDetails: {
          registrationType: r.registrationType,
          teamName: r.teamName,
          teamMembers: r.teamMembers,
          fullName: r.fullName,
          email: r.email,
          phoneNumber: r.phoneNumber,
          rollNumber: r.rollNumber,
          department: r.department,
          yearOfStudy: r.yearOfStudy,
          paymentProof: r.paymentProof,
          status: r.status,
          registeredAt: r.createdAt
        }
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Registration Status (Approve/Reject)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const { status } = req.body; 

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await Registration.findById(registrationId).populate('event');
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    // Auth Check
    const club = await Club.findById(registration.event.club);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (club.createdBy.toString() !== req.user._id.toString() && !['SystemAdmin', 'Admin'].includes(req.user.role)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    registration.status = status;
    await registration.save();
    
    res.json({ message: `Registration ${status}`, registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
