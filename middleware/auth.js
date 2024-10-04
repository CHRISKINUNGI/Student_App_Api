const jwt = require('jsonwebtoken');

// Protect middleware to ensure the user is authenticated
const protect = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Extract the token from the Authorization header
    token = token.split(' ')[1];

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info (id and role) to the request object
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control middleware
const roleAuth = (role) => {
  return (req, res, next) => {
    // Check if the user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} role required` });
    }
    next();
  };
};

module.exports = { protect, roleAuth };
