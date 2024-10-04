const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware to ensure the user is authenticated
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Extract the token from the Authorization header
    token = token.split(' ')[1];

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach user info (id and role) to the request object
    req.user = await User.findById(decoded.id).select('-password');

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control middleware
const roleAuth = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} role required` });
    }
    next();
  };
};

module.exports = { protect, roleAuth };
