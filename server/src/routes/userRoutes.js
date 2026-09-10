const express = require("express");

const {
  protect
} = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  getProfile,
  updateProfile,
  getUsers
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

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getUsers
);

module.exports = router;