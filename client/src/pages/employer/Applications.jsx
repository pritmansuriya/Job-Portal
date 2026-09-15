import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiBell, FiBriefcase, FiCalendar, FiCheck, FiEye, FiGrid, FiLogOut, FiPlus, FiSettings, FiUsers, FiX } from "react-icons/fi";
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

const filters = ["All", "Pending", "Shortlisted", "Interview", "Selected", "Rejected"];
const statusStyles = { Pending: "bg-amber-50 text-amber-700", Shortlisted: "bg-sky-50 text-sky-700", Interview: "bg-violet-50 text-violet-700", Selected: "bg-emerald-50 text-emerald-700", Rejected: "bg-rose-50 text-rose-700" };

const relativeTime = (value) => {
  if (!value) return "Recently";
  const hours = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 24 ? `Applied ${hours} hour${hours === 1 ? "" : "s"} ago` : `Applied ${Math.floor(hours / 24)} day${hours < 48 ? "" : "s"} ago`;
};

const Applications = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    applicationsApi.forEmployer()
      .then((response) => setApplications(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError, "Unable to load applications")))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleApplications = useMemo(() => activeFilter === "All" ? applications : applications.filter((application) => application.status === activeFilter), [activeFilter, applications]);

  const updateStatus = async (application, status) => {
    setUpdatingId(application._id);
    setError("");
    try {
      const response = await applicationsApi.updateStatus(application._id, status);
      setApplications((current) => current.map((item) => item._id === application._id ? { ...item, status: response.data.application?.status || status } : item));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update application status"));
    } finally {
      setUpdatingId("");
    }
  };

  const handleLogout = () => { authStorage.clear(); navigate("/login"); window.location.reload(); };

  return (
    <div className="min-h-screen bg-[#f3f5f2] text-[#17212b]"><div className="mx-auto flex min-h-screen max-w-[1680px]">
      <aside className="hidden w-68.5 shrink-0 flex-col bg-[#17212b] px-5 py-7 text-white lg:flex"><Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]"><FiBriefcase /></span><span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span></Link><p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p><nav className="mt-4 space-y-1.5">{navigation.map(([label, path, Icon]) => <Link key={label} to={path} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === "Applications" ? "bg-[#c5f36c] text-[#17212b]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="text-lg" /><span>{label}</span>{label === "Applications" && applications.length > 0 && <span className="ml-auto rounded-full bg-[#f4a261] px-2 py-0.5 text-[10px] font-black text-[#17212b]">{applications.length}</span>}</Link>)}</nav><div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold text-slate-400">Hiring inbox</p><p className="mt-1 text-sm leading-5 text-slate-200">Review every candidate with clarity and speed.</p><Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">Contact support <FiArrowUpRight /></Link></div><button type="button" onClick={handleLogout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"><FiLogOut /> Logout</button></aside>
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-11 lg:py-9"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer workspace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Applications</h1><p className="mt-2 text-sm text-slate-500">Find the people who can make your next role count.</p></div><Link to="/dashboard/employer/post-job" className="inline-flex items-center gap-2 self-start rounded-xl bg-[#17212b] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] md:self-auto"><FiPlus /> Post New Job</Link></header>
        <div className="mt-8 flex flex-wrap gap-2">{filters.map((filter) => <button type="button" key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full border px-4 py-2 text-sm font-black transition ${activeFilter === filter ? "border-[#17212b] bg-[#17212b] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-[#e07a45] hover:text-[#b65b2d]"}`}>{filter}{filter !== "All" && <span className="ml-2 opacity-60">{applications.filter((application) => application.status === filter).length}</span>}</button>)}</div>
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">{error}</p>}
        {isLoading && <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading applications...</p>}
        {!isLoading && !error && visibleApplications.length === 0 && <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center"><FiUsers className="mx-auto text-3xl text-[#e07a45]" /><h2 className="mt-4 text-xl font-black">No {activeFilter === "All" ? "applications" : activeFilter.toLowerCase() + " applications"} yet</h2><p className="mt-2 text-sm text-slate-500">New candidates will appear here when they apply to your jobs.</p></div>}
        {!isLoading && visibleApplications.length > 0 && <div className="mt-6 space-y-4">{visibleApplications.map((application) => { const candidate = application.applicant || {}; const skills = candidate.skills?.length ? candidate.skills : ["Skills not added"]; return <article key={application._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(23,33,43,0.04)] transition hover:shadow-[0_14px_28px_rgba(23,33,43,0.08)]"><div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"><div className="flex min-w-0 gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#17212b] text-lg font-black text-[#c5f36c]">{candidate.name?.charAt(0)?.toUpperCase() || "C"}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-black">{candidate.name || "Candidate"}</h2><span className={`rounded-full px-3 py-1 text-[10px] font-black ${statusStyles[application.status] || "bg-slate-100 text-slate-600"}`}>{application.status}</span></div><p className="mt-1 text-sm font-semibold text-[#b65b2d]">{application.job?.title || "Role unavailable"}</p><p className="mt-2 text-xs text-slate-400">{relativeTime(application.createdAt)}</p><div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><p><strong className="font-black text-[#17212b]">Experience:</strong> {candidate.experience || "Not specified"}</p><p className="sm:col-span-2"><strong className="font-black text-[#17212b]">Skills:</strong> {skills.join(", ")}</p></div></div></div><div className="flex flex-wrap gap-2 lg:max-w-[340px] lg:justify-end"><button type="button" onClick={() => setSelectedCandidate(application)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#e07a45] hover:text-[#b65b2d]"><FiEye /> View Profile</button><button type="button" onClick={() => setSelectedCandidate({ ...application, resumeOnly: true })} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#e07a45] hover:text-[#b65b2d]"><FiBriefcase /> View Resume</button>{application.status === "Pending" && <><button type="button" disabled={updatingId === application._id} onClick={() => updateStatus(application, "Shortlisted")} className="inline-flex items-center gap-2 rounded-lg bg-[#17212b] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#2d3b47] disabled:opacity-50"><FiCheck /> Shortlist</button><button type="button" disabled={updatingId === application._id} onClick={() => updateStatus(application, "Rejected")} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"><FiX /> Reject</button></>}</div></div></article>; })}</div>}
        {selectedCandidate && <CandidatePanel application={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
      </div></main>
    </div></div>
  );
};

const CandidatePanel = ({ application, onClose }) => { if (!application) return null; const candidate = application.applicant || {}; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17212b]/60 p-5" onClick={onClose}><aside className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e07a45]">Candidate profile</p><h2 className="mt-2 text-2xl font-black">{candidate.name || "Candidate"}</h2><p className="mt-1 text-sm text-slate-500">{candidate.email || "No email available"}</p></div><button type="button" aria-label="Close profile" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><FiX /></button></div><div className="mt-7 space-y-4 text-sm text-slate-600"><p><strong className="text-[#17212b]">Job title:</strong> {candidate.jobTitle || application.job?.title || "Not specified"}</p><p><strong className="text-[#17212b]">Experience:</strong> {candidate.experience || "Not specified"}</p><p><strong className="text-[#17212b]">Location:</strong> {candidate.location || "Not specified"}</p><p><strong className="text-[#17212b]">Skills:</strong> {candidate.skills?.join(", ") || "Not specified"}</p>{application.resumeOnly ? <p className="rounded-xl bg-[#fce7d5] p-4 font-semibold text-[#b65b2d]">Resume: {candidate.resume || application.resume || "No resume attached"}</p> : <p className="whitespace-pre-line leading-6"><strong className="text-[#17212b]">Cover letter:</strong><br />{application.coverLetter || "No cover letter submitted."}</p>}</div></aside></div>; };

export default Applications;
