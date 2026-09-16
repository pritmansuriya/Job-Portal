import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiGrid,
  FiInbox,
  FiLogOut,
  FiPlus,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { authStorage, getErrorMessage, notificationsApi } from "../../services/api";

const navigation = [
  ["Dashboard", "/dashboard/employer", FiGrid],
  ["Post a Job", "/dashboard/employer/post-job", FiPlus],
  ["My Jobs", "/dashboard/employer/jobs", FiBriefcase],
  ["Applications", "/dashboard/employer/applications", FiUsers],
  ["Interviews", "/dashboard/employer/interviews", FiCalendar],
  ["Notifications", "/dashboard/employer/notifications", FiBell],
  ["Company Profile", "/dashboard/employer/profile", FiBriefcase],
  ["Settings", "/dashboard/employer/settings", FiSettings],
];

const typeConfig = {
  application_received: {
    Icon: FiInbox,
    iconClass: "bg-teal-100 text-teal-700",
    borderClass: "border-teal-200",
    label: "New Application",
  },
  application_viewed: {
    Icon: FiEye,
    iconClass: "bg-sky-100 text-sky-700",
    borderClass: "border-sky-200",
    label: "Application Viewed",
  },
  application_interview: {
    Icon: FiCalendar,
    iconClass: "bg-violet-100 text-violet-700",
    borderClass: "border-violet-200",
    label: "Interview Scheduled",
  },
  application_accepted: {
    Icon: FiCheckCircle,
    iconClass: "bg-emerald-100 text-emerald-700",
    borderClass: "border-emerald-200",
    label: "Accepted",
  },
  application_rejected: {
    Icon: FiX,
    iconClass: "bg-rose-100 text-rose-700",
    borderClass: "border-rose-200",
    label: "Rejected",
  },
  new_job: {
    Icon: FiBriefcase,
    iconClass: "bg-amber-100 text-amber-700",
    borderClass: "border-amber-200",
    label: "New Job",
  },
};

const fallbackConfig = {
  Icon: FiBell,
  iconClass: "bg-slate-100 text-slate-600",
  borderClass: "border-slate-200",
  label: "Notification",
};

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
};

const EmployerNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    notificationsApi
      .list()
      .then((response) => setNotifications(response.data))
      .catch((requestError) =>
        setError(getErrorMessage(requestError, "Unable to load notifications"))
      )
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const visibleNotifications =
    activeTab === "Unread"
      ? notifications.filter((n) => !n.isRead)
      : activeTab === "Read"
        ? notifications.filter((n) => n.isRead)
        : notifications;

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // silent fail — notification state remains unchanged
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent fail
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f3f5f2] text-[#17212b]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        {/* ── Sidebar ── */}
        <aside className="hidden w-68.5 shrink-0 flex-col bg-[#17212b] px-5 py-7 text-white lg:flex">
          <Link
            to="/dashboard/employer"
            className="mb-12 flex items-center gap-3 px-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]">
              <FiBriefcase />
            </span>
            <span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span>
          </Link>

          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            Workspace
          </p>

          <nav className="mt-4 space-y-1.5">
            {navigation.map(([label, path, Icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  label === "Notifications"
                    ? "bg-[#c5f36c] text-[#17212b]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#f4a261] px-2 py-0.5 text-[10px] font-black text-[#17212b]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold text-slate-400">Stay informed</p>
            <p className="mt-1 text-sm leading-5 text-slate-200">
              Track every application update from your candidates in real time.
            </p>
            <Link
              to="/contact"
              className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]"
            >
              Contact support <FiArrowUpRight />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"
          >
            <FiLogOut /> Logout
          </button>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-11 lg:py-9">
          <div className="mx-auto max-w-4xl">

            {/* Header */}
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">
                  Employer workspace
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-3 rounded-full bg-[#f4a261] px-3 py-1 align-middle text-sm font-black text-[#17212b] shadow-[2px_2px_0_#e07a45]">
                      {unreadCount} new
                    </span>
                  )}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Every candidate update, right here in one place.
                </p>
              </div>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-[#17212b] px-5 py-3 text-sm font-black text-[#17212b] shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#17212b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none md:self-auto"
              >
                <FiCheck /> Mark all as read
              </button>
            </header>

            {/* Tabs */}
            <div className="mt-6 flex gap-2">
              {["All", "Unread", "Read"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeTab === tab
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-white text-slate-500 hover:border-[#e07a45] hover:text-[#b65b2d]"
                  }`}
                >
                  {tab}
                  <span className="ml-2 opacity-60">
                    {tab === "All"
                      ? notifications.length
                      : tab === "Unread"
                        ? unreadCount
                        : notifications.length - unreadCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">
                {error}
              </p>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-slate-100" />
                      <div className="h-3 w-2/3 rounded bg-slate-100" />
                      <div className="h-3 w-1/4 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && visibleNotifications.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c5f36c]/20">
                  <FiBell className="text-3xl text-[#17212b]" />
                </span>
                <h2 className="mt-5 text-xl font-black">
                  {activeTab === "Unread" ? "No unread notifications" : "No notifications yet"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {activeTab === "Unread"
                    ? "You're all caught up! Every notification has been read."
                    : "Candidate applications and updates will appear here automatically."}
                </p>
              </div>
            )}

            {/* Notification list */}
            {!isLoading && !error && visibleNotifications.length > 0 && (
              <div className="mt-6 space-y-3">
                {visibleNotifications.map((notification) => {
                  const config = typeConfig[notification.type] ?? fallbackConfig;
                  const { Icon, iconClass, borderClass } = config;
                  const isUnread = !notification.isRead;

                  return (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                        isUnread
                          ? `${borderClass} bg-white shadow-[0_8px_20px_rgba(23,33,43,0.06)]`
                          : "border-slate-100 bg-white/70"
                      }`}
                    >
                      {/* Icon */}
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${iconClass}`}
                      >
                        <Icon />
                      </span>

                      {/* Content */}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span
                            className={`font-black ${isUnread ? "text-[#17212b]" : "text-slate-500"}`}
                          >
                            {notification.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">
                              {timeAgo(notification.createdAt)}
                            </span>
                            {isUnread && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#f4a261]" />
                            )}
                          </span>
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-slate-600">
                          {notification.message}
                        </span>

                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                          {config.label}
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

export default EmployerNotifications;

