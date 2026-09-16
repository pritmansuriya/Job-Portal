import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiExternalLink,
  FiEye,
  FiGrid,
  FiLogOut,
  FiMapPin,
  FiMail,
  FiPhone,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUsers,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { applicationsApi, authStorage, getErrorMessage } from "../../services/api";

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

const roundTypes = [
  "Initial Screening",
  "Technical Interview",
  "Live Coding / Task Review",
  "System Design",
  "HR & Culture Fit",
  "Final Managerial Round",
];

const meetingModes = [
  { label: "Google Meet", icon: FiVideo, defaultUrl: "https://meet.google.com/new" },
  { label: "Zoom Meeting", icon: FiVideo, defaultUrl: "https://zoom.us/join" },
  { label: "In-Person Office", icon: FiMapPin, defaultUrl: "" },
  { label: "Phone Call", icon: FiPhone, defaultUrl: "" },
];

const Interviews = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("interview"); // 'interview' | 'shortlisted' | 'selected' | 'all'
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copiedId, setCopiedId] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // Load schedules from localStorage
  const [schedules, setSchedules] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("employer_interview_schedules") || "{}");
    } catch {
      return {};
    }
  });

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await applicationsApi.forEmployer();
      setApplications(response.data || []);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load interview candidates"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const updateStatus = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    setError("");
    try {
      const response = await applicationsApi.updateStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: response.data.application?.status || newStatus }
            : app
        )
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update candidate status"));
    } finally {
      setUpdatingId("");
    }
  };

  const saveInterviewSchedule = async (scheduleData) => {
    if (!schedulingApp) return;

    const appId = schedulingApp._id;
    const updatedSchedules = {
      ...schedules,
      [appId]: {
        ...scheduleData,
        scheduledAt: new Date().toISOString(),
      },
    };

    setSchedules(updatedSchedules);
    try {
      localStorage.setItem("employer_interview_schedules", JSON.stringify(updatedSchedules));
    } catch (err) {
      console.error("Failed saving schedule to localStorage", err);
    }

    // Also transition application status to Interview if not already
    if (schedulingApp.status !== "Interview") {
      await updateStatus(appId, "Interview");
    }

    setSchedulingApp(null);
  };

  const copyLink = (link, id) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Filtered applications
  const interviewList = useMemo(
    () => applications.filter((app) => app.status === "Interview"),
    [applications]
  );
  const shortlistedList = useMemo(
    () => applications.filter((app) => app.status === "Shortlisted"),
    [applications]
  );
  const selectedList = useMemo(
    () => applications.filter((app) => app.status === "Selected"),
    [applications]
  );

  const displayedApplications = useMemo(() => {
    let list = applications;
    if (activeTab === "interview") list = interviewList;
    else if (activeTab === "shortlisted") list = shortlistedList;
    else if (activeTab === "selected") list = selectedList;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter((app) => {
      const name = app.applicant?.name?.toLowerCase() || "";
      const role = app.job?.title?.toLowerCase() || "";
      const email = app.applicant?.email?.toLowerCase() || "";
      const skills = (app.applicant?.skills || []).map((s) => s.toLowerCase()).join(" ");
      return name.includes(query) || role.includes(query) || email.includes(query) || skills.includes(query);
    });
  }, [applications, activeTab, interviewList, shortlistedList, selectedList, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f3f5f2] text-[#17212b]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        {/* Sidebar */}
        <aside className="hidden w-68.5 shrink-0 flex-col bg-[#17212b] px-5 py-7 text-white lg:flex">
          <Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]">
              <FiBriefcase />
            </span>
            <span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span>
          </Link>

          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p>

          <nav className="mt-4 space-y-1.5">
            {navigation.map(([label, path, Icon]) => {
              const isActive = label === "Interviews";
              return (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-[#c5f36c] text-[#17212b]" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{label}</span>
                  {label === "Interviews" && interviewList.length > 0 && (
                    <span className="ml-auto rounded-full bg-[#17212b] px-2 py-0.5 text-[10px] font-black text-[#c5f36c]">
                      {interviewList.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold text-slate-400">Interview Hub</p>
            <p className="mt-1 text-sm leading-5 text-slate-200">
              Run timely interviews, keep candidate feedback in one place, and make offers faster.
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

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-11 lg:py-9">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Recruitment Pipeline</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Interviews</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Schedule, coordinate, and review upcoming rounds with your candidates.
                </p>
              </div>

              <Link
                to="/dashboard/employer/applications"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] md:self-auto"
              >
                <FiUsers /> View All Candidates
              </Link>
            </header>

            {/* Metric Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_16px_rgba(23,33,43,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">In Interview</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <FiCalendar />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-[#17212b]">{interviewList.length}</p>
                <p className="mt-1 text-xs text-slate-500">Active interview rounds</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_16px_rgba(23,33,43,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Ready to Schedule</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                    <FiClock />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-[#17212b]">{shortlistedList.length}</p>
                <p className="mt-1 text-xs text-slate-500">Shortlisted candidates</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_16px_rgba(23,33,43,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Offers / Selected</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FiCheck />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-[#17212b]">{selectedList.length}</p>
                <p className="mt-1 text-xs text-slate-500">Hired from interviews</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_16px_rgba(23,33,43,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Pipeline</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6f7b9] text-[#536e28]">
                    <FiBriefcase />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-[#17212b]">{applications.length}</p>
                <p className="mt-1 text-xs text-slate-500">Across all job postings</p>
              </div>
            </div>

            {/* Tabs and Search Bar */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("interview")}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeTab === "interview"
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#e07a45]"
                  }`}
                >
                  Scheduled Interviews
                  <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                    {interviewList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("shortlisted")}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeTab === "shortlisted"
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#e07a45]"
                  }`}
                >
                  Ready to Schedule
                  <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
                    {shortlistedList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("selected")}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeTab === "selected"
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#e07a45]"
                  }`}
                >
                  Offers / Hired
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    {selectedList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeTab === "all"
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#e07a45]"
                  }`}
                >
                  All Candidates
                  <span className="ml-2 opacity-60">{applications.length}</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate, role, skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">
                {error}
              </p>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="text-base font-bold">Loading candidate interviews...</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && displayedApplications.length === 0 && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f7b9] text-2xl text-[#536e28]">
                  <FiCalendar />
                </div>
                <h2 className="mt-4 text-2xl font-black">
                  {activeTab === "interview"
                    ? "No interviews scheduled yet"
                    : activeTab === "shortlisted"
                    ? "No shortlisted candidates ready to schedule"
                    : "No matching candidates found"}
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                  {activeTab === "interview"
                    ? "Candidates you move to the interview stage will be organized here with meeting links, times, and round details."
                    : "Check your applications list to review and shortlist incoming applicants."}
                </p>

                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    to="/dashboard/employer/applications"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2d3b47]"
                  >
                    Go to Applications <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            )}

            {/* Interview Cards List */}
            {!isLoading && displayedApplications.length > 0 && (
              <div className="mt-6 space-y-4">
                {displayedApplications.map((application) => {
                  const candidate = application.applicant || {};
                  const job = application.job || {};
                  const schedule = schedules[application._id] || {};
                  const isScheduled = Boolean(schedule.date);
                  const isBusy = updatingId === application._id;

                  return (
                    <article
                      key={application._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(23,33,43,0.04)] transition hover:shadow-[0_12px_28px_rgba(23,33,43,0.08)] sm:p-7"
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Candidate Info */}
                        <div className="flex min-w-0 items-start gap-4">
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#17212b] text-xl font-black text-[#c5f36c] shadow-[3px_3px_0_#f4a261]">
                            {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-xl font-black sm:text-2xl">{candidate.name || "Candidate"}</h2>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  application.status === "Interview"
                                    ? "bg-violet-100 text-violet-800"
                                    : application.status === "Selected"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : application.status === "Shortlisted"
                                    ? "bg-sky-100 text-sky-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {application.status}
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-bold text-[#b65b2d]">
                              Applying for: {job.title || "Position unavailable"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                              {candidate.email && (
                                <span className="flex items-center gap-1.5">
                                  <FiMail className="text-[#0d9f9a]" /> {candidate.email}
                                </span>
                              )}
                              {candidate.phone && (
                                <span className="flex items-center gap-1.5">
                                  <FiPhone className="text-[#0d9f9a]" /> {candidate.phone}
                                </span>
                              )}
                              {candidate.location && (
                                <span className="flex items-center gap-1.5">
                                  <FiMapPin className="text-[#0d9f9a]" /> {candidate.location}
                                </span>
                              )}
                              {candidate.experience && (
                                <span className="flex items-center gap-1.5">
                                  <FiBriefcase className="text-[#0d9f9a]" /> {candidate.experience} exp
                                </span>
                              )}
                            </div>

                            {/* Skills */}
                            {candidate.skills && candidate.skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {candidate.skills.slice(0, 5).map((skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Schedule Details Box */}
                            <div className="mt-4 rounded-xl border border-slate-100 bg-[#fbfcfb] p-4 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                <span className="font-black text-[#17212b]">
                                  {schedule.round || "Interview Round"}
                                </span>
                                <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 font-bold text-slate-700">
                                  {schedule.mode || "Google Meet"}
                                </span>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-4 text-slate-600">
                                <span className="flex items-center gap-1 font-semibold">
                                  <FiCalendar className="text-[#e07a45]" />
                                  {schedule.date
                                    ? new Date(`${schedule.date}T${schedule.time || "00:00"}`).toLocaleDateString(
                                        undefined,
                                        {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )
                                    : "Date to be confirmed"}
                                </span>

                                {schedule.time && (
                                  <span className="flex items-center gap-1 font-semibold">
                                    <FiClock className="text-[#e07a45]" />
                                    {schedule.time}
                                  </span>
                                )}

                                {schedule.meetingLink && (
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={
                                        schedule.meetingLink.startsWith("http")
                                          ? schedule.meetingLink
                                          : `https://${schedule.meetingLink}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 font-bold text-[#0d9f9a] hover:underline"
                                    >
                                      <FiExternalLink /> Meeting link
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() => copyLink(schedule.meetingLink, application._id)}
                                      className="rounded p-1 text-slate-400 hover:text-slate-700"
                                      title="Copy meeting link"
                                    >
                                      <FiCopy />
                                    </button>
                                    {copiedId === application._id && (
                                      <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {schedule.notes && (
                                <p className="mt-2 text-slate-500 italic">Note: {schedule.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 lg:max-w-[320px] lg:flex-col lg:items-end">
                          {/* Schedule / Reschedule */}
                          <button
                            type="button"
                            onClick={() => setSchedulingApp(application)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17212b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2d3b47]"
                          >
                            <FiCalendar /> {isScheduled ? "Reschedule Round" : "Schedule Interview"}
                          </button>

                          {/* Quick Join Call */}
                          {schedule.meetingLink && (
                            <a
                              href={
                                schedule.meetingLink.startsWith("http")
                                  ? schedule.meetingLink
                                  : `https://${schedule.meetingLink}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
                            >
                              <FiVideo /> Join Interview Call
                            </a>
                          )}

                          <div className="flex w-full gap-2">
                            {/* View Profile */}
                            <button
                              type="button"
                              onClick={() => setSelectedCandidate(application)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#e07a45] hover:text-[#b65b2d]"
                            >
                              <FiEye /> Profile
                            </button>

                            {/* Offer / Hire */}
                            {application.status !== "Selected" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Select ${candidate.name || "this candidate"} and extend an offer?`
                                    )
                                  ) {
                                    updateStatus(application._id, "Selected");
                                  }
                                }}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                <FiCheck /> Hire
                              </button>
                            )}
                          </div>

                          {/* Reject Option */}
                          {application.status !== "Rejected" && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Reject application from ${candidate.name || "this candidate"}?`
                                  )
                                ) {
                                  updateStatus(application._id, "Rejected");
                                }
                              }}
                              className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline pt-1"
                            >
                              Decline Candidate
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Schedule Interview Modal */}
      {schedulingApp && (
        <ScheduleModal
          application={schedulingApp}
          initialSchedule={schedules[schedulingApp._id] || {}}
          onClose={() => setSchedulingApp(null)}
          onSave={saveInterviewSchedule}
        />
      )}

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <CandidateModal
          application={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

// ==========================================
// Schedule Interview Modal
// ==========================================
const ScheduleModal = ({ application, initialSchedule, onClose, onSave }) => {
  const candidate = application.applicant || {};
  const job = application.job || {};

  const [date, setDate] = useState(initialSchedule.date || "");
  const [time, setTime] = useState(initialSchedule.time || "10:30");
  const [round, setRound] = useState(initialSchedule.round || "Technical Interview");
  const [mode, setMode] = useState(initialSchedule.mode || "Google Meet");
  const [meetingLink, setMeetingLink] = useState(
    initialSchedule.meetingLink || "https://meet.google.com/new"
  );
  const [notes, setNotes] = useState(initialSchedule.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode.label);
    if (!meetingLink || meetingLink === "https://meet.google.com/new" || meetingLink === "https://zoom.us/join") {
      setMeetingLink(selectedMode.defaultUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      date,
      time,
      round,
      mode,
      meetingLink,
      notes,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17212b]/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e07a45]">Interview Scheduler</p>
            <h2 className="mt-1 text-2xl font-black text-[#17212b]">
              {candidate.name || "Candidate"}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">{job.title || "Applied Role"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Round Type */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Interview Round</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
            >
              {roundTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
              />
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Meeting Format</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {meetingModes.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => handleModeSelect(item)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                    mode === item.label
                      ? "border-[#17212b] bg-[#17212b] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Link / Location */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              {mode === "In-Person Office" ? "Office Location" : "Meeting Link / Phone"}
            </label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder={
                mode === "In-Person Office"
                  ? "e.g. 4th Floor, Tech Hub, Ahmedabad"
                  : "https://meet.google.com/..."
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Preparation Notes / Topics (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring a portfolio or be prepared for live coding..."
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-6 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:bg-[#2d3b47] disabled:opacity-60"
            >
              <FiCheck /> Confirm Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Candidate Profile Modal
// ==========================================
const CandidateModal = ({ application, onClose }) => {
  if (!application) return null;
  const candidate = application.applicant || {};
  const job = application.job || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17212b]/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <aside
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17212b] text-xl font-black text-[#c5f36c]">
              {candidate.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e07a45]">Candidate Details</p>
              <h2 className="text-2xl font-black text-[#17212b]">{candidate.name || "Candidate"}</h2>
              <p className="text-xs text-slate-500 font-semibold">{candidate.jobTitle || job.title || "Applicant"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm text-slate-700">
          <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4">
            <p>
              <strong className="block text-xs font-black uppercase tracking-wider text-slate-400">Email</strong>
              <span className="font-semibold">{candidate.email || "Not specified"}</span>
            </p>
            <p>
              <strong className="block text-xs font-black uppercase tracking-wider text-slate-400">Phone</strong>
              <span className="font-semibold">{candidate.phone || "Not specified"}</span>
            </p>
            <p>
              <strong className="block text-xs font-black uppercase tracking-wider text-slate-400">Location</strong>
              <span className="font-semibold">{candidate.location || "Not specified"}</span>
            </p>
            <p>
              <strong className="block text-xs font-black uppercase tracking-wider text-slate-400">Experience</strong>
              <span className="font-semibold">{candidate.experience || "Not specified"}</span>
            </p>
          </div>

          {candidate.bio && (
            <div>
              <h3 className="font-black text-[#17212b]">Bio / Summary</h3>
              <p className="mt-1 leading-relaxed text-slate-600">{candidate.bio}</p>
            </div>
          )}

          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="font-black text-[#17212b]">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#e0f5f2] px-3 py-1 text-xs font-bold text-[#087b78]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.education && (
            <div>
              <h3 className="font-black text-[#17212b]">Education</h3>
              <p className="mt-1 text-slate-600">{candidate.education}</p>
            </div>
          )}

          {application.coverLetter && (
            <div>
              <h3 className="font-black text-[#17212b]">Cover Letter</h3>
              <p className="mt-1 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                {application.coverLetter}
              </p>
            </div>
          )}

          {(application.resume || candidate.resume) && (
            <div>
              <h3 className="font-black text-[#17212b]">Resume</h3>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold truncate">
                  {application.resume || candidate.resume}
                </span>
                {candidate.resume && candidate.resume.startsWith("http") && (
                  <a
                    href={candidate.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#17212b] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    View File
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#17212b] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#2d3b47]"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Interviews;
