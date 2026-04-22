import Club from '../models/Club.js';
import Event from '../models/Event.js';
// Create a new club profile (requires ClubAdmin role)
export const createClub = async (req, res) => {
  try {
    const { name, description, logo, college, contactEmail } = req.body;

    // One club per user
    const userAlreadyHasClub = await Club.findOne({ createdBy: req.user._id });
    if (userAlreadyHasClub) {
      return res.status(400).json({ message: 'You have already created a club. Each organizer can only manage one club.' });
    }

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ message: 'A club with this name already exists' });
    }

    const club = await Club.create({
      name,
      description,
      logo,
      college,
      contactEmail,
      createdBy: req.user._id,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all verified clubs (public/students)
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isVerified: true }).populate('createdBy', 'name email');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all clubs including unverified (SystemAdmin only)
export const getAllClubsAdmin = async (req, res) => {
  try {
    const clubs = await Club.find({}).populate('createdBy', 'name email');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single club by ID
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('createdBy', 'name email');

    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify club (SystemAdmin only)
export const verifyClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      club.isVerified = true;
      const updatedClub = await club.save();
      
      // Auto-approve all pending events for this club
      await Event.updateMany(
        { club: club._id, status: 'pending' },
        { $set: { status: 'approved' } }
      );

      res.json(updatedClub);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update club (ClubAdmin - only their own club, or SystemAdmin)
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      // Check if user is the creator or a system admin
      if (club.createdBy.toString() !== req.user._id.toString() && !['SystemAdmin', 'Admin'].includes(req.user.role)) {
        return res.status(401).json({ message: 'Not authorized to update this club' });
      }

      club.name = req.body.name || club.name;
      club.description = req.body.description || club.description;
      club.logo = req.body.logo || club.logo;
      club.college = req.body.college || club.college;
      club.contactEmail = req.body.contactEmail || club.contactEmail;
      
      if (req.body.images !== undefined) club.images = req.body.images;
      if (req.body.videos !== undefined) club.videos = req.body.videos;

      const updatedClub = await club.save();
      res.json(updatedClub);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
