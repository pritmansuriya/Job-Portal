const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },

    // Jobseeker Profile
    jobTitle: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    projects: {
      type: String,
      default: "",
    },

    certifications: {
      type: String,
      default: "",
    },

    languages: {
      type: String,
      default: "",
    },

    achievements: {
      type: String,
      default: "",
    },

    projects: {
      type: String,
      default: "",
    },

    certifications: {
      type: String,
      default: "",
    },

    languages: {
      type: String,
      default: "",
    },

    achievements: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
    // Employer / Company Profile
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companyIndustry: { type: String, default: "" },
    companySize: { type: String, default: "" },
    companyFounded: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companySocial: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    settings: {
      emailAlerts: { type: Boolean, default: true },
      candidateStatusAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      defaultJobType: { type: String, default: "Full Time" },
      defaultWorkMode: { type: String, default: "Hybrid" },
      autoNotifyShortlist: { type: Boolean, default: true },
    },

    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);