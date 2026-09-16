import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiHeart,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiMic,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { FaHandPaper } from "react-icons/fa";
import JobCard from "../../components/Jobcard";
import { authStorage, getErrorMessage, jobsApi } from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authStorage.getUser();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const isJobsSection =
    location.pathname === "/dashboard/jobseeker/jobs" ||
    location.hash === "#find-jobs" ||
    new URLSearchParams(location.search).get("section") === "jobs";

  const [activeSection, setActiveSection] = useState(isJobsSection ? "jobs" : "dashboard");
  const [jobFilters, setJobFilters] = useState({
    keyword: "",
    location: "",
    jobTypes: [],
    experiences: [],
    minSalary: "",
    maxSalary: "",
    workModes: [],
    skills: [],
  });
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    if (
      location.pathname === "/dashboard/jobseeker/jobs" ||
      location.hash === "#find-jobs" ||
      new URLSearchParams(location.search).get("section") === "jobs"
    ) {
      setActiveSection("jobs");
    } else if (location.pathname === "/dashboard/jobseeker" && !location.hash) {
      setActiveSection("dashboard");
    }
  }, [location]);

  const stats = [
    { label: "Applications", value: "12", Icon: FiFileText },
    { label: "Interviews", value: "3", Icon: FiMic },
    { label: "Saved Jobs", value: "8", Icon: FiBriefcase },
    { label: "Profile", value: "80%", Icon: FiUser },
  ];

  const navItems = [
    { label: "Dashboard", path: "/dashboard/jobseeker", Icon: FiHome },
    { label: "Find Jobs", path: "/dashboard/jobseeker/jobs", Icon: FiSearch },
    { label: "Saved Jobs", path: "/dashboard/jobseeker/saved", Icon: FiHeart },
    { label: "My Applications", path: "/dashboard/jobseeker/applications", Icon: FiFileText },
    { label: "Notifications", path: "/dashboard/jobseeker/notifications", Icon: FiBell },
    { label: "My Profile", path: "/dashboard/jobseeker/profile", Icon: FiUser },
    { label: "My Resume", path: "/dashboard/jobseeker/profile/edit", Icon: FiFileText },
    { label: "Settings", path: "/dashboard/jobseeker/profile/edit", Icon: FiSettings },
  ];

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const updateJobFilter = (field, value) => {
    setJobFilters((current) => ({ ...current, [field]: value }));
  };

  const toggleJobFilter = (field, value) => {
    setJobFilters((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const handleApplyFilters = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setIsLoadingJobs(true);
    setJobsError("");
    setHasAppliedFilters(true);

    try {
      const params = {};
      if (jobFilters.keyword) params.search = jobFilters.keyword;
      if (jobFilters.location) params.location = jobFilters.location;

      const response = await jobsApi.list(params);
      const jobs = response.data.filter((job) => {
        const jobType = String(job.jobType || job.type || "").toLowerCase();
        const experience = String(job.experience || "").toLowerCase();
        const skills = (Array.isArray(job.skills) ? job.skills : []).map((skill) => skill.toLowerCase());
        const workMode = String(job.workMode || (jobType === "remote" ? "Remote" : "On-site")).toLowerCase();
        const salaryValues = String(job.salary || "").match(/[\d,.]+/g)?.map((value) => Number(value.replace(/,/g, ""))) || [];
        const salaryMin = salaryValues[0] || 0;
        const salaryMax = salaryValues[1] || salaryMin;
        const minimumSalary = Number(jobFilters.minSalary);
        const maximumSalary = Number(jobFilters.maxSalary);

        return (
          (!jobFilters.jobTypes.length || jobFilters.jobTypes.some((type) => jobType === type.toLowerCase())) &&
          (!jobFilters.experiences.length || jobFilters.experiences.some((value) => experience === value.toLowerCase())) &&
          (!jobFilters.workModes.length || jobFilters.workModes.some((value) => workMode === value.toLowerCase())) &&
          (!jobFilters.skills.length || jobFilters.skills.every((skill) => skills.includes(skill.toLowerCase()))) &&
          (!jobFilters.minSalary || salaryMax >= minimumSalary) &&
          (!jobFilters.maxSalary || salaryMin <= maximumSalary)
        );
      });

      setMatchingJobs(jobs);
    } catch (requestError) {
      setMatchingJobs([]);
      setJobsError(getErrorMessage(requestError, "Unable to load matching jobs"));
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (activeSection === "jobs" && !hasAppliedFilters) {
      handleApplyFilters();
    }
  }, [activeSection, hasAppliedFilters]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
        <p className="mt-3 text-gray-600">Please log in to view your profile and dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf4f2] text-[#132238]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="w-[290px] shrink-0 bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)]">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "J"}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Job Seeker</p>
              <h2 className="mt-1 text-xl font-bold">{currentUser?.name || "User"}</h2>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Profile</p>
            <p className="mt-2 text-sm text-slate-100">{currentUser?.email || "No email available"}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, path, Icon }) => {
              const isActive =
                (label === "Dashboard" && activeSection === "dashboard") ||
                (label === "Find Jobs" && activeSection === "jobs");

              return (
                <Link
                  key={label}
                  to={path}
                  onClick={() => {
                    if (label === "Find Jobs") {
                      setActiveSection("jobs");
                    }
                    if (label === "Dashboard") {
                      setActiveSection("dashboard");
                    }
                  }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${
                    isActive ? "bg-white/10 text-white font-semibold" : "text-slate-200"
                  }`}
                >
                  <Icon className="shrink-0 text-lg" />
                  <span>{label}</span>
                </Link>
              );
            })}

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

        <main className="flex-1 bg-[#f4f7f8] p-6 md:p-8">
          {activeSection === "jobs" && (
            <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-[0_15px_35px_rgba(19,34,56,0.08)] ring-1 ring-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">Job search</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-[#132238]">Find your next opportunity.</h1>
              <p className="mt-2 text-slate-500">Use the filters to discover roles that match your goals.</p>
            </div>
          )}

          {activeSection === "jobs" && (
          <div id="find-jobs" className="mb-8 scroll-mt-6 rounded-[2rem] bg-white p-6 shadow-[0_15px_35px_rgba(19,34,56,0.08)] ring-1 ring-slate-200">
            <form onSubmit={handleApplyFilters} className="grid gap-6 rounded-[1.5rem] bg-[#f5f7fb] p-5 lg:grid-cols-[235px_1fr]">
              <div>
                <h2 className="text-xl font-black text-[#132238]">Search Jobs</h2>
                <p className="mt-1 text-sm text-slate-500">Filter opportunities that match your goals.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <label className="text-sm font-bold text-[#132238]">
                  Keyword
                  <input value={jobFilters.keyword} onChange={(event) => updateJobFilter("keyword", event.target.value)} placeholder="React Developer" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4" />
                </label>

                <label className="text-sm font-bold text-[#132238]">
                  Location
                  <input value={jobFilters.location} onChange={(event) => updateJobFilter("location", event.target.value)} placeholder="Ahmedabad" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4" />
                </label>

                <FilterGroup title="Job Type" options={["Full Time", "Part Time", "Internship", "Contract"]} selected={jobFilters.jobTypes} onToggle={(value) => toggleJobFilter("jobTypes", value)} />
                <FilterGroup title="Experience" options={["Fresher", "1-2 Years", "3-5 Years", "5+ Years"]} selected={jobFilters.experiences} onToggle={(value) => toggleJobFilter("experiences", value)} />

                <fieldset>
                  <legend className="text-sm font-bold text-[#132238]">Salary</legend>
                  <div className="mt-2 flex gap-2">
                    <input type="number" min="0" value={jobFilters.minSalary} onChange={(event) => updateJobFilter("minSalary", event.target.value)} placeholder="Min" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-[#69d4cf] focus:ring-4" />
                    <input type="number" min="0" value={jobFilters.maxSalary} onChange={(event) => updateJobFilter("maxSalary", event.target.value)} placeholder="Max" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-[#69d4cf] focus:ring-4" />
                  </div>
                </fieldset>

                <FilterGroup title="Work Mode" options={["Remote", "Hybrid", "On-site"]} selected={jobFilters.workModes} onToggle={(value) => toggleJobFilter("workModes", value)} />
                <FilterGroup title="Skills" options={["React", "Node.js", "MongoDB", "JavaScript"]} selected={jobFilters.skills} onToggle={(value) => toggleJobFilter("skills", value)} />

                <button type="submit" className="self-end rounded-xl bg-[#132238] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0d9f9a]">Apply Filters</button>
              </div>
            </form>

            {hasAppliedFilters && (
              <section className="mt-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#132238]">Matching Jobs</h2>
                    {!isLoadingJobs && !jobsError && <p className="mt-1 text-sm text-slate-500">{matchingJobs.length} jobs match your filters.</p>}
                  </div>
                </div>

                {isLoadingJobs && <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500">Finding matching jobs...</p>}
                {jobsError && <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">{jobsError}</p>}
                {!isLoadingJobs && !jobsError && matchingJobs.length === 0 && (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-500">No jobs match these filters. Try changing your search criteria.</p>
                )}
                {!isLoadingJobs && !jobsError && matchingJobs.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {matchingJobs.map((job) => <JobCard key={job._id} job={job} />)}
                  </div>
                )}
              </section>
            )}
          </div>
          )}

          {activeSection === "dashboard" && (
          <>
          <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-[0_15px_35px_rgba(19,34,56,0.08)] ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="flex items-center gap-2 text-3xl font-bold text-[#132238]">Good Morning, {currentUser?.name?.split(" ")[0] || "John"} <FaHandPaper className="text-[#e07a45]" /></p>
                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#132238]">Find your next opportunity.</h1>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, Icon }) => (
              <div key={label} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_12px_25px_rgba(19,34,56,0.05)]">
                <div className="flex items-center justify-between">
                  <Icon className="text-2xl text-[#0d9f9a]" />
                  <span className="rounded-full bg-[#e8f9f8] px-2 py-1 text-xs font-semibold text-[#0d9f9a]">Live</span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
                <h2 className="mt-3 text-[2rem] font-black leading-none text-[#132238]">{value}</h2>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_12px_25px_rgba(19,34,56,0.05)] ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#132238]">Recommended Jobs</h2>
              <button
                type="button"
                onClick={() => {
                  setActiveSection("jobs");
                  navigate("/dashboard/jobseeker/jobs");
                }}
                className="text-sm font-semibold text-[#0d9f9a] hover:underline"
              >
                Search again
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-[#f9fbfd] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#132238]">Frontend Developer</h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">ABC Technologies</p>
                </div>

                <button type="button" aria-label="Save job" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  <FiHeart />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5"><FiMapPin className="text-[#0d9f9a]" /> Ahmedabad</span>
                <span className="inline-flex items-center gap-1.5"><FiDollarSign className="text-[#0d9f9a]" /> ₹5 - ₹8 LPA</span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <div className="flex gap-2">
                  <span className="rounded-full bg-[#e6f7f5] px-3 py-1 text-xs font-semibold text-[#0d9f9a]">React</span>
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6ef7]">JavaScript</span>
                </div>

                <button type="button" className="rounded-xl bg-[#132238] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d3354]">
                  View Job
                </button>
              </div>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, options, selected, onToggle }) => (
  <fieldset>
    <legend className="text-sm font-bold text-[#132238]">{title}</legend>
    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="h-4 w-4 accent-[#0d9f9a]" />
          {option}
        </label>
      ))}
    </div>
  </fieldset>
);

export default Dashboard;