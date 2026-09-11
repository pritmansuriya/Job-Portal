import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notificationsApi } from "../services/api";

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.unreadCount();

      setCount(response.data.count);
    } catch (error) {
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
      <span className="text-2xl">
        🔔
      </span>

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;