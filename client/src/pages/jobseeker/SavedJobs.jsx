import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiFileText,
  FiHeart,
  FiHome,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { authStorage, getErrorMessage, usersApi } from "../../services/api";

const SavedJobs = () => {
  const navigate = useNavigate();
  const currentUser = authStorage.getUser();
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi
      .savedJobs()
      .then((response) => setSavedJobs(response.data))
      .catch((requestError) =>
        setError(getErrorMessage(requestError, "Unable to load saved jobs")),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const removeJob = async (jobId) => {
    try {
      await usersApi.removeSavedJob(jobId);
      setSavedJobs((jobs) => jobs.filter((job) => job._id !== jobId));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to remove saved job"));
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    ["Dashboard", "/dashboard/jobseeker", FiHome],
    ["Find Jobs", "/dashboard/jobseeker#find-jobs", FiSearch],
    ["Saved Jobs", "/dashboard/jobseeker/saved", FiHeart],
    ["My Applications", "/dashboard/jobseeker/applications", FiFileText],
    ["Notifications", "/dashboard/jobseeker/notifications", FiBell],
    ["My Profile", "/dashboard/jobseeker/profile", FiUser],
    ["My Resume", "/dashboard/jobseeker/profile/edit", FiFileText],
    ["Settings", "/dashboard/jobseeker/settings", FiSettings],
  ];

  return (
    <div className="min-h-screen bg-[#eaf4f2] text-[#132238]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[290px] shrink-0 bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "J"}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">
                Job Seeker
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {currentUser?.name || "User"}
              </h2>
            </div>
          </div>
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Profile
            </p>
            <p className="mt-2 text-sm text-slate-100">
              {currentUser?.email || "No email available"}
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map(([label, path, icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 hover:text-white ${label === "Saved Jobs" ? "bg-white/10 text-white" : "text-slate-200"}`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">
              Job seeker portal
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Saved Jobs
            </h1>
            <p className="mt-2 text-slate-500">
              Keep your favorite opportunities within easy reach.
            </p>
            {isLoading && (
              <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
                Loading saved jobs...
              </p>
            )}
            {error && (
              <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
                {error}
              </p>
            )}
            {!isLoading && !error && savedJobs.length === 0 && (
              <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
                You have not saved any jobs yet.
              </p>
            )}
            {!isLoading && !error && savedJobs.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {savedJobs.map((job) => (
                  <article
                    key={job._id}
                    className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_12px_25px_rgba(19,34,56,0.06)]"
                  >
                    <h2 className="text-2xl font-black">{job.title}</h2>
                    <p className="mt-2 font-bold text-[#0d9f9a]">
                      {job.company}
                    </p>
                    <p className="mt-3 text-slate-500">
                      {job.location} · {job.salary}
                    </p>
                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="rounded-xl bg-[#132238] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9f9a]"
                      >
                        View Job
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeJob(job._id)}
                        className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedJobs;
