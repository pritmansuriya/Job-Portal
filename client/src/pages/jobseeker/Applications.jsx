const Applications = () => {
  const applications = [
    {
      company: "Tech Solutions",
      job: "Frontend Developer",
      status: "Shortlisted",
    },
    {
      company: "Innovate Labs",
      job: "MERN Developer",
      status: "Pending",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        My Applications
      </h1>

      <div className="bg-white border rounded-xl mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Job</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((item) => (
              <tr key={item.job} className="border-t">
                <td className="p-4">{item.company}</td>
                <td className="p-4">{item.job}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Applications;