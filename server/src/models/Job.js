const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    company: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    salary: {
      type: String,
      required: true
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Remote",
        "Contract"
      ],
      default: "Full Time"
    },

    experience: {
      type: String,
      default: "Fresher"
    },

    skills: {
      type: [String],
      default: []
    },

    deadline: {
      type: Date
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);