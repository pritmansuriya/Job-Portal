const express = require("express");

const {
  protect
} = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("jobseeker"),
  applyJob
);

router.get(
  "/my",
  protect,
  allowRoles("jobseeker"),
  getMyApplications
);

router.get(
  "/employer",
  protect,
  allowRoles("employer"),
  getEmployerApplications
);

router.put(
  "/:id",
  protect,
  allowRoles("employer", "admin"),
  updateApplicationStatus
);

module.exports = router;