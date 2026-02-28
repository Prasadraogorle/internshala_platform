const mongoose = require("mongoose");

/* =========================
   EDUCATION SCHEMA
========================= */
const educationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  college: { type: String, default: "" },
  startYear: { type: String, default: "" },
  endYear: { type: String, default: "" },
});

/* =========================
   EXPERIENCE SCHEMA
========================= */
const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, default: "" },
  company: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" },
});

/* =========================
   PROJECT SCHEMA
========================= */
const projectSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  technologies: [{ type: String }],
});

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
  {
    // Existing fields (NOT removed)
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // New Profile Fields
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    skills: [{ type: String }],

    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],

    resume: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);