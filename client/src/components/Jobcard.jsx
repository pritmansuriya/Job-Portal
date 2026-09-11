import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiDollarSign } from "react-icons/fi";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition">

      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {job.title}
          </h2>

          <p className="text-blue-600 mt-1">
            {job.company}
          </p>
        </div>

        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiBriefcase className="text-blue-600 text-xl" />
        </div>
      </div>

      <div className="mt-5 space-y-2 text-gray-500">
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
        className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;