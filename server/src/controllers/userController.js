const User = require("../models/User");
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      about,
      jobTitle,
      skills,
      experience,
      education,
      resume,
      bio,
      projects,
      certifications,
      languages,
      achievements,
      companyName,
      companyWebsite,
      companyIndustry,
      companySize,
      companyFounded,
      companyDescription,
      companySocial,
      settings,
    } = req.body;

    const updateFields = {
      name,
      phone,
      location,
      about,
      jobTitle,
      skills,
      experience,
      education,
      resume,
      bio,
      projects,
      certifications,
      languages,
      achievements,
    };

    if (companyName !== undefined) updateFields.companyName = companyName;
    if (companyWebsite !== undefined) updateFields.companyWebsite = companyWebsite;
    if (companyIndustry !== undefined) updateFields.companyIndustry = companyIndustry;
    if (companySize !== undefined) updateFields.companySize = companySize;
    if (companyFounded !== undefined) updateFields.companyFounded = companyFounded;
    if (companyDescription !== undefined) updateFields.companyDescription = companyDescription;
    if (companySocial !== undefined) updateFields.companySocial = companySocial;
    if (settings !== undefined) updateFields.settings = settings;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs").select("savedJobs");
    res.json(user?.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: job._id } });
    res.status(201).json({ message: "Job saved successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSavedJob = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: req.params.jobId } });
    res.json({ message: "Job removed from saved jobs" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getSavedJobs,
  saveJob,
  removeSavedJob,
};