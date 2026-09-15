const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's profile
router.get("/", protect, getMyProfile);

// Update logged-in user's profile
router.put("/", protect, updateMyProfile);

module.exports = router;