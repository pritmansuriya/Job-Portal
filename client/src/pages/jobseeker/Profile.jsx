const Profile = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        My Profile
      </h1>

      <div className="bg-white border rounded-xl p-8 mt-8 max-w-3xl">

        <div className="grid md:grid-cols-2 gap-5">

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Full Name"
            defaultValue="Prit Mansuriya"
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Email"
            defaultValue="prit@example.com"
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Phone"
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Location"
          />

        </div>

        <textarea
          className="w-full border rounded-lg px-4 py-3 mt-5"
          rows="5"
          placeholder="About yourself"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-5">
          Save Profile
        </button>

      </div>

    </div>
  );
};

export default Profile;