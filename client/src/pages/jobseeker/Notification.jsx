import { useEffect, useState } from "react";
import { notificationsApi } from "../../services/api";

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.list();

      setNotifications(response.data);
    } catch (error) {
      console.error(
        "Notification error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Notifications
        </h1>

        <button
          onClick={markAllAsRead}
          className="text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">

        {notifications.length === 0 ? (
          <p className="text-gray-500">
            No notifications yet.
          </p>
        ) : (
          notifications.map(
            (notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  markAsRead(
                    notification._id
                  )
                }
                className={`p-4 rounded-lg border cursor-pointer ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-blue-50 border-blue-200"
                }`}
              >

                <div className="flex justify-between">

                  <h2 className="font-semibold">
                    {notification.title}
                  </h2>

                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}

                </div>

                <p className="text-gray-600 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>

              </div>
            )
          )
        )}

      </div>
    </div>
  );
};

export default Notifications;