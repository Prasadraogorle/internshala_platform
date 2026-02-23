const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    resume: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["applied", "reviewed", "accepted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// ✅ Ensure either internship OR job exists
applicationSchema.pre("save", function (next) {
  if (!this.internship && !this.job) {
    return next(new Error("Application must have internship or job"));
  }
  next();
});

module.exports = mongoose.model("Application", applicationSchema);
