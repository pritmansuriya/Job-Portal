const Application = require("../models/Applications");
const Job = require("../models/Job");

const applyJob = async (req, res) => {
  try {
    const {
      jobId,
      resume,
      coverLetter
    } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: req.user._id
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied for this job"
      });
    }

    const application =
      await Application.create({
        job: jobId,
        applicant: req.user._id,
        resume,
        coverLetter
      });

    res.status(201).json({
      message: "Application submitted",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id
      })
        .populate(
          "job",
          "title company location salary"
        )
        .sort({
          createdAt: -1
        });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getEmployerApplications =
  async (req, res) => {
    try {
      const jobs = await Job.find({
        createdBy: req.user._id
      }).select("_id");

      const jobIds = jobs.map(
        (job) => job._id
      );

      const applications =
        await Application.find({
          job: {
            $in: jobIds
          }
        })
          .populate(
            "job",
            "title company"
          )
          .populate(
            "applicant",
            "name email"
          )
          .sort({
            createdAt: -1
          });

      res.json(applications);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

const updateApplicationStatus =
  async (req, res) => {
    try {
      const {
        status
      } = req.body;

      const application =
        await Application.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          message: "Application not found"
        });
      }

      application.status = status;

      await application.save();

      res.json({
        message: "Application status updated",
        application
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

module.exports = {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
};