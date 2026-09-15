import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiDollarSign } from "react-icons/fi";

const JobCard = ({ job }) => {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#c8dfdc] bg-[#f6fbfa]/65 p-6 shadow-[0_12px_30px_rgba(19,34,56,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#69d4cf] hover:bg-[#fbfffe]/90 hover:shadow-[8px_12px_0_#d8efed]">

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e0f5f2] transition-transform duration-500 group-hover:scale-150" />

      <div className="flex justify-between">
        <div>
          <h2 className="relative text-xl font-black text-[#132238]">
            {job.title}
          </h2>

          <p className="relative mt-1 text-sm font-bold uppercase tracking-wider text-[#0d9f9a]">
            {job.company}
          </p>
        </div>

        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132238] text-[#f6c453] transition-transform duration-300 group-hover:rotate-6">
          <FiBriefcase className="text-xl" />
        </div>
      </div>

      <div className="relative mt-6 space-y-3 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <FiMapPin />
          {job.location}
        </p>

        <p className="flex items-center gap-2">
          <FiDollarSign />
          {job.salary || "Salary not specified"}
        </p>

        <p className="flex items-center gap-2">
          <FiBriefcase />
          {job.jobType || job.type}
        </p>
      </div>

      <Link
        to={`/jobs/${job._id || job.id}`}
        className="relative mt-6 inline-flex items-center rounded-full bg-[#132238] px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-[#0d9f9a]"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;