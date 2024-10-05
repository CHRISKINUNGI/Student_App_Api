const express = require("express");
const router = express.Router();

// Render student dashboard
router.get("/dashboard", (req, res) => {
  res.render("student/dashboard", {
    pending_count: 10,
    completed_count: 20,
    today_assignments: 5,
    payments_sum: 1500.0,
    assignment_count: 15,
    title: "Dashboard",
  });
});

// Render document upload page
router.get("/upload", (req, res) => {
  res.render("upload");
});

// Handle document upload
router.post("/upload", (req, res) => {
  // Here, you would handle the file upload
  const document = req.body.document;
  req.session.user.documents.push(document);
  res.redirect("/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
  return res.redirect("/");
});

module.exports = router;
