const User = require("../models/User");

// ========================================
// Get My Profile
// ========================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// Update My Profile
// ========================================
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
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
      phone,
      location,
      // Company fields
      companyName,
      companyWebsite,
      companyIndustry,
      companySize,
      companyFounded,
      companyDescription,
      companySocial,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.jobTitle = jobTitle ?? user.jobTitle;
    user.skills = skills ?? user.skills;
    user.experience = experience ?? user.experience;
    user.education = education ?? user.education;
    user.resume = resume ?? user.resume;
    user.bio = bio ?? user.bio;
    user.projects = projects ?? user.projects;
    user.certifications = certifications ?? user.certifications;
    user.languages = languages ?? user.languages;
    user.achievements = achievements ?? user.achievements;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    // Company fields
    user.companyName = companyName ?? user.companyName;
    user.companyWebsite = companyWebsite ?? user.companyWebsite;
    user.companyIndustry = companyIndustry ?? user.companyIndustry;
    user.companySize = companySize ?? user.companySize;
    user.companyFounded = companyFounded ?? user.companyFounded;
    user.companyDescription = companyDescription ?? user.companyDescription;
    if (companySocial) {
      user.companySocial = {
        linkedin: companySocial.linkedin ?? user.companySocial?.linkedin ?? "",
        twitter: companySocial.twitter ?? user.companySocial?.twitter ?? "",
      };
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};