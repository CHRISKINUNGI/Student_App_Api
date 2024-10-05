const jwt = require("jsonwebtoken");
const User = require("../models/User");

const assignUser = async (req, res, next) => {
  const token = req.headers.authorization || req.session.token;

  if (token) {
    try {
      // Verify the token if it exists
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

      // Find the user and attach user info (id and role) to the request object
      req.user = await User.findById(decoded.id).select("-password");
      res.locals.user = req.user || null;
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

// Protect middleware to ensure the user is authenticated
const protect = async (req, res, next) => {
  let token = req.headers.authorization || req.session.token;

  if (!token || !token.startsWith("Bearer")) {
    return res.redirect("/auth/login");
  }

  try {
    // Extract the token from the Authorization header
    token = token.split(" ")[1];

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach user info (id and role) to the request object
    req.user = await User.findById(decoded.id).select("-password");
    res.locals.user = req.user || null;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.redirect("/auth/login");
  }
};

const redirectIfAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization || req.session.token;

  if (token) {
    try {
      // Verify the token if it exists
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

      // Find the user and attach user info (id and role) to the request object
      req.user = await User.findById(decoded.id).select("-password");
      res.locals.user = req.user || null;

      // If user is found, redirect to the dashboard
      if (req.user) {
        return res.redirect(`/${req.user.role}/dashboard`);
      }
    } catch (error) {
      return res.redirect("/auth/login");
    }
  }
  next();
};

// Role-based access control middleware
const roleAuth = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && redirect) {
      return res.redirect(`/${role}/login`);
    }
    next();
  };
};

module.exports = { protect, roleAuth, redirectIfAuthenticated, assignUser };
