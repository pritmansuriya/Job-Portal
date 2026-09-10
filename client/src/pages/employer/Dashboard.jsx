import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    ["Total Jobs", 15],
    ["Applications", 120],
    ["Shortlisted", 25],
    ["Selected", 8],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Employer Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-5 mt-8">

        {stats.map(([title, value]) => (
          <div
            key={title}
            className="bg-white border rounded-xl p-6"
          >
            <p className="text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold mt-2">
              {value}
            </h2>
          </div>
        ))}

      </div>

      <Link
        to="/dashboard/employer/post-job"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg mt-8"
      >
        + Post New Job
      </Link>

    </div>
  );
};

export default Dashboard;