const Job = require("../models/Job");
const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/notification");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      deadline
    } = req.body;

    const jobData = {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      deadline
    };

    if (req.user?._id) {
      jobData.createdBy = req.user._id;
    }

    const job = await Job.create(jobData);

    try {
      const jobseekers = await User.find({
        role: "jobseeker"
      }).select("_id");

      if (jobseekers.length > 0) {
        await Notification.insertMany(
          jobseekers.map((user) => ({
            recipient: user._id,
            type: "new_job",
            title: "New job posted",
            message: `${job.title} is now available at ${job.company}.`,
            job: job._id
          }))
        );
      }
    } catch (notificationError) {
      console.error(
        "Job created, but notification creation failed:",
        notificationError.message
      );
    }

    res.status(201).json({
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          company: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter)
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID. Use the MongoDB job _id."
      });
    }

    const job = await Job.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID. Use the MongoDB job _id."
      });
    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID. Use the MongoDB job _id."
      });
    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};