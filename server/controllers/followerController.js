import Follower from '../models/Follower.js';
import Club from '../models/Club.js';
import User from '../models/User.js';

// Follow a club
export const followClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const studentId = req.user._id;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if already following
    const existingFollow = await Follower.findOne({ student: studentId, club: clubId });
    if (existingFollow) {
      return res.status(400).json({ message: 'You are already following this club' });
    }

    // Create follower record
    await Follower.create({
      student: studentId,
      club: clubId,
    });

    // Update club follower count
    club.followersCount += 1;
    await club.save();

    // Update user's followedClubs array
    await User.findByIdAndUpdate(studentId, {
      $push: { followedClubs: clubId }
    });

    res.status(201).json({ message: 'Successfully followed club' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow a club
export const unfollowClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const studentId = req.user._id;

    const followRecord = await Follower.findOne({ student: studentId, club: clubId });
    if (!followRecord) {
      return res.status(400).json({ message: 'You are not following this club' });
    }

    // Delete follower record
    await Follower.deleteOne({ _id: followRecord._id });

    // Update club follower count
    const club = await Club.findById(clubId);
    if (club) {
      club.followersCount = Math.max(0, club.followersCount - 1);
      await club.save();
    }

    // Update user's followedClubs array
    await User.findByIdAndUpdate(studentId, {
      $pull: { followedClubs: clubId }
    });

    res.json({ message: 'Successfully unfollowed club' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a student's followed clubs
export const getMyFollowedClubs = async (req, res) => {
  try {
    const follows = await Follower.find({ student: req.user._id }).populate('club');
    res.json(follows.map(f => f.club));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get followers of a specific club (ClubAdmin only)
export const getClubFollowers = async (req, res) => {
  try {
    const clubId = req.params.id;
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (club.createdBy.toString() !== req.user._id.toString() && !['SystemAdmin', 'Admin'].includes(req.user.role)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const followers = await Follower.find({ club: clubId }).populate('student', 'name email');
    res.json(followers.map(f => f.student));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
