import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiEdit2,
  FiExternalLink,
  FiGlobe,
  FiGrid,
  FiLinkedin,
  FiLogOut,
  FiMapPin,
  FiPlus,
  FiSettings,
  FiTwitter,
  FiUsers,
  FiX,
  FiZap,
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

const INDUSTRY_OPTIONS = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Manufacturing", "Media & Entertainment", "Real Estate",
  "Logistics & Supply Chain", "Consulting", "Legal", "Other",
];

const SIZE_OPTIONS = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "501–1000 employees", "1000+ employees",
];

const initForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  location: user?.location || "",
  companyName: user?.companyName || "",
  companyWebsite: user?.companyWebsite || "",
  companyIndustry: user?.companyIndustry || "",
  companySize: user?.companySize || "",
  companyFounded: user?.companyFounded || "",
  companyDescription: user?.companyDescription || "",
  linkedin: user?.companySocial?.linkedin || "",
  twitter: user?.companySocial?.twitter || "",
});

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initForm(null));
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    usersApi
      .profile()
      .then((response) => {
        setProfile(response.data);
        setForm(initForm(response.data));
      })
      .catch((requestError) =>
        setError(getErrorMessage(requestError, "Unable to load profile"))
      )
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        location: form.location,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        companyIndustry: form.companyIndustry,
        companySize: form.companySize,
        companyFounded: form.companyFounded,
        companyDescription: form.companyDescription,
        companySocial: { linkedin: form.linkedin, twitter: form.twitter },
      };
      const response = await usersApi.updateProfile(payload);
      setProfile(response.data.user ?? response.data);
      setForm(initForm(response.data.user ?? response.data));
      setIsEditing(false);
      setSuccess("Company profile saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save profile"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initForm(profile));
    setIsEditing(false);
    setError("");
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const initials = (profile?.companyName || profile?.name || "C")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const completionFields = [
    profile?.companyName,
    profile?.companyIndustry,
    profile?.companySize,
    profile?.companyFounded,
    profile?.companyDescription,
    profile?.companyWebsite,
    profile?.phone,
    profile?.location,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#f3f5f2] text-[#17212b]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">

        {/* ── Sidebar ── */}
        <aside className="hidden w-68.5 shrink-0 flex-col bg-[#17212b] px-5 py-7 text-white lg:flex">
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
                  label === "Company Profile"
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
            <p className="text-xs font-bold text-slate-400">Profile strength</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#c5f36c] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-black text-[#c5f36c]">{completionPct}% complete</p>
            <Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">
              Get help <FiArrowUpRight />
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
          <div className="mx-auto max-w-5xl">

            {/* Header */}
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer workspace</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Company Profile</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Build your employer brand. A great profile attracts better candidates.
                </p>
              </div>
              {!isEditing && !isLoading && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] md:self-auto"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </header>

            {/* Alerts */}
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <FiX className="mt-0.5 shrink-0 text-rose-500" />
                <p className="text-sm font-semibold text-rose-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <FiCheck className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">{success}</p>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="mt-8 animate-pulse space-y-4">
                <div className="h-32 rounded-2xl bg-slate-200" />
                <div className="h-48 rounded-2xl bg-slate-200" />
              </div>
            )}

            {!isLoading && (
              <div className="mt-8 space-y-6">

                {/* ── Company card ── */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(23,33,43,0.06)]">
                  {/* Top banner */}
                  <div className="h-24 bg-gradient-to-r from-[#17212b] via-[#2d3b47] to-[#1a3040]" />

                  <div className="px-7 pb-7">
                    {/* Avatar */}
                    <div className="relative -mt-10 mb-5 flex items-end justify-between">
                      <div className="relative">
                        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#c5f36c] text-2xl font-black text-[#17212b] shadow-[4px_4px_0_#f4a261]">
                          {initials}
                        </span>
                        {isEditing && (
                          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#17212b] text-white">
                            <FiCamera className="text-xs" />
                          </span>
                        )}
                      </div>

                      {/* Completion badge */}
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm">
                        <FiZap className="text-[#f4a261]" />
                        {completionPct}% complete
                      </div>
                    </div>

                    {isEditing ? (
                      /* ── EDIT MODE ── */
                      <div className="space-y-6">

                        {/* Account info */}
                        <Section title="Account Information">
                          <Field label="Contact Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                          <Field label="City / Location" name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, India" />
                        </Section>

                        {/* Company details */}
                        <Section title="Company Details">
                          <Field label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Corp" />
                          <Field label="Website" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://yourcompany.com" type="url" />
                          <div>
                            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Industry</label>
                            <select
                              name="companyIndustry"
                              value={form.companyIndustry}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#17212b] focus:border-[#17212b] focus:outline-none"
                            >
                              <option value="">Select industry…</option>
                              {INDUSTRY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Company Size</label>
                            <select
                              name="companySize"
                              value={form.companySize}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#17212b] focus:border-[#17212b] focus:outline-none"
                            >
                              <option value="">Select size…</option>
                              {SIZE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <Field label="Founded Year" name="companyFounded" value={form.companyFounded} onChange={handleChange} placeholder="2015" type="number" />
                        </Section>

                        {/* About */}
                        <Section title="About the Company">
                          <div>
                            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Company Description</label>
                            <textarea
                              name="companyDescription"
                              value={form.companyDescription}
                              onChange={handleChange}
                              rows={5}
                              placeholder="Tell candidates what makes your company a great place to work…"
                              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-[#17212b] focus:border-[#17212b] focus:outline-none"
                            />
                          </div>
                        </Section>

                        {/* Social */}
                        <Section title="Social Links">
                          <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/yourco" type="url" icon={<FiLinkedin />} />
                          <Field label="Twitter / X URL" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/yourco" type="url" icon={<FiTwitter />} />
                        </Section>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-6 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] disabled:opacity-50"
                          >
                            <FiCheck /> {isSaving ? "Saving…" : "Save Profile"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── VIEW MODE ── */
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black">
                          {profile?.companyName || <span className="text-slate-400 italic">Company name not set</span>}
                        </h2>
                        <p className="text-sm font-semibold text-[#e07a45]">
                          {profile?.companyIndustry || "Industry not set"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                          {profile?.location && (
                            <span className="flex items-center gap-1.5">
                              <FiMapPin className="text-[#f4a261]" /> {profile.location}
                            </span>
                          )}
                          {profile?.companySize && (
                            <span className="flex items-center gap-1.5">
                              <FiUsers className="text-[#f4a261]" /> {profile.companySize}
                            </span>
                          )}
                          {profile?.companyFounded && (
                            <span className="flex items-center gap-1.5">
                              <FiCalendar className="text-[#f4a261]" /> Est. {profile.companyFounded}
                            </span>
                          )}
                          {profile?.companyWebsite && (
                            <a
                              href={profile.companyWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-[#17212b] hover:underline"
                            >
                              <FiGlobe className="text-[#f4a261]" /> Website <FiExternalLink className="text-xs" />
                            </a>
                          )}
                        </div>

                        {/* Social links */}
                        {(profile?.companySocial?.linkedin || profile?.companySocial?.twitter) && (
                          <div className="mt-4 flex gap-3">
                            {profile.companySocial.linkedin && (
                              <a
                                href={profile.companySocial.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                              >
                                <FiLinkedin /> LinkedIn
                              </a>
                            )}
                            {profile.companySocial.twitter && (
                              <a
                                href={profile.companySocial.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                              >
                                <FiTwitter /> Twitter / X
                              </a>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        {profile?.companyDescription ? (
                          <div className="mt-6 rounded-2xl border border-slate-100 bg-[#f9faf8] p-5">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">About</p>
                            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{profile.companyDescription}</p>
                          </div>
                        ) : (
                          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                            <p className="text-sm text-slate-400">No company description added yet.</p>
                            <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="mt-2 text-xs font-black text-[#e07a45] hover:underline"
                            >
                              Add one now →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Contact info card (view only) ── */}
                {!isEditing && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoCard title="Contact" items={[
                      { label: "Name", value: profile?.name },
                      { label: "Email", value: profile?.email },
                      { label: "Phone", value: profile?.phone },
                    ]} />
                    <InfoCard title="Company Stats" items={[
                      { label: "Industry", value: profile?.companyIndustry },
                      { label: "Size", value: profile?.companySize },
                      { label: "Founded", value: profile?.companyFounded ? `Est. ${profile.companyFounded}` : null },
                    ]} />
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

/* ── helpers ── */

const Section = ({ title, children }) => (
  <div>
    <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </div>
);

const Field = ({ label, name, value, onChange, placeholder, type = "text", icon }) => (
  <div>
    <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-[#17212b] placeholder-slate-300 focus:border-[#17212b] focus:outline-none ${icon ? "pl-9 pr-4" : "px-4"}`}
      />
    </div>
  </div>
);

const InfoCard = ({ title, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_14px_rgba(23,33,43,0.04)]">
    <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
    <div className="space-y-3">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-start justify-between gap-4 text-sm">
          <span className="font-bold text-slate-500">{label}</span>
          <span className="text-right font-semibold text-[#17212b]">
            {value || <span className="italic text-slate-300">Not set</span>}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CompanyProfile;

