import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiBell, FiBriefcase, FiCalendar, FiEdit3, FiEye, FiGrid, FiLogOut, FiPlus, FiSettings, FiTrash2, FiUsers } from "react-icons/fi";
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

const MyJobs = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [closingId, setClosingId] = useState("");

  useEffect(() => {
    Promise.all([jobsApi.list(), applicationsApi.forEmployer()])
      .then(([jobsResponse, applicationsResponse]) => {
        const userId = currentUser?._id || currentUser?.id;
        const employerJobs = jobsResponse.data.filter((job) => !userId || !job.createdBy || String(job.createdBy._id || job.createdBy) === String(userId));
        setJobs(employerJobs);
        setApplications(applicationsResponse.data);
      })
      .catch((requestError) => setError(getErrorMessage(requestError, "Unable to load your jobs")))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => { authStorage.clear(); navigate("/login"); window.location.reload(); };

  const closeJob = async (job) => {
    if (!window.confirm(`Close ${job.title}? This will remove the job post.`)) return;
    setClosingId(job._id);
    try {
      await jobsApi.remove(job._id);
      setJobs((current) => current.filter((item) => item._id !== job._id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to close this job"));
    } finally {
      setClosingId("");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f2] text-[#17212b]"><div className="mx-auto flex h-screen max-w-[1680px] overflow-hidden">
      <aside className="hidden w-68.5 shrink-0 flex-col overflow-y-auto bg-[#17212b] px-5 py-7 text-white lg:flex"><Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]"><FiBriefcase /></span><span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span></Link><p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p><nav className="mt-4 space-y-1.5">{navigation.map(([label, path, Icon]) => <Link key={label} to={path} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === "My Jobs" ? "bg-[#c5f36c] text-[#17212b]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="text-lg" /><span>{label}</span></Link>)}</nav><div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold text-slate-400">Need a hand?</p><p className="mt-1 text-sm leading-5 text-slate-200">Keep your best roles visible to the right candidates.</p><Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">Contact support <FiArrowUpRight /></Link></div><button type="button" onClick={handleLogout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"><FiLogOut /> Logout</button></aside>
      <main className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-11 lg:py-9"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer workspace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">My Jobs</h1><p className="mt-2 text-sm text-slate-500">Manage every role your company has opened.</p></div><Link to="/dashboard/employer/post-job" className="inline-flex items-center gap-2 self-start rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] md:self-auto"><FiPlus /> Post New Job</Link></header>
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">{error}</p>}
        {isLoading && <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading your jobs...</p>}
        {!isLoading && !error && jobs.length === 0 && <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center"><FiBriefcase className="mx-auto text-3xl text-[#e07a45]" /><h2 className="mt-4 text-xl font-black">No jobs posted yet</h2><p className="mt-2 text-sm text-slate-500">Create your first role and start building your candidate pipeline.</p><Link to="/dashboard/employer/post-job" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c5f36c] px-5 py-3 text-sm font-black text-[#17212b]">Post a Job <FiArrowUpRight /></Link></div>}
        {!isLoading && jobs.length > 0 && <div className="mt-8 space-y-4">{jobs.map((job) => { const applicationCount = applications.filter((application) => String(application.job?._id || application.job) === String(job._id)).length; return <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(23,33,43,0.04)] transition hover:shadow-[0_14px_28px_rgba(23,33,43,0.08)] sm:p-7"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f7b9] text-[#536e28]"><FiBriefcase /></span><div className="min-w-0"><h2 className="truncate text-xl font-black sm:text-2xl">{job.title}</h2><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500"><span className="font-semibold">{applicationCount} Applications</span>{job.location && <span>{job.location}</span>}{job.jobType && <span>{job.jobType}</span>}</div></div></div><div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 lg:border-0 lg:pt-0"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">Active</span><Link to={`/jobs/${job._id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#e07a45] hover:text-[#b65b2d]"><FiEye /> View</Link><Link to={`/dashboard/employer/post-job?edit=${job._id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#e07a45] hover:text-[#b65b2d]"><FiEdit3 /> Edit</Link><Link to="/dashboard/employer/applications" className="inline-flex items-center gap-2 rounded-lg bg-[#17212b] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#2d3b47]"><FiUsers /> Applications</Link><button type="button" onClick={() => closeJob(job)} disabled={closingId === job._id} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"><FiTrash2 /> {closingId === job._id ? "Closing..." : "Close"}</button></div></div></article>; })}</div>}
      </div></main>
    </div></div>
  );
};

export default MyJobs;
