import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/Jobcard";
import { getErrorMessage, jobsApi } from "../services/api";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const [filters, setFilters] = useState({
    keyword: initialSearch,
    location: initialLocation,
    jobTypes: [],
    experiences: [],
    minSalary: "",
    maxSalary: "",
    workModes: [],
    skills: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: initialSearch,
    location: initialLocation,
    jobTypes: [],
    experiences: [],
    minSalary: "",
    maxSalary: "",
    workModes: [],
    skills: [],
  });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (appliedFilters.keyword) params.search = appliedFilters.keyword;
        if (appliedFilters.location) params.location = appliedFilters.location;
        if (appliedFilters.jobTypes.length === 1) params.jobType = appliedFilters.jobTypes[0];
        const response = await jobsApi.list(params);
        setJobs(response.data);
        setError("");
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load jobs"));
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [appliedFilters]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const toggleFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const getSalaryRange = (salary) => {
    const values = String(salary || "").match(/[\d,.]+/g)?.map((value) => Number(value.replace(/,/g, ""))) || [];
    return { min: values[0] || 0, max: values[1] || values[0] || 0 };
  };

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const salaryRange = getSalaryRange(job.salary);
    const jobExperience = String(job.experience || "").toLowerCase();
    const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map((skill) => skill.toLowerCase());
    const jobType = String(job.jobType || job.type || "").toLowerCase();
    const workMode = String(job.workMode || (jobType === "remote" ? "Remote" : "On-site")).toLowerCase();

    const matchesExperience = !appliedFilters.experiences.length || appliedFilters.experiences.some((experience) => {
      const selected = experience.toLowerCase();
      return jobExperience === selected || jobExperience.includes(selected.replace(" years", ""));
    });
    const matchesWorkMode = !appliedFilters.workModes.length || appliedFilters.workModes.some((mode) => workMode === mode.toLowerCase());
    const matchesSkills = !appliedFilters.skills.length || appliedFilters.skills.every((skill) => jobSkills.includes(skill.toLowerCase()));
    const minSalary = Number(appliedFilters.minSalary);
    const maxSalary = Number(appliedFilters.maxSalary);

    return (
      (!appliedFilters.jobTypes.length || appliedFilters.jobTypes.some((type) => jobType === type.toLowerCase())) &&
      matchesExperience &&
      matchesWorkMode &&
      matchesSkills &&
      (!appliedFilters.minSalary || salaryRange.max >= minSalary) &&
      (!appliedFilters.maxSalary || salaryRange.min <= maxSalary)
    );
  }), [jobs, appliedFilters]);

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    const emptyFilters = {
      keyword: "",
      location: "",
      jobTypes: [],
      experiences: [],
      minSalary: "",
      maxSalary: "",
      workModes: [],
      skills: [],
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const filterOptions = {
    jobTypes: ["Full Time", "Part Time", "Internship", "Contract"],
    experiences: ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"],
    workModes: ["Remote", "Hybrid", "On-site"],
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
  };

  return (
    <>
      <Navbar />

      <main className="relative isolate min-h-screen overflow-hidden bg-[#eaf4f2]">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(19,34,56,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(19,34,56,.045)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-80 w-80 rounded-full bg-[#69d4cf]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-20 -z-10 h-96 w-96 rounded-full bg-[#f6c453]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0d9f9a]">Opportunities, curated</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#132238] md:text-5xl">
                Find your next move
              </h1>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-500">Search the roles that match your pace, place, and ambition.</p>
          </div>

          <form onSubmit={applyFilters} className="mt-9 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-[1.5rem] border border-[#c8dfdc] bg-[#f6fbfa]/90 p-5 shadow-[0_10px_30px_rgba(19,34,56,0.05)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#132238]">Search Jobs</h2>
                <button type="button" onClick={clearFilters} className="text-xs font-bold text-[#0d9f9a]">Clear</button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block text-sm font-bold text-[#132238]">
                  Keyword
                  <input value={filters.keyword} onChange={(event) => updateFilter("keyword", event.target.value)} placeholder="React Developer" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4" />
                </label>
                <label className="block text-sm font-bold text-[#132238]">
                  Location
                  <input value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="Ahmedabad" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4" />
                </label>
              </div>

              <FilterGroup title="Job Type" options={filterOptions.jobTypes} selected={filters.jobTypes} onToggle={(value) => toggleFilter("jobTypes", value)} />
              <FilterGroup title="Experience" options={filterOptions.experiences} selected={filters.experiences} onToggle={(value) => toggleFilter("experiences", value)} />

              <fieldset className="mt-6">
                <legend className="text-sm font-bold text-[#132238]">Salary (LPA)</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input type="number" min="0" value={filters.minSalary} onChange={(event) => updateFilter("minSalary", event.target.value)} placeholder="Min" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#69d4cf] focus:ring-4" />
                  <input type="number" min="0" value={filters.maxSalary} onChange={(event) => updateFilter("maxSalary", event.target.value)} placeholder="Max" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#69d4cf] focus:ring-4" />
                </div>
              </fieldset>

              <FilterGroup title="Work Mode" options={filterOptions.workModes} selected={filters.workModes} onToggle={(value) => toggleFilter("workModes", value)} />
              <FilterGroup title="Skills" options={filterOptions.skills} selected={filters.skills} onToggle={(value) => toggleFilter("skills", value)} />

              <button type="submit" className="mt-7 w-full rounded-xl bg-[#132238] px-5 py-3 font-black text-white transition hover:bg-[#0d9f9a]">Apply Filters</button>
            </aside>

            <div className="grid content-start gap-5 md:grid-cols-2">

            {isLoading && <p className="rounded-2xl border border-[#c8dfdc] bg-[#f6fbfa]/70 p-6 text-slate-500 backdrop-blur-xl">Loading jobs...</p>}
            {error && <p className="rounded-2xl border border-red-200/80 bg-red-50/70 p-6 text-red-600 backdrop-blur-xl">{error}</p>}
            {!isLoading && !error && filteredJobs.length === 0 && (
              <p className="rounded-2xl border border-[#c8dfdc] bg-[#f6fbfa]/70 p-6 text-slate-500 backdrop-blur-xl">No jobs found.</p>
            )}
            {filteredJobs.map((job) => <JobCard key={job._id} job={job} />)}

            </div>
          </form>

        </div>
      </main>

      <Footer />
    </>
  );
};

const FilterGroup = ({ title, options, selected, onToggle }) => (
  <fieldset className="mt-6">
    <legend className="text-sm font-bold text-[#132238]">{title}</legend>
    <div className="mt-3 space-y-2.5">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="h-4 w-4 accent-[#0d9f9a]" />
          {option}
        </label>
      ))}
    </div>
  </fieldset>
);

export default Jobs;