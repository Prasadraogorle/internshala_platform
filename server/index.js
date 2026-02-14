require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("./models/User");
const Internship = require("./models/Internship");
const Job = require("./models/Job");
const Application = require("./models/Application");

const auth = require("./middleware/auth");
const admin = require("./middleware/admin");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.log("❌ MongoDB Not Connected:", err.message)
  );

/* =========================
   PUBLIC ROUTES
========================= */

// ===== Internships =====
app.get("/api/internships", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch {
    res.status(500).json({ message: "Failed to fetch internships" });
  }
});

app.get("/api/internships/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    res.json(internship);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// ===== Jobs =====
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/* =========================
   AUTH ROUTES
========================= */

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user",
    });

    await user.save();
    res.json({ message: "User registered successfully" });

  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.password)
      return res.status(400).json({
        message: "Please login using Google",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

/* =========================
   GOOGLE LOGIN
========================= */

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    const isAdmin =
      email.trim().toLowerCase() ===
      process.env.ADMIN_EMAIL.trim().toLowerCase();

    const role = isAdmin ? "admin" : "user";

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "",
        role,
      });
    } else {
      user.role = role;
    }

    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token: jwtToken });

  } catch {
    res.status(400).json({ message: "Google login failed" });
  }
});

/* =========================
   ADMIN ROUTES
========================= */

// Internship CRUD
app.post("/api/internships", auth, admin, async (req, res) => {
  try {
    const internship = new Internship(req.body);
    const saved = await internship.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ message: "Failed to create internship" });
  }
});

app.put("/api/internships/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Internship not found" });

    res.json(updated);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.delete("/api/internships/:id", auth, admin, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// Job CRUD
app.post("/api/jobs", auth, admin, async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ message: "Failed to create job" });
  }
});

app.put("/api/jobs/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Job not found" });

    res.json(updated);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.delete("/api/jobs/:id", auth, admin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});
app.get("/api/my-applications", auth, async (req, res) => {
  const applications = await Application.find({
    user: req.user.userId,
  })
    .populate("internship", "title company")
    .populate("job", "title company");

  res.json(applications);
});

/* =========================
   APPLICATION ROUTES
========================= */

// Internship Apply
app.post("/api/apply/:internshipId", auth, async (req, res) => {
  try {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admin cannot apply" });

    const exists = await Application.findOne({
      user: req.user.userId,
      internship: req.params.internshipId,
    });

    if (exists)
      return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: req.user.userId,
      internship: req.params.internshipId,
    });

    await application.save();
    res.json({ message: "Application submitted successfully" });

  } catch {
    res.status(500).json({ message: "Application failed" });
  }
});

// Job Apply
app.post("/api/apply-job/:jobId", auth, async (req, res) => {
  try {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admin cannot apply" });

    const exists = await Application.findOne({
      user: req.user.userId,
      job: req.params.jobId,
    });

    if (exists)
      return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: req.user.userId,
      job: req.params.jobId,
    });

    await application.save();
    res.json({ message: "Job application submitted" });

  } catch {
    res.status(500).json({ message: "Application failed" });
  }
});

// Admin view all
app.get("/api/applications", auth, admin, async (req, res) => {
  const applications = await Application.find()
    .populate("user", "name email")
    .populate("internship", "title company")
    .populate("job", "title company");

  res.json(applications);
});

/* =========================
   SERVER START
========================= */

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port", process.env.PORT || 5000);
});
