import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    skills: "",
    experience: "",
    education: "",
    resume: "",
    bio: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        const user = response.data;

        setForm({
          name: user.name || "",
          jobTitle: user.jobTitle || "",
          skills: user.skills?.join(", ") || "",
          experience: user.experience || "",
          education: user.education || "",
          resume: user.resume || "",
          bio: user.bio || "",
          phone: user.phone || "",
          location: user.location || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const profileData = {
        ...form,

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await api.put("/profile", profileData);

      alert("Profile updated successfully!");

      navigate("/dashboard/jobseeker/profile");
    } catch (error) {
      console.error("Update profile error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-medium mb-2">
              Job Title
            </label>

            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Frontend Developer"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, Tailwind CSS"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate skills using commas.
            </p>
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium mb-2">
              Experience
            </label>

            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1 Year"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block font-medium mb-2">
              Education
            </label>

            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="B.Tech Computer Science"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block font-medium mb-2">
              Resume
            </label>

            <input
              type="text"
              name="resume"
              value={form.resume}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Resume URL"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-2">
              About Me
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ahmedabad"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/jobseeker/profile")
              }
              className="border px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;