import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'SystemAdmin' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const clubAdminOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ClubAdmin' || req.user.role === 'SystemAdmin' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a club administrator' });
  }
};

export const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized, required role: ${roles.join(' or ')}` });
    }
  };
};
