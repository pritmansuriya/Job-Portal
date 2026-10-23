
import { useEffect, useState } from "react";
import "./MyResume.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyResume = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    linkedIn: "",
    portfolio: "",
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
};

function getToken() {
  // Replace with your existing authStorage getter if needed.
  return localStorage.getItem("token") || "";
}

export default function MyResume() {
  const [resume, setResume] = useState(emptyResume);
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Load the candidate's saved resume
  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      try {
        const response = await fetch(`${API_URL}/api/resumes/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load your resume.");
        }

        const data = await response.json();

        if (cancelled) return;

        if (data && data.personalInfo) {
          const loadedResume = {
            ...emptyResume,
            ...data,
            personalInfo: {
              ...emptyResume.personalInfo,
              ...(data.personalInfo || {}),
            },
            education: data.education || [],
            skills: data.skills || [],
            experience: data.experience || [],
            projects: data.projects || [],
          };

          setResume(loadedResume);
          setSkillsText(loadedResume.skills.join(", "));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message || "Unable to load your resume.");
          setMessageType("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResume();

    return () => {
      cancelled = true;
    };
  }, []);

  // Update personal information
  function updatePersonal(field, value) {
    setResume((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value,
      },
    }));
  }

  // Update an item inside education, experience, or projects
  function updateItem(section, index, field, value) {
    setResume((current) => {
      const items = [...current[section]];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...current,
        [section]: items,
      };
    });
  }

  // Add a new education, experience, or project
  function addItem(section) {
    const templates = {
      education: {
        institution: "",
        degree: "",
        startYear: "",
        endYear: "",
        grade: "",
      },
      experience: {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
      projects: {
        name: "",
        technologies: "",
        description: "",
        projectLink: "",
      },
    };

    setResume((current) => ({
      ...current,
      [section]: [...current[section], { ...templates[section] }],
    }));
  }

  // Remove an item
  function removeItem(section, index) {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((_, i) => i !== index),
    }));
  }

  // Save resume to MongoDB through the backend API
  async function saveResume(event) {
    if (event) event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...resume,
        skills: skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await fetch(`${API_URL}/api/resumes/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save resume.");
      }

      const savedResume = {
        ...emptyResume,
        ...data.resume,
        personalInfo: {
          ...emptyResume.personalInfo,
          ...(data.resume?.personalInfo || {}),
        },
        education: data.resume?.education || [],
        skills: data.resume?.skills || payload.skills,
        experience: data.resume?.experience || [],
        projects: data.resume?.projects || [],
      };

      setResume(savedResume);
      setSkillsText(savedResume.skills.join(", "));
      setMessage("Resume saved successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Failed to save resume.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  // Open the browser print dialog; choose "Save as PDF"
  function downloadPDF() {
    window.print();
  }

  if (loading) {
    return <div className="resume-loading">Loading your resume...</div>;
  }

  const personalInfo = resume.personalInfo;

  return (
    <div className="resume-page">
      {/* Page heading and actions */}
      <div className="resume-toolbar no-print">
        <div>
          <h1>My Resume</h1>
          <p>Create, edit, preview, and download your professional resume.</p>
        </div>

        <div className="resume-actions">
          <button
            type="button"
            className="resume-secondary"
            onClick={downloadPDF}
          >
            Download PDF
          </button>

          <button
            type="button"
            className="resume-primary"
            onClick={saveResume}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`resume-message no-print ${messageType}`}
          role="status"
        >
          {message}
        </div>
      )}

      <div className="resume-layout">
        {/* LEFT: Resume form */}
        <section className="resume-form no-print">
          <h2>Personal Information</h2>

          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonal("fullName", e.target.value)}
            placeholder="Enter your full name"
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonal("email", e.target.value)}
            placeholder="you@example.com"
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => updatePersonal("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            value={personalInfo.address}
            onChange={(e) => updatePersonal("address", e.target.value)}
            placeholder="City, State"
          />

          <label htmlFor="summary">Professional Summary</label>
          <textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => updatePersonal("summary", e.target.value)}
            placeholder="Write a short introduction about your professional skills..."
          />

          <label htmlFor="linkedIn">LinkedIn URL</label>
          <input
            id="linkedIn"
            value={personalInfo.linkedIn}
            onChange={(e) => updatePersonal("linkedIn", e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
          />

          <label htmlFor="portfolio">Portfolio / GitHub URL</label>
          <input
            id="portfolio"
            value={personalInfo.portfolio}
            onChange={(e) => updatePersonal("portfolio", e.target.value)}
            placeholder="https://github.com/your-profile"
          />

          {/* EDUCATION */}
          <hr />
          <h2>Education</h2>

          {resume.education.map((item, index) => (
            <div className="resume-entry" key={`education-${index}`}>
              <label>Institution</label>
              <input
                value={item.institution || ""}
                onChange={(e) =>
                  updateItem("education", index, "institution", e.target.value)
                }
                placeholder="College or university"
              />

              <label>Degree</label>
              <input
                value={item.degree || ""}
                onChange={(e) =>
                  updateItem("education", index, "degree", e.target.value)
                }
                placeholder="BCA, B.Tech, etc."
              />

              <div className="resume-two-columns">
                <div>
                  <label>Start Year</label>
                  <input
                    value={item.startYear || ""}
                    onChange={(e) =>
                      updateItem("education", index, "startYear", e.target.value)
                    }
                    placeholder="2022"
                  />
                </div>

                <div>
                  <label>End Year</label>
                  <input
                    value={item.endYear || ""}
                    onChange={(e) =>
                      updateItem("education", index, "endYear", e.target.value)
                    }
                    placeholder="2025"
                  />
                </div>
              </div>

              <label>Grade / Percentage</label>
              <input
                value={item.grade || ""}
                onChange={(e) =>
                  updateItem("education", index, "grade", e.target.value)
                }
                placeholder="CGPA or percentage"
              />

              <button
                type="button"
                className="remove-entry"
                onClick={() => removeItem("education", index)}
              >
                Remove Education
              </button>
            </div>
          ))}

          <button
            type="button"
            className="resume-secondary full-width"
            onClick={() => addItem("education")}
          >
            + Add Education
          </button>

          {/* SKILLS */}
          <hr />
          <h2>Skills</h2>

          <label htmlFor="skills">Skills (separated by commas)</label>
          <textarea
            id="skills"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="React.js, JavaScript, Node.js, MongoDB"
          />

          {/* EXPERIENCE */}
          <hr />
          <h2>Work Experience</h2>

          {resume.experience.map((item, index) => (
            <div className="resume-entry" key={`experience-${index}`}>
              <label>Company</label>
              <input
                value={item.company || ""}
                onChange={(e) =>
                  updateItem("experience", index, "company", e.target.value)
                }
                placeholder="Company name"
              />

              <label>Position</label>
              <input
                value={item.position || ""}
                onChange={(e) =>
                  updateItem("experience", index, "position", e.target.value)
                }
                placeholder="Job title"
              />

              <div className="resume-two-columns">
                <div>
                  <label>Start Date</label>
                  <input
                    value={item.startDate || ""}
                    onChange={(e) =>
                      updateItem("experience", index, "startDate", e.target.value)
                    }
                    placeholder="Jan 2025"
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    value={item.endDate || ""}
                    onChange={(e) =>
                      updateItem("experience", index, "endDate", e.target.value)
                    }
                    placeholder="Present"
                  />
                </div>
              </div>

              <label>Description</label>
              <textarea
                value={item.description || ""}
                onChange={(e) =>
                  updateItem("experience", index, "description", e.target.value)
                }
                placeholder="Responsibilities and achievements"
              />

              <button
                type="button"
                className="remove-entry"
                onClick={() => removeItem("experience", index)}
              >
                Remove Experience
              </button>
            </div>
          ))}

          <button
            type="button"
            className="resume-secondary full-width"
            onClick={() => addItem("experience")}
          >
            + Add Experience
          </button>

          {/* PROJECTS */}
          <hr />
          <h2>Projects</h2>

          {resume.projects.map((item, index) => (
            <div className="resume-entry" key={`project-${index}`}>
              <label>Project Name</label>
              <input
                value={item.name || ""}
                onChange={(e) =>
                  updateItem("projects", index, "name", e.target.value)
                }
                placeholder="Job Portal"
              />

              <label>Technologies</label>
              <input
                value={item.technologies || ""}
                onChange={(e) =>
                  updateItem("projects", index, "technologies", e.target.value)
                }
                placeholder="React, Node.js, MongoDB"
              />

              <label>Description</label>
              <textarea
                value={item.description || ""}
                onChange={(e) =>
                  updateItem("projects", index, "description", e.target.value)
                }
                placeholder="Describe what your project does"
              />

              <label>Project URL</label>
              <input
                value={item.projectLink || ""}
                onChange={(e) =>
                  updateItem("projects", index, "projectLink", e.target.value)
                }
                placeholder="https://github.com/..."
              />

              <button
                type="button"
                className="remove-entry"
                onClick={() => removeItem("projects", index)}
              >
                Remove Project
              </button>
            </div>
          ))}

          <button
            type="button"
            className="resume-secondary full-width"
            onClick={() => addItem("projects")}
          >
            + Add Project
          </button>
        </section>

        {/* RIGHT: Live resume preview */}
        <section className="resume-preview" id="resume-preview">
          <header className="preview-header">
            <h1>{personalInfo.fullName || "Your Name"}</h1>

            <p>
              {[personalInfo.email, personalInfo.phone, personalInfo.address]
                .filter(Boolean)
                .join(" | ")}
            </p>

            <p>
              {[personalInfo.linkedIn, personalInfo.portfolio]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </header>

          {personalInfo.summary && (
            <section>
              <h2>Professional Summary</h2>
              <p className="preserve-lines">{personalInfo.summary}</p>
            </section>
          )}

          {resume.education.length > 0 && (
            <section>
              <h2>Education</h2>

              {resume.education.map((item, index) => (
                <article key={`preview-education-${index}`}>
                  <strong>{item.degree}</strong>
                  <p>{item.institution}</p>
                  <p>
                    {[item.startYear, item.endYear].filter(Boolean).join(" - ")}
                    {item.grade ? ` | ${item.grade}` : ""}
                  </p>
                </article>
              ))}
            </section>
          )}

          {skillsText.trim() && (
            <section>
              <h2>Skills</h2>
              <p>
                {skillsText
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </section>
          )}

          {resume.experience.length > 0 && (
            <section>
              <h2>Work Experience</h2>

              {resume.experience.map((item, index) => (
                <article key={`preview-experience-${index}`}>
                  <strong>{item.position}</strong>
                  <p>{item.company}</p>
                  <p>
                    {[item.startDate, item.endDate].filter(Boolean).join(" - ")}
                  </p>
                  <p className="preserve-lines">{item.description}</p>
                </article>
              ))}
            </section>
          )}

          {resume.projects.length > 0 && (
            <section>
              <h2>Projects</h2>

              {resume.projects.map((item, index) => (
                <article key={`preview-project-${index}`}>
                  <strong>{item.name}</strong>

                  {item.technologies && <p>{item.technologies}</p>}

                  <p className="preserve-lines">{item.description}</p>

                  {item.projectLink && <p>{item.projectLink}</p>}
                </article>
              ))}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
