const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin'); // Admin routes
const applicationRoutes = require('./routes/application'); // Application routes

// Load environment variables from .env file
dotenv.config(); // This must be called before accessing any env variables

// Import the routes
const authRoutes = require('./routes/auth'); // Auth routes
const visaApplicationRoutes = require('./routes/visaApplication'); // Visa application routes
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/visa', visaApplicationRoutes); // Visa application routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/application', applicationRoutes); // Application routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
