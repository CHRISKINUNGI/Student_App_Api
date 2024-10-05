const express = require("express");
const router = express.Router();

// Mock database
const students = [];

// Render admin dashboard
router.get("/dashboard", (req, res) => {
  const data = {
    pending_count: 10,
    completed_count: 20,
    today_assignments: 5,
    payments_sum: 1500.0,
    assignment_count: 15,
    title: "Registration Page",
  };
  res.render("admin/dashboard", data);
});

// Approve a student
router.post("/approve/:username", (req, res) => {
  const student = students.find((s) => s.username === req.params.username);
  if (student) {
    student.approved = true;
  }
  res.redirect("/admin");
});

module.exports = router;
