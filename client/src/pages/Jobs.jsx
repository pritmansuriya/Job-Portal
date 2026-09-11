import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/Jobcard";
import { getErrorMessage, jobsApi } from "../services/api";

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const response = await jobsApi.list(search ? { search } : undefined);
        setJobs(response.data);
        setError("");
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load jobs"));
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [search]);

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <h1 className="text-3xl font-bold">
            Find Jobs
          </h1>

          <div className="mt-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full md:w-96 border rounded-lg px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

            {isLoading && <p className="text-gray-500">Loading jobs...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!isLoading && !error && jobs.length === 0 && (
              <p className="text-gray-500">No jobs found.</p>
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