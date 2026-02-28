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
const { GoogleGenerativeAI } = require("@google/generative-ai");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const User = require("./models/User");
const Internship = require("./models/Internship");
const Job = require("./models/Job");
const Application = require("./models/Application");

const auth = require("./middleware/auth");
const admin = require("./middleware/admin");

const app = express();
app.use(cors());
app.use(express.json());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internship & Job Portal API",
      version: "1.0.0",
      description: "Complete API documentation for Internship & Job Portal Backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =========================
   GEMINI KEY CHECK
========================= */
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

console.log(
  "GEMINI KEY:",
  process.env.GEMINI_API_KEY?.slice(0, 10)
);

/* =========================
   GEMINI INIT
========================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

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
/**
 * @swagger
 * /api/internships:
 *   get:
 *     summary: Get all internships
 *     tags: [Internships]
 *     responses:
 *       200:
 *         description: List of internships
 */
app.get("/api/internships", async (req, res) => {
  const data = await Internship.find();
  res.json(data);
});
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 */

app.get("/api/jobs", async (req, res) => {
  const data = await Job.find();
  res.json(data);
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Prasad
 *               email:
 *                 type: string
 *                 example: prasad@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */

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
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
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
/**
 * @swagger
 * /api/google-login:
 *   post:
 *     summary: Login using Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google login successful
 */

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
/**
 * @swagger
 * /api/internships:
 *   post:
 *     summary: Create new internship (Admin only)
 *     tags: [Internships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Internship created
 */
/* =========================
   ADMIN CREATE
========================= */
app.post("/api/internships", auth, admin, async (req, res) => {
  const data = new Internship(req.body);
  await data.save();
  res.status(201).json(data);
});
/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create new job (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Job created
 */

app.post("/api/jobs", auth, admin, async (req, res) => {
  const data = new Job(req.body);
  await data.save();
  res.status(201).json(data);
});
/**
 * @swagger
 * /api/apply/{internshipId}:
 *   post:
 *     summary: Apply for internship
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Applied successfully
 */
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
/**
 * @swagger
 * /api/apply-job/{jobId}:
 *   post:
 *     summary: Apply for job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Job applied successfully
 */

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
/**
 * @swagger
 * /api/analyze-resume:
 *   post:
 *     summary: Analyze resume using AI (Gemini)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume analyzed successfully
 */
/* =========================
   RESUME ANALYZER (GEMINI)
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
You are a professional ATS resume parser.

Carefully extract information from the resume below.

Return ONLY valid JSON in this exact format:

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
  "education": [],
  "workExperience": [],
  "technicalSkills": [],
  "softSkills": [],
  "toolsAndTechnologies": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "strengths": [],
  "weaknesses": [],
  "improvementSuggestions": [],
  "atsScore": 0
}

Rules:
- Extract real data only.
- Do NOT invent anything.
- If missing, use "" or [].
- ATS score must be between 0 and 100.
- Return PURE JSON only.
- No markdown.
- No explanation.

Resume:
${resumeText}
`;

const result = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
  temperature: 0.2,
},
  },
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
);

let responseText =
  result.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

responseText = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

// 🔍 Debug once (you can remove later)
console.log("AI RAW RESPONSE:\n", responseText);

let parsed;

try {
  // First attempt: direct parse
  parsed = JSON.parse(responseText);
} catch (err) {
  console.log("⚠ Direct JSON parse failed. Attempting safe extraction...");

  const firstBrace = responseText.indexOf("{");
  const lastBrace = responseText.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    const possibleJson = responseText.substring(firstBrace, lastBrace + 1);

    try {
      parsed = JSON.parse(possibleJson);
    } catch (innerErr) {
      console.log("❌ JSON extraction failed:", innerErr.message);
      return res.status(500).json({
        message: "Invalid AI JSON format",
        rawOutput: responseText
      });
    }
  } else {
    return res.status(500).json({
      message: "No JSON found in AI response",
      rawOutput: responseText
    });
  }
}

res.json(parsed);
    } catch (error) {
      console.log(
        "❌ GEMINI ERROR:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "AI analysis failed" });
    }
  }
);
/**
 * @swagger
 * /api/my-applications:
 *   get:
 *     summary: Get logged-in user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user applications
 */
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
/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all applications
 */
app.get("/api/applications", auth, admin, async (req, res) => {
  const data = await Application.find()
    .populate("user", "name email")
    .populate("internship", "title company")
    .populate("job", "title company");

  res.json(data);
});
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
app.get("/api/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});
app.put("/api/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    Object.assign(user, req.body);

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});
/**
 * @swagger
 * /api/profile/auto-fill:
 *   post:
 *     summary: Auto-fill profile from resume using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile auto-filled successfully
 */
app.post(
  "/api/profile/auto-fill",
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
Extract structured profile information from this resume.

Return ONLY valid JSON:

{
  "name": "",
  "phone": "",
  "location": "",
  "skills": [],
  "education": [
    {
      "degree": "",
      "college": "",
      "startYear": "",
      "endYear": ""
    }
  ],
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ]
}

Rules:
- No explanation.
- No markdown.
- No extra text.
- If data missing use "" or [].

Resume:
${resumeText}
`;

      const result = await geminiModel.generateContent(prompt);
      let text = result.response.text();

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(text);

      res.json(parsed);

    } catch (err) {
      res.status(500).json({ message: "Resume auto-fill failed" });
    }
  }
);
app.post("/api/profile/photo", auth, upload.single("photo"), async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.profilePhoto = req.file.path;
  await user.save();
  res.json({ photo: req.file.path });
});

app.post("/api/profile/video", auth, upload.single("video"), async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.introVideo = req.file.path;
  await user.save();
  res.json({ video: req.file.path });
});
/* =========================
   SERVER START
========================= */
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port", process.env.PORT || 5000);
});