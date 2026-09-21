import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBriefcase,
  FiCheck,
  FiClock,
  FiEye,
  FiFileText,
  FiHeart,
  FiHome,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import { authStorage, getErrorMessage, notificationsApi } from "../../services/api";

const notificationStyles = {
  application_accepted: { icon: FiCheck, iconClass: "bg-emerald-100 text-emerald-700" },
  application_interview: { icon: FiClock, iconClass: "bg-violet-100 text-violet-700" },
  application_viewed: { icon: FiEye, iconClass: "bg-blue-100 text-blue-700" },
  application_rejected: { icon: FiX, iconClass: "bg-red-100 text-red-700" },
  new_job: { icon: FiBriefcase, iconClass: "bg-amber-100 text-amber-700" },
  application_received: { icon: FiBell, iconClass: "bg-teal-100 text-teal-700" },
};

const navItems = [
  ["Dashboard", "/dashboard/jobseeker", FiHome],
  ["Find Jobs", "/dashboard/jobseeker/jobs", FiSearch],
  ["Saved Jobs", "/dashboard/jobseeker/saved", FiHeart],
  ["My Applications", "/dashboard/jobseeker/applications", FiFileText],
  ["Notifications", "/dashboard/jobseeker/notifications", FiBell],
  ["My Profile", "/dashboard/jobseeker/profile", FiUser],
  ["My Resume", "/dashboard/jobseeker/profile/edit", FiFileText],
  ["Settings", "/dashboard/jobseeker/settings", FiSettings],
];

const Notifications = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
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
            ? { ...notification, isRead: true }
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

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="h-screen overflow-hidden bg-[#eaf4f2] text-[#132238]">
      <div className="mx-auto flex h-screen max-w-[1600px] overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="hidden w-[290px] shrink-0 overflow-y-auto bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "J"}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Job Seeker</p>
              <h2 className="mt-1 text-xl font-bold">{currentUser?.name || "User"}</h2>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Profile</p>
            <p className="mt-2 text-sm text-slate-100">{currentUser?.email || "No email available"}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(([label, path, Icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${
                  label === "Notifications" ? "bg-white/10 text-white" : "text-slate-200"
                }`}
              >
                <Icon className="shrink-0 text-lg" />
                <span>{label}</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <FiLogOut className="shrink-0 text-lg" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-10 md:px-10">
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
                      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                        notification.isRead
                          ? "border-slate-200 bg-white"
                          : "border-[#9adbd7] bg-[#f4fffd] shadow-[0_8px_20px_rgba(13,159,154,0.08)]"
                      }`}
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}>
                        <Icon />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-4">
                          <span className="font-black text-[#132238]">{notification.title}</span>
                          {!notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d9f9a]" />}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{notification.message}</span>
                        <span className="mt-2 block text-xs font-semibold text-slate-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;