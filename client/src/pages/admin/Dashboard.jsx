const Dashboard = () => {
  const stats = [
    ["Total Users", 2500],
    ["Total Employers", 350],
    ["Total Jobs", 1250],
    ["Applications", 8500],
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
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

    </div>
  );
};

export default Dashboard;