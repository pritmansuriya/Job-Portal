import { useEffect, useState } from "react";
import { FiBell, FiBriefcase, FiCheck, FiClock, FiEye, FiX } from "react-icons/fi";
import { getErrorMessage, notificationsApi } from "../../services/api";

const notificationStyles = {
  application_accepted: { icon: FiCheck, iconClass: "bg-emerald-100 text-emerald-700" },
  application_interview: { icon: FiClock, iconClass: "bg-violet-100 text-violet-700" },
  application_viewed: { icon: FiEye, iconClass: "bg-blue-100 text-blue-700" },
  application_rejected: { icon: FiX, iconClass: "bg-red-100 text-red-700" },
  new_job: { icon: FiBriefcase, iconClass: "bg-amber-100 text-amber-700" },
  application_received: { icon: FiBell, iconClass: "bg-teal-100 text-teal-700" },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.list();

      setNotifications(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load notifications"));
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-[#eaf4f2] px-6 py-10 text-[#132238] md:px-10">
      <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">Job seeker portal</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Notifications</h1>
          <p className="mt-2 text-slate-500">Stay close to every update on your job search.</p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={!notifications.some((notification) => !notification.isRead)}
          className="rounded-xl border border-[#0d9f9a] px-4 py-2.5 text-sm font-bold text-[#087b78] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark all as read
        </button>
      </div>

      {isLoading && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading notifications...</p>}
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">{error}</p>}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <FiBell className="mx-auto text-3xl text-[#0d9f9a]" />
          <p className="mt-3 font-bold">You are all caught up.</p>
          <p className="mt-1 text-sm text-slate-500">New application and job updates will appear here.</p>
        </div>
      )}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const style = notificationStyles[notification.type] || notificationStyles.application_received;
            const Icon = style.icon;
            return (
              <button
                type="button"
                key={notification._id}
                onClick={() => markAsRead(notification._id)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${notification.isRead ? "border-slate-200 bg-white" : "border-[#9adbd7] bg-[#f4fffd] shadow-[0_8px_20px_rgba(13,159,154,0.08)]"}`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}><Icon /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-black text-[#132238]">{notification.title}</span>
                    {!notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d9f9a]" />}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{notification.message}</span>
                  <span className="mt-2 block text-xs font-semibold text-slate-400">{new Date(notification.createdAt).toLocaleString()}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default Notifications;