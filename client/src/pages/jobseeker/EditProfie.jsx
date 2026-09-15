import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { authStorage } from "../../services/api";

const EditProfile = () => {
  const navigate = useNavigate();
  const lastUser = authStorage.getUser();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    skills: "",
    experience: "",
    education: "",
    resume: "",
    bio: "",
    projects: "",
    certifications: "",
    languages: "",
    achievements: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");

        const user = response.data;

        setForm({
          name: user.name || lastUser?.name || "",
          email: user.email || lastUser?.email || "",
          jobTitle: user.jobTitle || "",
          skills: user.skills?.join(", ") || "",
          experience: user.experience || "",
          education: user.education || "",
          resume: user.resume || "",
          bio: user.bio || "",
          projects: user.projects || "",
          certifications: user.certifications || "",
          languages: user.languages || "",
          achievements: user.achievements || "",
          phone: user.phone || "",
          location: user.location || "",
        });
      } catch (error) {
        console.error(error);

        if (lastUser) {
          setForm({
            name: lastUser.name || "",
            email: lastUser.email || "",
            jobTitle: "",
            skills: "",
            experience: "",
            education: "",
            resume: "",
            bio: "",
            projects: "",
            certifications: "",
            languages: "",
            achievements: "",
            phone: "",
            location: "",
          });
        }
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

  const generateResume = () => {
    const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
    const section = (title, content) => content ? `<section><h2>${title}</h2><p>${escapeHtml(content).replace(/\n/g, "<br />")}</p></section>` : "";
    const resumeWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!resumeWindow) {
      alert("Please allow pop-ups to generate your resume.");
      return;
    }

    resumeWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(form.name || "Resume")}</title><style>
      body{font-family:Arial,sans-serif;color:#132238;max-width:800px;margin:0 auto;padding:48px;line-height:1.6}h1{font-size:34px;margin:0}h3{color:#0d9f9a;margin:4px 0 18px}h2{font-size:18px;border-bottom:2px solid #0d9f9a;padding-bottom:6px;margin-top:28px}p{white-space:normal;margin:8px 0;color:#45556b}.contact{color:#45556b;font-size:13px}@media print{body{padding:0}}
    </style></head><body><h1>${escapeHtml(form.name || "Your Name")}</h1><h3>${escapeHtml(form.jobTitle || "Job Seeker")}</h3><p class="contact">${escapeHtml([form.email, form.location, form.phone].filter(Boolean).join(" | "))}</p>${section("About Me", form.bio)}${section("Education", form.education)}${section("Experience", form.experience)}${section("Skills", form.skills)}${section("Projects", form.projects)}${section("Certifications", form.certifications)}${section("Languages", form.languages)}${section("Achievements", form.achievements)}<script>window.onload=function(){window.print();}</script></body></html>`);
    resumeWindow.document.close();
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

      await api.put("/users/profile", profileData);

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

          <div>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-4 py-2 text-gray-500 outline-none"
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
            <label className="block font-medium mb-2">Projects</label>
            <textarea name="projects" value={form.projects} onChange={handleChange} rows="4" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Project name, role, and technologies used" />
          </div>

          <div>
            <label className="block font-medium mb-2">Certifications</label>
            <textarea name="certifications" value={form.certifications} onChange={handleChange} rows="3" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Certification name and issuing organization" />
          </div>

          <div>
            <label className="block font-medium mb-2">Languages</label>
            <input type="text" name="languages" value={form.languages} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="English, Hindi, Gujarati" />
          </div>

          <div>
            <label className="block font-medium mb-2">Achievements</label>
            <textarea name="achievements" value={form.achievements} onChange={handleChange} rows="3" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awards, recognitions, or notable achievements" />
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
          <div className="flex flex-wrap gap-3 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button
              type="button"
              onClick={generateResume}
              className="rounded-lg bg-[#0d9f9a] px-6 py-2 text-white hover:bg-[#087b78]"
            >
              Generate Resume
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