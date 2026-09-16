const User = require("../models/User");
const Job = require("../models/Job");

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
      achievements
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
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
          achievements
        },
        {
          new: true
        }
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1
      });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
  getUsers,
  getSavedJobs,
  saveJob,
  removeSavedJob
};