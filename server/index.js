require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");
const axios = require("axios");

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
   OPENROUTER KEY CHECK
========================= */
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing");
}

console.log(
  "OPENROUTER KEY:",
  process.env.OPENROUTER_API_KEY?.slice(0, 10)
);

/* =========================
   UPLOAD SETUP
========================= */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});

/* =========================
   MONGODB CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.log("❌ MongoDB Not Connected:", err.message)
  );

/* =========================
   FETCH DATA
========================= */
app.get("/api/internships", async (req, res) => {
  const data = await Internship.find();
  res.json(data);
});

app.get("/api/jobs", async (req, res) => {
  const data = await Job.find();
  res.json(data);
});

/* =========================
   AUTH REGISTER
========================= */
app.post("/api/register", async (req, res) => {
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
});

/* =========================
   AUTH LOGIN
========================= */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* =========================
   GOOGLE LOGIN
========================= */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Credential missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: "", role: "user" });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token: jwtToken });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   ADMIN CREATE
========================= */
app.post("/api/internships", auth, admin, async (req, res) => {
  const data = new Internship(req.body);
  await data.save();
  res.status(201).json(data);
});

app.post("/api/jobs", auth, admin, async (req, res) => {
  const data = new Job(req.body);
  await data.save();
  res.status(201).json(data);
});

/* =========================
   APPLY INTERNSHIP
========================= */
app.post(
  "/api/apply/:internshipId",
  auth,
  upload.single("resume"),
  async (req, res) => {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admin cannot apply" });

    if (!req.file)
      return res.status(400).json({ message: "Resume required" });

    const exists = await Application.findOne({
      user: req.user.userId,
      internship: req.params.internshipId,
    });

    if (exists)
      return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: req.user.userId,
      internship: req.params.internshipId,
      resume: req.file.path,
    });

    await application.save();
    res.json({ message: "Applied successfully" });
  }
);

/* =========================
   APPLY JOB
========================= */
app.post(
  "/api/apply-job/:jobId",
  auth,
  upload.single("resume"),
  async (req, res) => {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admin cannot apply" });

    if (!req.file)
      return res.status(400).json({ message: "Resume required" });

    const exists = await Application.findOne({
      user: req.user.userId,
      job: req.params.jobId,
    });

    if (exists)
      return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: req.user.userId,
      job: req.params.jobId,
      resume: req.file.path,
    });

    await application.save();
    res.json({ message: "Job applied successfully" });
  }
);

/* =========================
   RESUME ANALYZER (OPENROUTER)
========================= */
app.post(
  "/api/analyze-resume",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Resume required" });
      }

      const fileBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(fileBuffer);
      let resumeText = pdfData.text.slice(0, 6000);

      const prompt = `
You are a senior HR manager and ATS (Applicant Tracking System) expert.

Carefully analyze the following resume and extract ALL relevant information in detail.

Return ONLY valid JSON in this exact structure:

{
  "fullName": "",
  "contactInformation": {
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": ""
  },
  "professionalSummary": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "percentageOrCGPA": ""
    }
  ],
  "workExperience": [
    {
      "jobTitle": "",
      "company": "",
      "duration": "",
      "keyResponsibilities": []
    }
  ],
  "technicalSkills": [],
  "softSkills": [],
  "toolsAndTechnologies": [],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologiesUsed": []
    }
  ],
  "certifications": [],
  "achievements": [],
  "strengths": [],
  "weaknesses": [],
  "improvementSuggestions": [],
  "atsScore": 0
}

STRICT RULES:
- Extract real data only from the resume.
- Do NOT invent information.
- If data is missing, return empty string "" or empty array [].
- ATS score must be between 0 and 100.
- Do NOT include markdown.
- Do NOT include explanations.
- Return ONLY pure JSON.

Resume:
${resumeText}
`;

      const result = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      let responseText =
        result.data.choices[0].message.content;

      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return res.status(500).json({ message: "Invalid AI response format" });
      }

      const parsed = JSON.parse(jsonMatch[0]);

      res.json(parsed);

    } catch (error) {
      console.log(
        "❌ OPENROUTER ERROR:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "AI analysis failed" });
    }
  }
);
/* =========================
   VIEW APPLICATIONS
========================= */
app.get("/api/my-applications", auth, async (req, res) => {
  const data = await Application.find({
    user: req.user.userId,
  })
    .populate("internship", "title company")
    .populate("job", "title company");

  res.json(data);
});

app.get("/api/applications", auth, admin, async (req, res) => {
  const data = await Application.find()
    .populate("user", "name email")
    .populate("internship", "title company")
    .populate("job", "title company");

  res.json(data);
});

/* =========================
   SERVER START
========================= */
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port", process.env.PORT || 5000);
});