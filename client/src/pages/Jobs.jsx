import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/Jobcard";
import { getErrorMessage, jobsApi } from "../services/api";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const [search, setSearch] = useState(initialSearch);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (search || initialSearch) params.search = search || initialSearch;
        if (initialLocation) params.location = initialLocation;
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
  }, [search, initialLocation]);

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

          <div className="mt-9 rounded-[1.5rem] border border-[#c8dfdc] bg-[#f6fbfa]/70 p-3 shadow-[0_10px_30px_rgba(19,34,56,0.05)] backdrop-blur-xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or company..."
              className="w-full rounded-xl bg-slate-50 px-5 py-4 text-[#132238] outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4"
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {isLoading && <p className="rounded-2xl border border-[#c8dfdc] bg-[#f6fbfa]/70 p-6 text-slate-500 backdrop-blur-xl">Loading jobs...</p>}
            {error && <p className="rounded-2xl border border-red-200/80 bg-red-50/70 p-6 text-red-600 backdrop-blur-xl">{error}</p>}
            {!isLoading && !error && jobs.length === 0 && (
              <p className="rounded-2xl border border-[#c8dfdc] bg-[#f6fbfa]/70 p-6 text-slate-500 backdrop-blur-xl">No jobs found.</p>
            )}
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Jobs;