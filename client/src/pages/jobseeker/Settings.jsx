import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheck,
  FiDownload,
  FiFileText,
  FiHeart,
  FiHome,
  FiKey,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import api, { authStorage } from "../../services/api";

/* ─── nav config ─────────────────────────────────────────── */
const NAV = [
  ["Dashboard",       "/dashboard/jobseeker",              FiHome],
  ["Find Jobs",       "/dashboard/jobseeker/jobs",         FiSearch],
  ["Saved Jobs",      "/dashboard/jobseeker/saved",        FiHeart],
  ["My Applications", "/dashboard/jobseeker/applications", FiFileText],
  ["Notifications",   "/dashboard/jobseeker/notifications",FiBell],
  ["My Profile",      "/dashboard/jobseeker/profile",      FiUser],
  ["My Resume",       "/dashboard/jobseeker/profile/edit", FiFileText],
  ["Settings",        "/dashboard/jobseeker/settings",     FiSettings],
];

const TABS = [
  { id: "account",       label: "Account Info",     icon: FiUser },
  { id: "security",      label: "Security",         icon: FiKey },
  { id: "notifications", label: "Notifications",    icon: FiBell },
  { id: "privacy",       label: "Privacy",          icon: FiShield },
  { id: "data",          label: "Data & Sessions",  icon: FiDownload },
];

/* ─── helpers ────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div className="mb-6 rounded-[1.6rem] bg-white p-6 shadow-[0_12px_28px_rgba(19,34,56,0.07)] md:p-8">
    <h3 className="mb-6 border-b border-slate-100 pb-4 text-lg font-black tracking-tight text-[#132238]">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="mb-5">
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
      {label}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#132238] outline-none transition focus:border-[#0d9f9a] focus:ring-2 focus:ring-[#0d9f9a]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
  />
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition hover:bg-[#eaf4f2]">
    <div>
      <p className="text-sm font-bold text-[#132238]">{label}</p>
      {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex shrink-0 items-center transition-colors ${checked ? "text-[#0d9f9a]" : "text-slate-300"}`}
    >
      {checked ? <FiToggleRight size={32} /> : <FiToggleLeft size={32} />}
    </button>
  </div>
);

/* ─── main component ─────────────────────────────────────── */
const JobSeekerSettings = () => {
  const navigate = useNavigate();
  const lastUser = authStorage.getUser();

  const [profile, setProfile]   = useState(lastUser ?? null);
  const [activeTab, setActiveTab] = useState("account");
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null); // { type: 'success'|'error', msg }

  /* account */
  const [name,     setName]     = useState(lastUser?.name     ?? "");
  const [phone,    setPhone]    = useState(lastUser?.phone    ?? "");
  const [location, setLocation] = useState(lastUser?.location ?? "");

  /* security */
  const [oldPw,  setOldPw]  = useState("");
  const [newPw,  setNewPw]  = useState("");
  const [confPw, setConfPw] = useState("");

  /* notifications */
  const [notifs, setNotifs] = useState({
    applicationUpdates: true,
    newJobAlerts:       true,
    interviewReminders: true,
    weeklyDigest:       false,
    marketingEmails:    false,
  });

  /* privacy */
  const [privacy, setPrivacy] = useState({
    profileVisible:  true,
    resumePublic:    false,
    showEmail:       false,
    allowRecruiterContact: true,
  });

  /* ── fetch fresh profile ─────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    api.get("/users/profile")
      .then(r => {
        setProfile(r.data);
        setName(r.data.name ?? "");
        setPhone(r.data.phone ?? "");
        setLocation(r.data.location ?? "");
        if (r.data.settings?.notifications) setNotifs(n => ({ ...n, ...r.data.settings.notifications }));
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          authStorage.clear(); navigate("/login");
        }
      });
  }, [navigate]);

  const flash = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  /* ── save account ────────────────────────────────────── */
  const saveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", { name, phone, location });
      const stored = authStorage.getUser() ?? {};
      authStorage.setSession(localStorage.getItem("token"), { ...stored, name, phone, location });
      flash("success", "Account information updated successfully.");
    } catch {
      flash("error", "Failed to save account information.");
    } finally {
      setSaving(false);
    }
  };

  /* ── change password ─────────────────────────────────── */
  const changePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confPw)  { flash("error", "New passwords do not match."); return; }
    if (newPw.length < 8)  { flash("error", "Password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      await api.put("/users/change-password", { currentPassword: oldPw, newPassword: newPw });
      setOldPw(""); setNewPw(""); setConfPw("");
      flash("success", "Password changed successfully.");
    } catch (err) {
      flash("error", err.response?.data?.message ?? "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  /* ── save notifications ──────────────────────────────── */
  const saveNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", { settings: { notifications: notifs } });
      flash("success", "Notification preferences saved.");
    } catch {
      flash("error", "Failed to save notification preferences.");
    } finally {
      setSaving(false);
    }
  };

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="h-screen overflow-hidden bg-[#eaf4f2] text-[#132238]">
      <div className="mx-auto flex h-screen max-w-[1600px] overflow-hidden">

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="hidden w-[290px] shrink-0 overflow-y-auto bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
          {/* brand */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "J"}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Job Seeker</p>
              <h2 className="mt-1 text-xl font-bold">{profile?.name ?? "User"}</h2>
            </div>
          </div>

          {/* email chip */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Account</p>
            <p className="mt-2 truncate text-sm text-slate-100">{profile?.email ?? lastUser?.email ?? ""}</p>
          </div>

          {/* nav */}
          <nav className="space-y-2">
            {NAV.map(([label, path, Icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 hover:text-white
                  ${label === "Settings" ? "bg-white/10 text-white font-semibold" : "text-slate-200"}`}
              >
                <Icon className="shrink-0 text-lg" />
                <span>{label}</span>
                {label === "Settings" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f6c453]" />
                )}
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

        {/* ── Main ───────────────────────────────────────── */}
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-10 md:px-10">
          <div className="mx-auto max-w-4xl">

            {/* page header */}
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">Job Seeker Portal</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">Settings</h1>
              <p className="mt-2 text-sm text-slate-500">Manage your account, security, and preferences.</p>
            </div>

            {/* toast */}
            {toast && (
              <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-lg
                ${toast.type === "success" ? "bg-[#0d9f9a] text-white" : "bg-red-500 text-white"}`}>
                {toast.type === "success" ? <FiCheck className="text-xl" /> : null}
                <span>{toast.msg}</span>
              </div>
            )}

            {/* tab bar */}
            <div className="mb-8 flex flex-wrap gap-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition
                    ${activeTab === id
                      ? "bg-[#132238] text-white shadow-md"
                      : "bg-white text-slate-500 hover:bg-[#d8f0ed] hover:text-[#132238]"}`}
                >
                  <Icon className="text-base" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB: Account Info ──────────────────────── */}
            {activeTab === "account" && (
              <form onSubmit={saveAccount}>
                <Section title="Personal Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name">
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                    </Field>
                    <Field label="Email Address">
                      <Input value={profile?.email ?? lastUser?.email ?? ""} disabled />
                    </Field>
                    <Field label="Phone Number">
                      <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 00000 00000" />
                    </Field>
                    <Field label="Location">
                      <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                    </Field>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Email address cannot be changed. Contact support if needed.
                  </div>
                </Section>

                <Section title="Job Preferences">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Desired Job Title">
                      <Input placeholder="e.g. Frontend Developer" />
                    </Field>
                    <Field label="Expected Salary">
                      <Input placeholder="e.g. ₹8–12 LPA" />
                    </Field>
                    <Field label="Preferred Location">
                      <Input placeholder="e.g. Bangalore, Remote" />
                    </Field>
                    <Field label="Work Mode">
                      <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#132238] outline-none transition focus:border-[#0d9f9a] focus:ring-2 focus:ring-[#0d9f9a]/20">
                        <option>Any</option>
                        <option>Remote</option>
                        <option>On-site</option>
                        <option>Hybrid</option>
                      </select>
                    </Field>
                  </div>
                </Section>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#0d9f9a] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#087b78] disabled:opacity-60"
                  >
                    {saving ? "Saving…" : <><FiCheck className="text-base" /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}

            {/* ── TAB: Security ──────────────────────────── */}
            {activeTab === "security" && (
              <>
                <form onSubmit={changePassword}>
                  <Section title="Change Password">
                    <Field label="Current Password">
                      <Input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Enter current password" required />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="New Password">
                        <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" required />
                      </Field>
                      <Field label="Confirm New Password">
                        <Input type="password" value={confPw} onChange={e => setConfPw(e.target.value)} placeholder="Repeat new password" required />
                      </Field>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-400">
                      <li className={newPw.length >= 8 ? "text-[#0d9f9a] font-semibold" : ""}>• At least 8 characters</li>
                      <li className={/[A-Z]/.test(newPw) ? "text-[#0d9f9a] font-semibold" : ""}>• One uppercase letter</li>
                      <li className={/\d/.test(newPw) ? "text-[#0d9f9a] font-semibold" : ""}>• One number</li>
                    </ul>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-[#0d9f9a] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#087b78] disabled:opacity-60"
                      >
                        {saving ? "Updating…" : <><FiKey className="text-base" /> Update Password</>}
                      </button>
                    </div>
                  </Section>
                </form>

                <Section title="Active Sessions">
                  <div className="flex items-center justify-between rounded-2xl border border-[#0d9f9a]/20 bg-[#eaf4f2] px-5 py-4">
                    <div>
                      <p className="text-sm font-bold">Current Session</p>
                      <p className="mt-0.5 text-xs text-slate-400">Browser · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <span className="rounded-full bg-[#0d9f9a] px-3 py-1 text-xs font-black text-white">Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                  >
                    <FiLogOut className="text-base" /> Sign out of all devices
                  </button>
                </Section>
              </>
            )}

            {/* ── TAB: Notifications ─────────────────────── */}
            {activeTab === "notifications" && (
              <form onSubmit={saveNotifications}>
                <Section title="Email Notifications">
                  <div className="space-y-3">
                    <Toggle
                      checked={notifs.applicationUpdates}
                      onChange={v => setNotifs(n => ({ ...n, applicationUpdates: v }))}
                      label="Application Status Updates"
                      description="Get notified when your application status changes"
                    />
                    <Toggle
                      checked={notifs.newJobAlerts}
                      onChange={v => setNotifs(n => ({ ...n, newJobAlerts: v }))}
                      label="New Job Alerts"
                      description="Receive alerts for new jobs matching your profile"
                    />
                    <Toggle
                      checked={notifs.interviewReminders}
                      onChange={v => setNotifs(n => ({ ...n, interviewReminders: v }))}
                      label="Interview Reminders"
                      description="Reminders before scheduled interviews"
                    />
                    <Toggle
                      checked={notifs.weeklyDigest}
                      onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))}
                      label="Weekly Job Digest"
                      description="A curated summary of jobs every Monday"
                    />
                    <Toggle
                      checked={notifs.marketingEmails}
                      onChange={v => setNotifs(n => ({ ...n, marketingEmails: v }))}
                      label="Tips & Product Updates"
                      description="Career tips, platform features, and occasional offers"
                    />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-[#0d9f9a] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#087b78] disabled:opacity-60"
                    >
                      {saving ? "Saving…" : <><FiCheck className="text-base" /> Save Preferences</>}
                    </button>
                  </div>
                </Section>
              </form>
            )}

            {/* ── TAB: Privacy ───────────────────────────── */}
            {activeTab === "privacy" && (
              <Section title="Privacy Controls">
                <div className="space-y-3">
                  <Toggle
                    checked={privacy.profileVisible}
                    onChange={v => setPrivacy(p => ({ ...p, profileVisible: v }))}
                    label="Public Profile"
                    description="Allow employers to discover and view your profile"
                  />
                  <Toggle
                    checked={privacy.resumePublic}
                    onChange={v => setPrivacy(p => ({ ...p, resumePublic: v }))}
                    label="Resume Visible to Employers"
                    description="Employers can view your resume without a direct application"
                  />
                  <Toggle
                    checked={privacy.showEmail}
                    onChange={v => setPrivacy(p => ({ ...p, showEmail: v }))}
                    label="Show Email on Profile"
                    description="Display your email address publicly"
                  />
                  <Toggle
                    checked={privacy.allowRecruiterContact}
                    onChange={v => setPrivacy(p => ({ ...p, allowRecruiterContact: v }))}
                    label="Allow Recruiter Contact"
                    description="Let recruiters reach out to you directly"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-[#0d9f9a]/20 bg-[#eaf4f2] p-4 text-xs text-slate-500">
                  <p className="font-bold text-[#0d9f9a] mb-1">How your data is used</p>
                  Your information is only shared with employers when you apply for a job or when your profile is set to public.
                  We never sell your data to third parties.
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => flash("success", "Privacy settings saved.")}
                    className="flex items-center gap-2 rounded-xl bg-[#0d9f9a] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#087b78]"
                  >
                    <FiShield className="text-base" /> Save Privacy Settings
                  </button>
                </div>
              </Section>
            )}

            {/* ── TAB: Data & Sessions ───────────────────── */}
            {activeTab === "data" && (
              <>
                <Section title="Export Your Data">
                  <p className="mb-5 text-sm text-slate-500">
                    Download a copy of your account data including your profile, applications, and saved jobs.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Profile & Resume",     desc: "Your personal info, skills, and experience", icon: FiUser },
                      { label: "Application History",  desc: "All jobs you've applied for",                icon: FiFileText },
                      { label: "Saved Jobs",           desc: "Your bookmarked job listings",              icon: FiHeart },
                      { label: "Full Data Export",     desc: "Everything in a single JSON file",          icon: FiDownload },
                    ].map(({ label, desc, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-[#0d9f9a]/30 hover:bg-[#eaf4f2]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d9f9a]/10 text-[#0d9f9a]">
                          <Icon className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{label}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => flash("success", `"${label}" export started. Check your email.`)}
                          className="mt-0.5 shrink-0 rounded-lg bg-[#132238] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0d9f9a]"
                        >
                          Export
                        </button>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Danger Zone">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
                      <div>
                        <p className="text-sm font-bold text-red-700">Delete All Applications</p>
                        <p className="mt-0.5 text-xs text-red-400">Permanently remove all your job applications. This cannot be undone.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => flash("error", "Please contact support to delete your application history.")}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-100"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
                      <div>
                        <p className="text-sm font-bold text-red-700">Delete Account</p>
                        <p className="mt-0.5 text-xs text-red-400">Permanently delete your account and all associated data.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => flash("error", "Please contact support to permanently delete your account.")}
                        className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-600"
                      >
                        <FiTrash2 /> Delete Account
                      </button>
                    </div>
                  </div>
                </Section>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSeekerSettings;

