const Notification = require("../models/notification");

// Get logged-in user's notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("job", "title company")
      .populate("application")
      .sort({
        createdAt: -1,
      });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};