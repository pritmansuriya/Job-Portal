const express = require("express");

const {
  protect
} = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getSavedJobs,
  saveJob,
  removeSavedJob
} = require("../controllers/userController");

const router = express.Router();

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getUsers
);

router.get("/saved-jobs", protect, allowRoles("jobseeker"), getSavedJobs);
router.post("/saved-jobs/:jobId", protect, allowRoles("jobseeker"), saveJob);
router.delete("/saved-jobs/:jobId", protect, allowRoles("jobseeker"), removeSavedJob);

module.exports = router;