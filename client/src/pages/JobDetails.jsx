import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const JobDetails = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen py-12">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-white rounded-xl border p-8">

            <p className="text-blue-600">
              Tech Solutions
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Frontend Developer
            </h1>

            <p className="text-gray-500 mt-3">
              Job ID: {id}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Location</p>
                <p className="font-semibold">Ahmedabad</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Salary</p>
                <p className="font-semibold">₹6L - ₹10L</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-500">Job Type</p>
                <p className="font-semibold">Full Time</p>
              </div>

            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">
                Job Description
              </h2>

              <p className="text-gray-600 mt-4 leading-7">
                We are looking for a talented frontend developer to
                join our development team. You will work with React,
                JavaScript and modern frontend technologies.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-3 mt-4">
                {["React", "JavaScript", "HTML", "CSS", "Git"].map(
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

          </div>

        </div>

      </main>
    </>
  );
};

export default JobDetails;