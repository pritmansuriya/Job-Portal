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

      <main className="bg-gray-50 min-h-screen py-12">

        <div className="max-w-5xl mx-auto px-6">

          {error && <p className="text-red-600">{error}</p>}
          {!job && !error && <p className="text-gray-500">Loading job...</p>}
          {job && <div className="bg-white rounded-xl border p-8">

              <p className="text-blue-600">{job.company}</p>
              <h1 className="text-3xl font-bold mt-2">{job.title}</h1>

            <p className="text-gray-500 mt-3">
              Job ID: {id}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Location</p>
                <p className="font-semibold">{job.location}</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Salary</p>
                <p className="font-semibold">{job.salary}</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Job Type</p>
                <p className="font-semibold">{job.jobType}</p>
              </div>

            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">
                Job Description
              </h2>

              <p className="text-gray-600 mt-4 leading-7">{job.description}</p>
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
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <Link
              to="/login"
              className="inline-block mt-10 bg-blue-600 text-white px-8 py-3 rounded-lg"
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