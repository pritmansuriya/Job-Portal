const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Job = require("../models/Job");

const seedEmployer = async () => {
  try {
    const employerEmail = (process.env.EMPLOYER_EMAIL || "employer@gmail.com").trim().toLowerCase();
    const employerPassword = process.env.EMPLOYER_PASSWORD || "Employer@123";
    const employerName = process.env.EMPLOYER_NAME || "Company Employer";
    const employerCompany = process.env.EMPLOYER_COMPANY || "TechCorp Solutions";

    let employer = await User.findOne({ email: employerEmail });

    const hashedPassword = await bcrypt.hash(employerPassword, 10);

    if (!employer) {
      employer = await User.create({
        name: employerName,
        email: employerEmail,
        password: hashedPassword,
        role: "employer",
        companyName: employerCompany,
      });
      console.log(`[Seed] Designated employer account created: ${employerEmail}`);
    } else {
      employer.role = "employer";
      employer.password = hashedPassword;
      if (!employer.companyName) {
        employer.companyName = employerCompany;
      }
      await employer.save();
      console.log(`[Seed] Designated employer account synced: ${employerEmail}`);
    }

    // Link any unassigned legacy jobs (missing createdBy) to this designated employer
    const updatedJobs = await Job.updateMany(
      {
        $or: [
          { createdBy: null },
          { createdBy: { $exists: false } }
        ]
      },
      {
        $set: { createdBy: employer._id }
      }
    );

    if (updatedJobs.modifiedCount > 0) {
      console.log(`[Seed] Linked ${updatedJobs.modifiedCount} unassigned jobs to employer: ${employerEmail}`);
    }

    return employer;
  } catch (error) {
    console.error("[Seed] Failed to seed/sync designated employer:", error.message);
  }
};

module.exports = seedEmployer;

