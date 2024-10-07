const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const User = require("../models/User");

// Update document submission status
router.post(
  "/review/documents/:applicationId",
  adminController.updateDocumentStatus
);

// Update document verification status
router.post(
  "/review/verify-documents/:applicationId",
  adminController.updateVerificationStatus
);

// Update payment verification status
router.post(
  "/review/payment/:applicationId",
  adminController.updatePaymentStatus
);

// Update visa processing status
router.post(
  "/review/visa-processing/:applicationId",
  adminController.updateVisaProcessing
);

// Update visa ready status
router.post(
  "/review/visa-ready/:applicationId",
  adminController.updateVisaReady
);

// Set collection date
router.post(
  "/review/collection-date/:applicationId",
  adminController.setCollectionDate
);

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
    title: "Dashboard",
  };
  res.render("admin/dashboard", data);
});

// Route to fetch and view users
router.get("/view-users", async (req, res) => {
  try {
    const users = await User.find();

    res.render("admin/view-users", { users, title: "View Users" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to view add admin form
router.get("/add-user", (req, res) => {
  res.render("admin/add-user", { user: null, title: "Add User" });
});

// Route to view edit admin form
router.get("/edit-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Admin not found");
    }
    res.render("admin/add-user", { user, title: "Edit Admin" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
});

// Route to view edit admin form
router.get("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect("/admin/view-users");
  }
});

// Route to add a new admin
router.post("/add-user", async (req, res) => {
  const { username, email, role, password } = req.body;
  try {
    const newAdmin = new User({ username, email, role, password });
    await newAdmin.save();
    res.redirect("/admin/view-users");
  } catch (err) {
    res.status(500).send("Server Error" + err);
  }
});

// Route to update existing admin
router.post("/edit-user/:id", async (req, res) => {
  const { username, email, role, password } = req.body;
  const obj = {
    username,
    email,
    role,
  };
  if (password && password.length >= 6) {
    obj.password = password;
  }

  try {
    const admin = await User.findByIdAndUpdate(req.params.id, obj);
    res.redirect("/admin/view-users");
  } catch (err) {
    res.status(500).send("Server Error");
  }
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

module.exports = router;
