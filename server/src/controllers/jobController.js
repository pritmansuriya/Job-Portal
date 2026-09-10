const Job = require("../models/Job");

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

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      deadline,
      createdBy: req.user._id
    });

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
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (
      job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed"
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
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (
      job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed"
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