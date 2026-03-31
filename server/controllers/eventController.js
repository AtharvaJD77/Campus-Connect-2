import Event from '../models/Event.js';
import Club from '../models/Club.js';
import Registration from '../models/Registration.js';


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
      participantLimit,
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
      participantLimit,
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
    event.registrationLink = req.body.registrationLink || event.registrationLink;
    event.participantLimit = req.body.participantLimit || event.participantLimit;

    const updatedEvent = await event.save();

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