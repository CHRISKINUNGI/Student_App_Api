const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware to ensure the user is authenticated
const protect = async (req, res, next) => {
  let token = req.headers.authorization || req.session.token;

  console.log("token", token);

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

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.redirect("/auth/login");
  }
};

// Role-based access control middleware
const roleAuth = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.redirect(`/${role}/login`);
    }
    next();
  };
};

module.exports = { protect, roleAuth };
