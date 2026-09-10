const Jobs = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Manage Jobs
      </h1>

      <div className="bg-white border rounded-xl p-6 mt-8">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-xl font-semibold">
              MERN Stack Developer
            </h2>

            <p className="text-gray-500">
              Innovate Labs · Ahmedabad
            </p>
          </div>

          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default Jobs;