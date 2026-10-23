
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Uploaded resume file path
    resumeFile: {
      type: String,
      default: "",
    },

    // Personal Information
    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      summary: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // Education
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
        grade: { type: String, default: "" },
      },
    ],

    // Skills
    skills: {
      type: [String],
      default: [],
    },

    // Work Experience
    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    // Projects
    projects: [
      {
        name: { type: String, default: "" },
        technologies: { type: String, default: "" },
        description: { type: String, default: "" },
        projectLink: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
