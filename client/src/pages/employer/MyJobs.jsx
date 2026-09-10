const MyJobs = () => {
  const jobs = [
    {
      title: "Frontend Developer",
      applications: 25,
      status: "Active",
    },
    {
      title: "MERN Stack Developer",
      applications: 42,
      status: "Active",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        My Jobs
      </h1>

      <div className="mt-8 space-y-4">

        {jobs.map((job) => (
          <div
            key={job.title}
            className="bg-white border rounded-xl p-6 flex flex-col md:flex-row justify-between"
          >

            <div>
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {job.applications} Applications
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="border px-4 py-2 rounded-lg">
                Edit
              </button>

              <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyJobs;