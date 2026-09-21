import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiDownload,
  FiGrid,
  FiKey,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSave,
  FiSettings,
  FiShield,
  FiSliders,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { authStorage, getErrorMessage, usersApi } from "../../services/api";

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

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account"); // 'account' | 'security' | 'hiring' | 'notifications' | 'danger'
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Account Form
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hiring & Notification Preferences
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    candidateStatusAlerts: true,
    weeklyDigest: false,
    defaultJobType: "Full Time",
    defaultWorkMode: "Hybrid",
    autoNotifyShortlist: true,
  });

  useEffect(() => {
    usersApi
      .profile()
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        setAccountForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          companyName: userData.companyName || "",
        });
        if (userData.settings) {
          setPreferences((prev) => ({
            ...prev,
            ...userData.settings,
          }));
        }
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err, "Failed to load account settings"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Save Account Info
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsSaving(true);

    try {
      const res = await usersApi.updateProfile({
        name: accountForm.name,
        phone: accountForm.phone,
        location: accountForm.location,
        companyName: accountForm.companyName,
      });

      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      // update local storage user if needed
      const currentSession = authStorage.getUser();
      if (currentSession) {
        authStorage.setSession({
          token: localStorage.getItem("token"),
          user: { ...currentSession, ...updatedUser },
        });
      }

      setSuccessMessage("Account details updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to update account details"));
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long");
      return;
    }

    setIsSaving(true);
    try {
      await usersApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage("Password changed successfully! Keep your new password safe.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to update password"));
    } finally {
      setIsSaving(false);
    }
  };

  // Save Preferences
  const handleTogglePreference = async (key) => {
    clearMessages();
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);

    try {
      await usersApi.updateProfile({ settings: updated });
      setSuccessMessage("Preference updated.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Could not save preference"));
    }
  };

  const handleSelectPreference = async (key, value) => {
    clearMessages();
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);

    try {
      await usersApi.updateProfile({ settings: updated });
      setSuccessMessage("Hiring default updated.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Could not save preference"));
    }
  };

  // Export Data
  const handleExportData = () => {
    const data = {
      user,
      preferences,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employer-settings-${user?.name || "backup"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const tabs = [
    { id: "account", label: "Account Info", icon: FiUser },
    { id: "security", label: "Security & Password", icon: FiLock },
    { id: "hiring", label: "Hiring Defaults", icon: FiSliders },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "danger", label: "Data & Sessions", icon: FiShield },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f2] text-[#17212b]">
      <div className="mx-auto flex h-screen max-w-[1680px] overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="hidden w-68.5 shrink-0 flex-col overflow-y-auto bg-[#17212b] px-5 py-7 text-white lg:flex">
          <Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]">
              <FiBriefcase />
            </span>
            <span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span>
          </Link>

          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p>

          <nav className="mt-4 space-y-1.5">
            {navigation.map(([label, path, Icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  label === "Settings"
                    ? "bg-[#c5f36c] text-[#17212b]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold text-slate-400">Security notice</p>
            <p className="mt-1 text-sm leading-5 text-slate-200">
              Employer account is designated and protected with 256-bit encryption.
            </p>
            <Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">
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

        {/* ── Main Content ── */}
        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-11 lg:py-9">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer workspace</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Settings</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Manage your credentials, hiring workflow preferences, and account security.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-50 md:self-auto"
              >
                <FiLogOut /> Sign Out
              </button>
            </header>

            {/* Notifications / Alerts */}
            {successMessage && (
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <div className="flex items-center gap-3">
                  <FiCheck className="text-lg text-emerald-600" />
                  <span className="text-sm font-bold">{successMessage}</span>
                </div>
                <button type="button" onClick={() => setSuccessMessage("")} className="text-emerald-600 hover:text-emerald-900">
                  <FiX />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="text-lg text-rose-600" />
                  <span className="text-sm font-bold">{errorMessage}</span>
                </div>
                <button type="button" onClick={() => setErrorMessage("")} className="text-rose-600 hover:text-rose-900">
                  <FiX />
                </button>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      clearMessages();
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                      isActive
                        ? "bg-[#17212b] text-[#c5f36c] shadow-[3px_3px_0_#f4a261]"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#17212b]"
                    }`}
                  >
                    <Icon className="text-sm" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Skeleton Loading */}
            {isLoading && (
              <div className="mt-8 space-y-4 animate-pulse">
                <div className="h-40 rounded-2xl bg-slate-200" />
                <div className="h-60 rounded-2xl bg-slate-200" />
              </div>
            )}

            {!isLoading && (
              <div className="mt-8">
                {/* ── TAB 1: Account Info ── */}
                {activeTab === "account" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                      <div>
                        <h2 className="text-xl font-black">Account Information</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Update the primary contact and representative details for this employer portal.
                        </p>
                      </div>
                      <Link
                        to="/dashboard/employer/profile"
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#e07a45] hover:underline"
                      >
                        Company Profile <FiArrowUpRight />
                      </Link>
                    </div>

                    <form onSubmit={handleSaveAccount} className="mt-6 space-y-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Representative Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiUser />
                            </span>
                            <input
                              type="text"
                              value={accountForm.name}
                              onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Email (Login Credential)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiMail />
                            </span>
                            <input
                              type="email"
                              value={accountForm.email}
                              disabled
                              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm font-semibold text-slate-500"
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Designated employer login email configured in server environment.
                          </p>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Company Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiBriefcase />
                            </span>
                            <input
                              type="text"
                              value={accountForm.companyName}
                              onChange={(e) => setAccountForm({ ...accountForm, companyName: e.target.value })}
                              placeholder="Acme Corp"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Phone Number
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiPhone />
                            </span>
                            <input
                              type="text"
                              value={accountForm.phone}
                              onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Location / Headquarters
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiMapPin />
                            </span>
                            <input
                              type="text"
                              value={accountForm.location}
                              onChange={(e) => setAccountForm({ ...accountForm, location: e.target.value })}
                              placeholder="City, Country"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-6 py-3 text-xs font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] disabled:opacity-50"
                        >
                          <FiSave /> {isSaving ? "Saving..." : "Save Account Details"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── TAB 2: Security & Password ── */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                      <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-xl font-black">Change Password</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Ensure your employer account remains secure with a strong password.
                        </p>
                      </div>

                      <form onSubmit={handleChangePassword} className="mt-6 max-w-lg space-y-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Current Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiLock />
                            </span>
                            <input
                              type="password"
                              placeholder="Enter current password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            New Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiKey />
                            </span>
                            <input
                              type="password"
                              placeholder="At least 6 characters"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <FiKey />
                            </span>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#17212b] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-6 py-3 text-xs font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] disabled:opacity-50"
                          >
                            <FiCheck /> {isSaving ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Authentication Health</h3>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                            <FiShield />
                          </div>
                          <div>
                            <p className="text-xs font-black text-emerald-900">Dedicated Role Protection</p>
                            <p className="mt-0.5 text-xs text-emerald-700">
                              Restricted to verified employer credentials. Public registration blocked.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                            <FiLock />
                          </div>
                          <div>
                            <p className="text-xs font-black text-sky-900">JWT Token Expiry</p>
                            <p className="mt-0.5 text-xs text-sky-700">
                              Active session is authorized with 7-day token rotation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: Hiring Defaults ── */}
                {activeTab === "hiring" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="border-b border-slate-100 pb-5">
                      <h2 className="text-xl font-black">Hiring Workflow Defaults</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Preset default options to streamline posting new jobs and managing candidates.
                      </p>
                    </div>

                    <div className="mt-6 space-y-6 max-w-2xl">
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                          Default Job Type For New Posts
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["Full Time", "Part Time", "Contract", "Internship"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleSelectPreference("defaultJobType", type)}
                              className={`rounded-xl border py-2.5 text-xs font-black transition ${
                                preferences.defaultJobType === type
                                  ? "border-[#17212b] bg-[#17212b] text-white shadow-sm"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                          Default Work Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Remote", "Hybrid", "On-site"].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => handleSelectPreference("defaultWorkMode", mode)}
                              className={`rounded-xl border py-2.5 text-xs font-black transition ${
                                preferences.defaultWorkMode === mode
                                  ? "border-[#17212b] bg-[#17212b] text-white shadow-sm"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-[#17212b]">Auto-Notify Shortlisted Candidates</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Automatically dispatch a notification to the jobseeker when their status is moved to Shortlisted.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleTogglePreference("autoNotifyShortlist")}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                              preferences.autoNotifyShortlist ? "bg-[#17212b]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                preferences.autoNotifyShortlist ? "translate-x-6 bg-[#c5f36c]" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: Notifications ── */}
                {activeTab === "notifications" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="border-b border-slate-100 pb-5">
                      <h2 className="text-xl font-black">Notification Preferences</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Choose what alerts and events you want to receive in your workspace and inbox.
                      </p>
                    </div>

                    <div className="mt-6 divide-y divide-slate-100 max-w-2xl">
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-black text-[#17212b]">New Application Alerts</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Receive real-time notifications in the sidebar and notifications section whenever a jobseeker applies.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePreference("emailAlerts")}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            preferences.emailAlerts ? "bg-[#17212b]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              preferences.emailAlerts ? "translate-x-6 bg-[#c5f36c]" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-black text-[#17212b]">Candidate Interview Updates</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Get reminded about scheduled interviews and calendar events.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePreference("candidateStatusAlerts")}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            preferences.candidateStatusAlerts ? "bg-[#17212b]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              preferences.candidateStatusAlerts ? "translate-x-6 bg-[#c5f36c]" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-black text-[#17212b]">Weekly Activity Digest</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Summarized overview of all applications, views, and hiring milestones every Monday.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePreference("weeklyDigest")}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            preferences.weeklyDigest ? "bg-[#17212b]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              preferences.weeklyDigest ? "translate-x-6 bg-[#c5f36c]" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 5: Data & Sessions ── */}
                {activeTab === "danger" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                      <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-xl font-black">Export Workspace Data</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Download a copy of your account information, company preferences, and portal records in JSON format.
                        </p>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-[#17212b] hover:text-[#17212b]"
                        >
                          <FiDownload className="text-sm text-[#e07a45]" /> Download JSON Backup
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-7 shadow-sm">
                      <div>
                        <h2 className="text-xl font-black text-rose-900">Session & Sign Out</h2>
                        <p className="mt-1 text-xs text-rose-700">
                          Terminate your current session on this device and return to the secure login screen.
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-black text-white shadow-sm transition hover:bg-rose-700"
                        >
                          <FiLogOut /> Sign Out from This Device
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

