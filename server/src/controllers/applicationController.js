const Application = require("../models/Applications");
const Job = require("../models/Job");
const Notification = require("../models/notification");


// ========================================
// Apply for Job
// ========================================
const applyJob = async (req, res) => {
  try {
    const {
      jobId,
      resume,
      coverLetter,
    } = req.body;

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check if already applied
    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied for this job",
      });
    }

    // Create application
    const application =
      await Application.create({
        job: jobId,
        applicant: req.user._id,
        resume,
        coverLetter,
      });


    // ========================================
    // Notify Employer
    // ========================================
    await Notification.create({
      recipient: job.createdBy,

      type: "application_received",

      title: "New Job Application",

      message: `You received a new application for ${job.title}.`,

      job: job._id,

      application: application._id,
    });


    res.status(201).json({
      message: "Application submitted",
      application,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// Get My Applications
// ========================================
const getMyApplications = async (req, res) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id,
      })
        .populate(
          "job",
          "title company location salary"
        )
        .sort({
          createdAt: -1,
        });

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// Get Employer Applications
// ========================================
const getEmployerApplications =
  async (req, res) => {
    try {
      const jobs = await Job.find({
        createdBy: req.user._id,
      }).select("_id");

      const jobIds = jobs.map(
        (job) => job._id
      );

      const applications =
        await Application.find({
          job: {
            $in: jobIds,
          },
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
            createdAt: -1,
          });

      res.json(applications);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


// ========================================
// Update Application Status
// ========================================
const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      // Allowed statuses
      const allowedStatuses = [
        "Pending",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      // Validate status
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      // Find application
      const application =
        await Application.findById(
          req.params.id
        ).populate(
          "job",
          "title company"
        );

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      // Update status
      application.status = status;

      await application.save();


      // ========================================
      // Notify Jobseeker
      // ========================================
      if (
        status === "Selected" ||
        status === "Rejected"
      ) {
        const isAccepted =
          status === "accepted";

        await Notification.create({
          recipient: application.applicant,

          type: isAccepted
            ? "application_accepted"
            : "application_rejected",

          title: isAccepted
            ? "Application Accepted"
            : "Application Rejected",

          message: isAccepted
            ? `Your application for ${application.job.title} has been selected.`
            : `Your application for ${application.job.title} has been rejected.`,

          job: application.job._id,

          application: application._id,
        });
      }


      res.json({
        message: "Application status updated",
        application,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


module.exports = {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
};