import Event from '../models/Event.js';
import Club from '../models/Club.js';
import Registration from '../models/Registration.js';
import { sendEmail } from '../utils/sendEmail.js';


// ✅ Create Event (ClubAdmin/SystemAdmin)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      poster,
      registrationLink,
      externalLink,
      isPaid,
      registrationFee,
      participantLimit,
      short_videos,
      clubId
    } = req.body;

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Authorization
    if (
      club.createdBy.toString() !== req.user._id.toString() &&
      !['SystemAdmin', 'Admin'].includes(req.user.role)
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // ✅ Create event with status
    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      poster,
      registrationLink,
      externalLink,
      isPaid,
      registrationFee,
      participantLimit,
      short_videos: short_videos || [],
      club: clubId,
      status: club.isVerified ? 'approved' : 'pending' // 🔥 Auto-approve if club is verified
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Events (role-based)
export const getEvents = async (req, res) => {
  try {
    const role = req.user?.role;

    let events;

    if (role === 'SystemAdmin' || role === 'Admin') {
      // Admin sees ALL events
      events = await Event.find()
        .populate('club', 'name logo isVerified')
        .sort({ date: -1 });

    } else if (role === 'ClubAdmin') {
      // ClubAdmin sees their own club events
      const ownedClubs = await Club.find({ createdBy: req.user._id }).select('_id');
      const ownedClubIds = ownedClubs.map(c => c._id);
      
      const eventsQuery = await Event.find({ club: { $in: ownedClubIds } })
        .populate('club', 'name logo isVerified')
        .sort({ date: -1 })
        .lean();
        
      for (let e of eventsQuery) {
        e.registrationCount = await Registration.countDocuments({ event: e._id, status: 'registered' });
      }
      events = eventsQuery;

    } else {
      // Students see only approved events
      events = await Event.find({ status: 'approved' })
        .populate('club', 'name logo isVerified')
        .sort({ date: -1 });
    }

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name logo contactEmail');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Events for a specific club
export const getClubEvents = async (req, res) => {
  try {
    const clubId = req.params.id;
    const role = req.user?.role;
    
    let filter = { club: clubId };
    
    if (role === 'Student') {
      filter.status = 'approved';
    } else if (role === 'ClubAdmin') {
      const club = await Club.findById(clubId);
      if (club && club.createdBy.toString() !== req.user._id.toString()) {
         filter.status = 'approved';
      }
    }

    const events = await Event.find(filter)
      .populate('club', 'name logo isVerified')
      .sort({ date: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const club = await Club.findById(event.club);

    if (
      club.createdBy.toString() !== req.user._id.toString() &&
      !['SystemAdmin', 'Admin'].includes(req.user.role)
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.venue = req.body.venue || event.venue;
    event.poster = req.body.poster || event.poster;
    event.registrationLink = req.body.registrationLink !== undefined ? req.body.registrationLink : event.registrationLink;
    event.externalLink = req.body.externalLink !== undefined ? req.body.externalLink : event.externalLink;
    event.isPaid = req.body.isPaid !== undefined ? req.body.isPaid : event.isPaid;
    event.registrationFee = req.body.registrationFee !== undefined ? req.body.registrationFee : event.registrationFee;
    event.participantLimit = req.body.participantLimit !== undefined ? req.body.participantLimit : event.participantLimit;
    event.short_videos = req.body.short_videos !== undefined ? req.body.short_videos : event.short_videos;

    const updatedEvent = await event.save();

    // Background Notification Workflow
    (async () => {
      try {
        const registrations = await Registration.find({ event: updatedEvent._id });
        const emails = new Set();
        
        registrations.forEach(reg => {
          if (reg.email) emails.add(reg.email);
          if (reg.registrationType === 'Group' && reg.teamMembers) {
            reg.teamMembers.forEach(member => {
              if (member.email) emails.add(member.email);
            });
          }
        });

        const emailList = Array.from(emails);
        if (emailList.length > 0) {
          const formattedDate = new Date(updatedEvent.date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          });

          const subject = `Update: ${updatedEvent.title} Details Changed`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 24px;">🔔 Event Update Notice</h2>
              </div>
              <div style="padding: 20px;">
                <p>Hello,</p>
                <p>The organizers of <strong>${updatedEvent.title}</strong> have just updated the event details. Please review the updated schedule and venue below to ensure you have the correct information.</p>
                
                <div style="background-color: #f3f4f6; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #111827;">Updated Event Details</h3>
                  <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 8px;">📅 <strong>Date:</strong> ${formattedDate}</li>
                    <li style="margin-bottom: 8px;">⏰ <strong>Time:</strong> ${updatedEvent.time}</li>
                    <li style="margin-bottom: 8px;">📍 <strong>Venue:</strong> ${updatedEvent.venue}</li>
                  </ul>
                </div>
                
                <p>If you have any questions, please contact the club administrators. Visit your Campus Connect dashboard to see full details!</p>
                <br />
                <p>Best regards,<br><strong>Campus Connect Team</strong></p>
              </div>
            </div>
          `;

          // Dispatch emails concurrently
          await Promise.all(emailList.map(email => 
            sendEmail({ to: email, subject, html }).catch(err => console.error('Failed sending update to', email, err))
          ));
        }
      } catch (err) {
        console.error('Error in Event Update Email Broadcasting:', err);
      }
    })();

    res.json(updatedEvent);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const club = await Club.findById(event.club);

    if (
      club.createdBy.toString() !== req.user._id.toString() &&
      !['SystemAdmin', 'Admin'].includes(req.user.role)
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();

    res.json({ message: 'Event removed' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Approve Event (ADMIN ONLY)
export const approveEvent = async (req, res) => {
  try {
    if (!['SystemAdmin', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admin can approve' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'approved';

    await event.save();

    res.json({ message: 'Event approved', event });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Toggle Like on Event
export const toggleLike = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user._id;
    const alreadyLiked = event.liked_by.includes(userId);

    if (alreadyLiked) {
      // Unlike
      event.liked_by = event.liked_by.filter(id => id.toString() !== userId.toString());
      event.likes_count = Math.max(0, event.likes_count - 1);
    } else {
      // Like
      event.liked_by.push(userId);
      event.likes_count = event.likes_count + 1;
    }

    await event.save();

    res.json({
      likes_count: event.likes_count,
      liked: !alreadyLiked,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};