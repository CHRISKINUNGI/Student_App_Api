const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const User = require("../models/User");
const VisaApplication = require("../models/VisaApplication");
const upload = require("../middlewares/multer");

// Render admin dashboard
router.get("/dashboard", async (req, res) => {
  // Get visa applications from the database
  const visas = await VisaApplication.find();

  // Filter for pending and completed visa applications
  const pendingVisaApplications = visas.filter((e) => e.status === "pending");
  const completedVisaApplications = visas.filter(
    (e) => e.status === "completed"
  );

  // Get today's date
  const today = new Date().toISOString().split("T")[0];
  const todayVisaApplications = visas.filter((e) => e.dueDate === today);

  const data = {
    pending_count: pendingVisaApplications.length,
    completed_count: completedVisaApplications.length,
    today_due: todayVisaApplications.length,
    payments_sum: 1500.0,
    total_visa_applications: visas.length,
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

router.get("/view-applications", async (req, res) => {
  try {
    const applications = await VisaApplication.find().sort({ createdAt: -1 }); // 1 for ascending order

    res.render("admin/view-applications", {
      applications,
      title: "View Applications",
    });
  } catch (err) {
    console.error("Error fetching visas:", err);
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

// Route to view add visa application form
router.get("/add-application", async (req, res) => {
  const users = await User.find({ role: "user" });
  res.render("admin/add-application", {
    application: null,
    users: users,
    title: "Add Visa Application",
  });
});

// Route to view edit visa application form
router.get("/edit-application/:id", async (req, res) => {
  try {
    const application = await VisaApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).send("Visa application not found");
    }
    res.render("admin/add-application", {
      application,
      title: "Edit Visa Application",
    });
  } catch (err) {
    console.error("Error fetching visa application:", err);
    res.status(500).send("Server Error");
  }
});

// Route to add a new visa application
router.post(
  "/add-application",
  upload.fields([
    { name: "passportDocument", maxCount: 1 },
    { name: "financialProof", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, dateOfBirth, nationality, passportNumber, user } = req.body;
    console.log(req.files);
    const passportDocument = req.files["passportDocument"]
      ? req.files["passportDocument"][0].path
      : null; // Get file path
    const financialProof = req.files["financialProof"]
      ? req.files["financialProof"][0].path
      : null; // Get file path

    const applicationUser = await User.findById(user);

    try {
      const newApplication = new VisaApplication({
        user: applicationUser,
        name,
        dateOfBirth,
        nationality,
        passportNumber,
        passportDocument,
        financialProof,
      });
      await newApplication.save();
      res.redirect("/admin/view-applications");
    } catch (err) {
      res.status(500).send("Server Error: " + err);
    }
  }
);

// Route to update existing visa application
router.post(
  "/edit-application/:id",
  upload.fields([
    { name: "passportDocument", maxCount: 1 },
    { name: "financialProof", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, dateOfBirth, nationality, passportNumber } = req.body;

    const obj = {
      name,
      dateOfBirth,
      nationality,
      passportNumber,
    };

    // Handle file uploads if provided
    if (req.files && req.files["passportDocument"]) {
      obj.passportDocument = req.files["passportDocument"][0].path;
    }
    if (req.files && req.files["financialProof"]) {
      obj.financialProof = req.files["financialProof"][0].path;
    }

    try {
      const application = await VisaApplication.findByIdAndUpdate(
        req.params.id,
        obj,
        { new: true }
      ); // Return the updated document
      if (!application) {
        return res.status(404).send("Visa application not found");
      }
      res.redirect("/admin/view-applications");
    } catch (err) {
      res.status(500).send("Server Error: " + err);
    }
  }
);

// Route to view edit admin form
router.get("/delete-application/:id", async (req, res) => {
  try {
    const user = await VisaApplication.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect("/admin/view-applications");
  }
});

module.exports = router;
