const Users = () => {
  const users = [
    {
      name: "Prit Mansuriya",
      email: "prit@example.com",
      role: "Job Seeker",
    },
    {
      name: "ABC Technologies",
      email: "hr@abc.com",
      role: "Employer",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Manage Users
      </h1>

      <div className="bg-white border rounded-xl mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.email} className="border-t">

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Users;