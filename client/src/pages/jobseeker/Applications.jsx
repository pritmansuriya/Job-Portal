import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheck,
  FiCircle,
  FiFileText,
  FiHeart,
  FiHome,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { applicationsApi, authStorage, getErrorMessage } from "../../services/api";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Interview: "bg-violet-100 text-violet-700",
  Selected: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const Applications = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    applicationsApi.mine()
      .then((response) => {
        setApplications(response.data);
        setSelectedApplication(response.data[0] || null);
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError, "Unable to load your applications"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    ["Dashboard", "/dashboard/jobseeker", FiHome],
    ["Find Jobs", "/dashboard/jobseeker/jobs", FiSearch],
    ["Saved Jobs", "/dashboard/jobseeker/saved", FiHeart],
    ["My Applications", "/dashboard/jobseeker/applications", FiFileText],
    ["Notifications", "/dashboard/jobseeker/notifications", FiBell],
    ["My Profile", "/dashboard/jobseeker/profile", FiUser],
    ["My Resume", "/dashboard/jobseeker/profile/edit", FiFileText],
    ["Settings", "/dashboard/jobseeker/profile/edit", FiSettings],
  ];

  return (
    <div className="min-h-screen bg-[#eaf4f2] text-[#132238]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[290px] shrink-0 bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">{currentUser?.name?.charAt(0)?.toUpperCase() || "J"}</div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Job Seeker</p><h2 className="mt-1 text-xl font-bold">{currentUser?.name || "User"}</h2></div>
          </div>
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-300">Profile</p><p className="mt-2 text-sm text-slate-100">{currentUser?.email || "No email available"}</p></div>
          <nav className="space-y-2">
            {navItems.map(([label, path, Icon]) => <Link key={label} to={path} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${label === "My Applications" ? "bg-white/10 text-white" : "text-slate-200"}`}><Icon className="shrink-0 text-lg" /><span>{label}</span></Link>)}
            <button type="button" onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"><FiLogOut className="shrink-0 text-lg" /><span>Logout</span></button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">Job seeker portal</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">My Applications</h1>
          <p className="mt-2 text-slate-500">Track every application and follow your progress.</p>
        </div>

        {isLoading && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading applications...</p>}
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">{error}</p>}
        {!isLoading && !error && applications.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">You have not submitted any applications yet.</div>
        )}

        {!isLoading && !error && applications.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_25px_rgba(19,34,56,0.06)]">
              <div className="border-b border-slate-200 px-6 py-5"><h2 className="text-xl font-black">Submitted Applications</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead className="bg-[#f5f7fb] text-sm text-slate-500"><tr><th className="px-6 py-4 font-semibold">Job</th><th className="px-6 py-4 font-semibold">Company</th><th className="px-6 py-4 font-semibold">Status</th></tr></thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application._id} onClick={() => setSelectedApplication(application)} className={`cursor-pointer border-t border-slate-100 transition hover:bg-[#f6fbfa] ${selectedApplication?._id === application._id ? "bg-[#eef8f6]" : ""}`}>
                        <td className="px-6 py-5 font-bold text-[#132238]">{application.job?.title || "Job unavailable"}</td>
                        <td className="px-6 py-5 text-slate-600">{application.job?.company || "Unknown company"}</td>
                        <td className="px-6 py-5"><StatusBadge status={application.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {selectedApplication && <ApplicationDetails application={selectedApplication} />}
          </div>
        )}
      </div>
        </main>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>
    <FiCircle className={`fill-current ${status === "Selected" ? "text-emerald-500" : status === "Rejected" ? "text-red-500" : "text-amber-500"}`} />
    {status === "Selected" ? "Accepted" : status === "Rejected" ? "Reject" : status}
  </span>
);

const ApplicationDetails = ({ application }) => {
  const job = application.job || {};
  const appliedDate = application.createdAt ? new Date(application.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Date unavailable";
  const currentStep = application.status === "Selected" ? 4 : application.status === "Interview" ? 3 : application.status === "Shortlisted" ? 2 : 1;
  const steps = ["Applied", "Reviewed", "Interview", "Accepted"];

  return (
    <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_25px_rgba(19,34,56,0.06)] md:p-7">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d9f9a]">Application Details</p>
      <h2 className="mt-3 text-2xl font-black text-[#132238]">{job.title || "Job unavailable"}</h2>
      <p className="mt-1 font-semibold text-slate-500">{job.company || "Unknown company"}</p>
      <p className="mt-4 text-sm text-slate-500">Applied: {appliedDate}</p>

      <div className="mt-7"><p className="text-sm font-bold text-[#132238]">Status</p><div className="mt-5 space-y-4">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          return <div key={step} className="flex items-center gap-3 text-sm"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${isComplete ? "bg-[#0d9f9a] text-white" : "bg-slate-100 text-slate-400"}`}>{isComplete ? <FiCheck /> : index + 1}</span><span className={isComplete ? "font-bold text-[#132238]" : "text-slate-400"}>{step}</span></div>;
        })}
      </div>{application.status === "Rejected" && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">This application was rejected.</p>}</div>

      <div className="mt-8 border-t border-slate-200 pt-6"><h3 className="text-lg font-black">Cover Letter</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{application.coverLetter || "No cover letter was submitted."}</p></div>
      <div className="mt-6"><h3 className="text-lg font-black">Resume</h3><button type="button" className="mt-3 rounded-xl border border-[#0d9f9a] px-4 py-2.5 text-sm font-bold text-[#087b78] transition hover:bg-[#e8f9f8]">View Resume{application.resume ? ` (${application.resume})` : ""}</button></div>
    </aside>
  );
};

export default Applications;