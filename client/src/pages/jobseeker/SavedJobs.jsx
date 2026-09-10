const SavedJobs = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Saved Jobs
      </h1>

      <div className="bg-white border rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold">
          MERN Stack Developer
        </h2>

        <p className="text-blue-600 mt-2">
          Innovate Labs
        </p>

        <p className="text-gray-500 mt-2">
          Ahmedabad · ₹8L - ₹14L
        </p>

        <button className="mt-5 bg-red-500 text-white px-5 py-2 rounded-lg">
          Remove
        </button>
      </div>

    </div>
  );
};

export default SavedJobs;