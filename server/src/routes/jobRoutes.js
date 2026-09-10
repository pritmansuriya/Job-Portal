const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const {
  protect
} = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getJobs);

router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  allowRoles("employer", "admin"),
  createJob
);

router.put(
  "/:id",
  protect,
  allowRoles("employer", "admin"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  allowRoles("employer", "admin"),
  deleteJob
);

module.exports = router;