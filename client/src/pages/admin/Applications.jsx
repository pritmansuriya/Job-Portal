const Applications = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Manage Applications
      </h1>

      <div className="bg-white border rounded-xl mt-8 p-6">

        <div className="flex justify-between border-b py-4">

          <div>
            <h2 className="font-semibold">
              Prit Mansuriya
            </h2>

            <p className="text-gray-500">
              Applied for MERN Developer
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full h-fit">
            Shortlisted
          </span>

        </div>

      </div>

    </div>
  );
};

export default Applications;