import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { notificationsApi } from "../services/api";

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCount(0);
      return;
    }

    try {
      const response = await notificationsApi.unreadCount();
      setCount(response.data.count || 0);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setCount(0);
        return;
      }

      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(
      fetchUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      to="/dashboard/jobseeker/notifications"
      className="relative inline-flex"
    >
      <FiBell className="text-2xl" />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;