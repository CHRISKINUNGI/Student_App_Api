const express = require("express");
const router = express.Router();

// Mock database
const students = [];

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login logic
router.post("/login", (req, res) => {
  const student = students.find((s) => s.username === req.body.username);
  if (student && student.password === req.body.password) {
    req.session.user = student; // Save user to session
    return res.redirect("/dashboard"); // Redirect to dashboard on successful login
  }
  res.redirect("/login"); // Redirect to login if authentication fails
});

// Render registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration
router.post("/register", (req, res) => {
  const newStudent = {
    username: req.body.username,
    password: req.body.password,
    role: "student", // Assign student role
    documents: [],
    approved: false,
  };
  students.push(newStudent);
  res.redirect("/login"); // Redirect to login after registration
});

// Render student dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Render document upload page
router.get("/upload", (req, res) => {
  res.render("upload");
});

// Handle document upload
router.post("/upload", (req, res) => {
  // Here, you would handle the file upload
  const document = req.body.document; // Mock document upload
  req.session.user.documents.push(document); // Add document to the user's record
  res.redirect("/dashboard"); // Redirect to dashboard
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.redirect("/login");
  });
});

module.exports = router;
