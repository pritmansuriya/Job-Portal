import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiFileText,
  FiHeart,
  FiHome,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import api, { authStorage } from "../../services/api";

const MyResume = () => {
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
  const [resumeFile, setResumeFile] = useState(null);

  const navItems = [
    ["Dashboard", "/dashboard/jobseeker", FiHome],
    ["Find Jobs", "/dashboard/jobseeker/jobs", FiSearch],
    ["Saved Jobs", "/dashboard/jobseeker/saved", FiHeart],
    ["My Applications", "/dashboard/jobseeker/applications", FiFileText],
    ["Notifications", "/dashboard/jobseeker/notifications", FiBell],
    ["My Profile", "/dashboard/jobseeker/profile", FiUser],
    ["My Resume", "/dashboard/jobseeker/profile/edit", FiFileText],
    ["Settings", "/dashboard/jobseeker/settings", FiSettings],
  ];

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

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
    const escapeHtml = (value) =>
      String(value || "").replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character],
      );

    const section = (title, content) =>
      content?.trim()
        ? `<section>
          <h2>${title}</h2>
          <p>${escapeHtml(content).replace(/\n/g, "<br />")}</p>
        </section>`
        : "";

    // Open a new tab without the noopener/noreferrer features.
    const resumeWindow = window.open("", "_blank");

    if (!resumeWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this website.");
      return;
    }

    const contact = [form.email, form.phone, form.location]
      .filter(Boolean)
      .join(" | ");

    const resumeHTML = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(form.name || "Resume")}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #132238;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        line-height: 1.6;
      }
      h1 { font-size: 32px; margin-bottom: 4px; }
      h3 { color: #0d9f9a; margin-top: 0; }
      h2 {
        font-size: 18px;
        border-bottom: 2px solid #0d9f9a;
        padding-bottom: 5px;
        margin-top: 24px;
      }
      p { white-space: normal; color: #45556b; }
      .contact { font-size: 13px; }
      @page { size: A4; margin: 15mm; }
      @media print {
        body { padding: 0; }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(form.name || "Your Name")}</h1>
    <h3>${escapeHtml(form.jobTitle || "Job Seeker")}</h3>
    <p class="contact">${escapeHtml(contact)}</p>

    ${section("Professional Summary", form.bio)}
    ${section("Education", form.education)}
    ${section("Experience", form.experience)}
    ${section("Skills", form.skills)}
    ${section("Projects", form.projects)}
    ${section("Certifications", form.certifications)}
    ${section("Languages", form.languages)}
    ${section("Achievements", form.achievements)}

    <script>
      window.addEventListener("load", function () {
        setTimeout(function () {
          window.print();
        }, 300);
      });
    <\/script>
  </body>
  </html>`;

    try {
      resumeWindow.document.open();
      resumeWindow.document.write(resumeHTML);
      resumeWindow.document.close();
    } catch (error) {
      console.error("Resume generation failed:", error);
      resumeWindow.close();
      alert("Unable to generate resume. Please try again.");
    }
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const profileData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "resume") {
        profileData.append(key, value ?? "");
      }
    });

    // Convert comma-separated skills into an array on the backend.
    profileData.set("skills", JSON.stringify(
      form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    ));

    if (resumeFile) {
      profileData.append("resume", resumeFile);
    }

    const response = await api.put("/users/profile", profileData);

    const user = response.data.user || response.data;

    setForm((previous) => ({
      ...previous,
      ...user,
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : previous.skills,
      resume: user.resume || previous.resume,
    }));

    setResumeFile(null);
    alert("Profile and resume updated successfully!");
    navigate("/dashboard/jobseeker/profile");
  } catch (error) {
    console.error("Update profile error:", error);
    alert(
      error.response?.data?.message ||
      "Unable to update profile or upload resume"
    );
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eaf4f2] text-slate-500">
        <p>Loading resume details...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#eaf4f2] text-[#132238]">
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">
              {form.name?.charAt(0)?.toUpperCase() || "J"}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">
                Job Seeker
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {form.name || lastUser?.name || "User"}
              </h2>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Profile
            </p>
            <p className="mt-2 text-sm text-slate-100">
              {form.email || lastUser?.email || "No email available"}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map(([label, path, Icon]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 hover:text-white ${
                  label === "My Resume"
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-200"
                }`}
              >
                <Icon className="shrink-0 text-lg" />
                <span>{label}</span>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <FiLogOut className="shrink-0 text-lg" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-7 sm:px-10 lg:px-12 lg:py-9">
          <div className="w-full">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">
                  Job seeker portal
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">
                  My Resume / Edit Profile
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Update your personal information, skills, and resume details.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={generateResume}
                  className="rounded-xl bg-[#0d9f9a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#087b78] shadow-sm"
                >
                  Generate Resume
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-[0_15px_35px_rgba(19,34,56,0.08)] ring-1 ring-slate-200 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Job Title */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="Frontend Developer"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="React, JavaScript, Tailwind CSS"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Separate skills using commas.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Experience */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="1 Year"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={form.education}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="B.Tech Computer Science"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="Ahmedabad, Gujarat"
                    />
                  </div>
                </div>

                {/* Resume URL */}

                {/* Upload Resume File */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Upload Resume (PDF, DOC, DOCX)
                  </label>

                  <input
                    type="file"
                    name="resumeFile"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      const allowedTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ];

                      if (!allowedTypes.includes(file.type)) {
                        alert("Please select a PDF, DOC, or DOCX file.");
                        e.target.value = "";
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        alert("Resume file size must be 5 MB or less.");
                        e.target.value = "";
                        return;
                      }

                      setResumeFile(file);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />

                  {resumeFile && (
                    <p className="mt-2 text-sm text-green-700">
                      Selected file: {resumeFile.name}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    About Me / Summary
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                    placeholder="Write a concise overview of your professional background and interests..."
                  />
                </div>

                {/* Projects */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Projects
                  </label>
                  <textarea
                    name="projects"
                    value={form.projects}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                    placeholder="Project name, key features, and technologies used..."
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Certifications
                  </label>
                  <textarea
                    name="certifications"
                    value={form.certifications}
                    onChange={handleChange}
                    rows="2"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                    placeholder="Certification name, issuing organization, and completion date..."
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Languages */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Languages
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={form.languages}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="English, Hindi, Gujarati"
                    />
                  </div>

                  {/* Achievements */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Achievements
                    </label>
                    <textarea
                      name="achievements"
                      value={form.achievements}
                      onChange={handleChange}
                      rows="2"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
                      placeholder="Awards, recognitions, or notable achievements..."
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="cursor-pointer rounded-xl bg-[#0d9f9a] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#087b78] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>

                  <button
                    type="button"
                    onClick={generateResume}
                    className="cursor-pointer rounded-xl bg-[#132238] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f375a]"
                  >
                    Generate Resume
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/jobseeker/profile")}
                    className="cursor-pointer rounded-xl border border-slate-300 px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyResume;
