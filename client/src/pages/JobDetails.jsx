import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getErrorMessage, jobsApi } from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      setError("Invalid job ID. Open a job from the jobs list.");
      return;
    }

    jobsApi.getById(id)
      .then((response) => setJob(response.data))
      .catch((requestError) => {
        setError(getErrorMessage(requestError, "Unable to load job"));
      });
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f7f4] py-14">

        <div className="max-w-5xl mx-auto px-6">

          {error && <p className="text-red-600">{error}</p>}
          {!job && !error && <p className="text-gray-500">Loading job...</p>}
            {job && <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(19,34,56,0.07)] md:p-12">

              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d9f9a]">{job.company}</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#132238] md:text-5xl">{job.title}</h1>

            <p className="mt-4 text-sm text-slate-400">
              Job ID: {id}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <div className="rounded-2xl bg-[#eef8f6] p-5">
                <p className="text-sm text-slate-500">Location</p>
                <p className="mt-1 font-black text-[#132238]">{job.location}</p>
              </div>

              <div className="rounded-2xl bg-[#fff8e7] p-5">
                <p className="text-sm text-slate-500">Salary</p>
                <p className="mt-1 font-black text-[#132238]">{job.salary}</p>
              </div>

              <div className="rounded-2xl bg-[#f0efff] p-5">
                <p className="text-sm text-slate-500">Job Type</p>
                <p className="mt-1 font-black text-[#132238]">{job.jobType}</p>
              </div>

            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">
                Job Description
              </h2>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">{job.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-3 mt-4">
                {(job.skills || []).map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#e0f5f2] px-4 py-2 text-sm font-bold text-[#087b78]"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <Link
              to="/login"
              className="mt-10 inline-block rounded-full bg-[#132238] px-8 py-3.5 font-black text-white transition-all hover:-translate-y-1 hover:bg-[#0d9f9a] hover:shadow-[5px_5px_0_#f6c453]"
            >
              Apply Now
            </Link>

          </div>}

        </div>

      </main>
    </>
  );
};

export default JobDetails;