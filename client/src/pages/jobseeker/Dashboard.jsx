import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    ["Applied Jobs", 12],
    ["Shortlisted", 4],
    ["Interviews", 2],
    ["Saved Jobs", 8],
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold">
        Job Seeker Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome back! Here's your job activity.
      </p>

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

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <Link
          to="/dashboard/jobseeker/profile"
          className="bg-white border rounded-xl p-6"
        >
          <h2 className="font-semibold text-xl">
            My Profile
          </h2>
          <p className="text-gray-500 mt-2">
            Manage your personal information.
          </p>
        </Link>

        <Link
          to="/dashboard/jobseeker/applications"
          className="bg-white border rounded-xl p-6"
        >
          <h2 className="font-semibold text-xl">
            Applications
          </h2>
          <p className="text-gray-500 mt-2">
            Track your job applications.
          </p>
        </Link>

        <Link
          to="/dashboard/jobseeker/saved"
          className="bg-white border rounded-xl p-6"
        >
          <h2 className="font-semibold text-xl">
            Saved Jobs
          </h2>
          <p className="text-gray-500 mt-2">
            View jobs you saved.
          </p>
        </Link>

      </div>

    </div>
  );
};

export default Dashboard;