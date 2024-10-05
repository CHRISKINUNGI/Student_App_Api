const express = require("express");
const { login, registerUser } = require("../controllers/authController");
const { protect, roleAuth } = require("../middlewares/auth");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", login);

// Render login page
router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login Page",
  });
});

//Render forgot password
router.get("/login", (req, res) => {
  res.render("auth/forgot-password", {
    title: "Login Page",
  });
});

// Render registration page
router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Registration Page",
  });
});

// Handle logout (just redirect to index for now)
router.get("/logout", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
