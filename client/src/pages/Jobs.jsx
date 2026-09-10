import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/Jobcard";

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Ahmedabad",
    salary: "₹6L - ₹10L",
    type: "Full Time",
  },
  {
    id: 2,
    title: "MERN Stack Developer",
    company: "Innovate Labs",
    location: "Remote",
    salary: "₹8L - ₹14L",
    type: "Full Time",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Mumbai",
    salary: "₹5L - ₹9L",
    type: "Full Time",
  },
];

const Jobs = () => {
  const [search, setSearch] = useState("");

  const filteredJobs = jobsData.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

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

            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Jobs;