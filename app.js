const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin'); // Admin routes
const applicationRoutes = require('./routes/application'); // Application routes

// Load environment variables from .env file
dotenv.config(); // This must be called before accessing any env variables

// Import the routes
const authRoutes = require("./routes/auth");
const visaApplicationRoutes = require("./routes/visaApplication");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const { protect, roleAuth } = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: { maxAge: 180 * 60 * 1000 }, // 3 hours
  })
);

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to ensure user and notification are always defined
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.request = req;
  res.locals.notification = req.session.notification || null;
  res.locals.errors = req.session.errors || null;
  next();
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/visa", visaApplicationRoutes);
app.use("/auth", authRoutes);
app.use("/admin", protect, roleAuth("admin"), adminRoutes);
app.use("/student", protect, roleAuth("user"), studentRoutes);

// Catch-all route for redirecting
app.use("/", protect, (req, res) => {
  return res.redirect(`/${req.user.role}/dashboard`);
});

app.use((req, res) => {
  return res.render("404");
});
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/application', applicationRoutes); // Application routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
