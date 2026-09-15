import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");

      setProfile(response.data);
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                {profile.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </h1>

                <p className="text-gray-500">
                  {profile.jobTitle || "Job Seeker"}
                </p>
              </div>

            </div>

            <Link
              to="/dashboard/jobseeker/profile/edit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </Link>

          </div>

          {/* About */}
          {profile.bio && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">
                About
              </h2>

              <p className="text-gray-600">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No skills added
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Experience
            </h2>

            <p className="text-gray-600 mt-1">
              {profile.experience || "Not added"}
            </p>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Education
            </h2>

            <p className="text-gray-600 mt-1">
              {profile.education || "Not added"}
            </p>
          </div>

          {/* Resume */}
          <div>
            <h2 className="text-lg font-semibold">
              Resume
            </h2>

            {profile.resume ? (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline inline-block mt-1"
              >
                View Resume
              </a>
            ) : (
              <p className="text-gray-500 mt-1">
                No resume uploaded
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;