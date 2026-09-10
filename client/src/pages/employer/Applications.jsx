const Applications = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Applications
      </h1>

      <div className="bg-white border rounded-xl mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Candidate</th>
              <th className="text-left p-4">Job</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-4">Prit Mansuriya</td>
              <td className="p-4">MERN Developer</td>

              <td className="p-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  Pending
                </span>
              </td>

              <td className="p-4">
                <button className="bg-green-600 text-white px-3 py-2 rounded">
                  Shortlist
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Applications;