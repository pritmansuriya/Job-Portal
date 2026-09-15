import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiBell, FiBriefcase, FiCalendar, FiChevronRight, FiClock, FiGrid, FiLogOut, FiPlus, FiSearch, FiSettings, FiUsers } from "react-icons/fi";
import { applicationsApi, authStorage, getErrorMessage, jobsApi } from "../../services/api";

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

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Shortlisted: "bg-sky-50 text-sky-700",
  Interview: "bg-violet-50 text-violet-700",
  Selected: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
};

const formatDate = (value) => {
  if (!value) return "Recently";
  const hours = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 24 ? `Applied ${hours} hour${hours === 1 ? "" : "s"} ago` : `Applied ${Math.floor(hours / 24)} day${hours < 48 ? "" : "s"} ago`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([jobsApi.list(), applicationsApi.forEmployer()])
      .then(([jobsResponse, applicationsResponse]) => {
        const userId = currentUser?._id || currentUser?.id;
        setJobs(jobsResponse.data.filter((job) => !userId || !job.createdBy || String(job.createdBy._id || job.createdBy) === String(userId)));
        setApplications(applicationsResponse.data);
      })
      .catch((requestError) => setError(getErrorMessage(requestError, "Unable to load employer activity")))
      .finally(() => setIsLoading(false));
  }, []);

  const activeJobs = jobs.filter((job) => !job.deadline || new Date(job.deadline) >= new Date()).length;
  const interviews = applications.filter((application) => application.status === "Interview").length;
  const hired = applications.filter((application) => application.status === "Selected").length;
  const companyName = currentUser?.company || currentUser?.name || "ABC Technologies";

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f3f5f2] text-[#17212b]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="hidden w-68.5 shrink-0 flex-col bg-[#17212b] px-5 py-7 text-white lg:flex">
          <Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]"><FiBriefcase /></span><span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span></Link>
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p>
          <nav className="mt-4 space-y-1.5">
            {navigation.map(([label, path, Icon]) => <Link key={label} to={path} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === "Dashboard" ? "bg-[#c5f36c] text-[#17212b]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="text-lg" /><span>{label}</span>{label === "Applications" && applications.length > 0 && <span className="ml-auto rounded-full bg-[#f4a261] px-2 py-0.5 text-[10px] font-black text-[#17212b]">{applications.length}</span>}</Link>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold text-slate-400">Need a hand?</p><p className="mt-1 text-sm leading-5 text-slate-200">Your hiring workspace is ready for its next great candidate.</p><Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">Contact support <FiArrowUpRight /></Link></div>
          <button type="button" onClick={handleLogout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"><FiLogOut /> Logout</button>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-11 lg:py-9">
          <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer dashboard</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Welcome, {companyName} 👋</h1><p className="mt-2 text-sm text-slate-500">Keep your hiring pipeline moving forward.</p></div><div className="flex items-center gap-3"><button type="button" aria-label="Search" className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#c5f36c] hover:text-[#17212b] sm:flex"><FiSearch /></button><Link to="/dashboard/employer/notifications" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#c5f36c] hover:text-[#17212b]"><FiBell /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e07a45]" /></Link><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17212b] font-black text-[#c5f36c]">{companyName.charAt(0).toUpperCase()}</div></div></header>

          <section className="mt-8 grid gap-5 xl:grid-cols-[1.55fr_1fr]"><div className="relative overflow-hidden rounded-[1.75rem] bg-[#c5f36c] p-7 sm:p-9"><div className="relative z-10 max-w-lg"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#536e28]">Hiring momentum</p><h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Build your next great team.</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#445421]">Create a clear, compelling role and bring the right people into your pipeline.</p><Link to="/dashboard/employer/post-job" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2d3b47]">Post a new job <FiArrowUpRight /></Link></div><div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border-24 border-[#e07a45]/70" /><div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full border-20 border-white/40" /></div><div className="rounded-[1.75rem] bg-[#17212b] p-7 text-white sm:p-9"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4a261] text-[#17212b]"><FiUsers /></span><span className="text-xs font-bold text-[#c5f36c]">THIS MONTH</span></div><p className="mt-9 text-sm text-slate-400">Candidate engagement</p><div className="mt-2 flex items-end gap-3"><strong className="text-5xl font-black">{applications.length ? Math.min(99, applications.length * 8 + 32) : 0}%</strong><span className="mb-1 text-sm font-bold text-[#c5f36c]">+12.4%</span></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-[#c5f36c]" /></div><p className="mt-3 text-xs text-slate-400">Based on your recent application activity</p></div></section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Active Jobs", activeJobs, FiBriefcase, "bg-[#e6f7b9] text-[#536e28]"],["Applications", applications.length, FiUsers, "bg-[#dff1fb] text-[#26789f]"],["Interviews", interviews, FiCalendar, "bg-[#e9e2f8] text-[#7052a0]"],["Hired", hired, FiUsers, "bg-[#fce7d5] text-[#b65b2d]"]].map(([label, value, Icon, iconClass]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(23,33,43,0.04)]"><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}><Icon /></span><FiChevronRight className="text-slate-300" /></div><p className="mt-5 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-black">{isLoading ? "-" : value}</p></div>)}</section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black">Recent applications</h2><p className="mt-1 text-xs text-slate-500">The latest candidates in your pipeline</p></div><Link to="/dashboard/employer/applications" className="text-xs font-black text-[#b65b2d]">View all</Link></div>{error && <p className="m-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">{error}</p>}{!error && !isLoading && applications.length === 0 && <p className="p-6 text-sm text-slate-500">No applications yet. Your next candidate will appear here.</p>}{!error && applications.length > 0 && <div className="divide-y divide-slate-100">{applications.slice(0, 4).map((application) => <div key={application._id} className="flex items-center gap-4 px-6 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17212b] text-sm font-black text-[#c5f36c]">{application.applicant?.name?.charAt(0)?.toUpperCase() || "C"}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{application.applicant?.name || "Candidate"}</p><p className="mt-1 truncate text-xs text-slate-500">{application.job?.title || "Role unavailable"} · {formatDate(application.createdAt)}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusStyles[application.status] || "bg-slate-100 text-slate-600"}`}>{application.status}</span></div>)}</div>}</div><div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Your job posts</h2><p className="mt-1 text-xs text-slate-500">Performance at a glance</p></div><Link to="/dashboard/employer/jobs" className="text-xs font-black text-[#b65b2d]">Manage</Link></div><div className="mt-6 space-y-4">{isLoading && <p className="text-sm text-slate-500">Loading jobs...</p>}{!isLoading && jobs.length === 0 && <p className="text-sm text-slate-500">You have not posted any jobs yet.</p>}{jobs.slice(0, 3).map((job) => <div key={job._id} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fce7d5] text-[#b65b2d]"><FiBriefcase /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.location || "Location flexible"}</p></div><span className="text-xs font-black text-[#17212b]">{applications.filter((application) => String(application.job?._id) === String(job._id)).length} apps</span></div>)}</div><Link to="/dashboard/employer/post-job" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-black text-slate-600 transition hover:border-[#e07a45] hover:text-[#b65b2d]"><FiPlus /> Add another job</Link></div></section>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400"><FiClock /> Last synced just now <span className="mx-1">·</span> Data updates as candidates apply</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;