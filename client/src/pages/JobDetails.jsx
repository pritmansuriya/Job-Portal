import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiEdit3,
  FiHeart,
  FiHome,
  FiMapPin,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import {
  applicationsApi,
  authStorage,
  getErrorMessage,
  jobsApi,
  usersApi,
} from "../services/api";

const defaultResponsibilities = [
  "Build web applications",
  "Collaborate with cross-functional teams",
  "Write clean, maintainable, and reusable code",
];

const defaultRequirements = ["Problem-solving skills", "Communication skills", "Relevant technical background"];

const toList = (value, defaultItems = []) => {
  if (!value) return defaultItems;
  if (Array.isArray(value)) {
    const clean = value.filter(Boolean);
    return clean.length ? clean : defaultItems;
  }
  if (typeof value === "string") {
    const lines = value
      .split(/\r?\n|•/)
      .map((item) => item.trim())
      .filter(Boolean);
    return lines.length ? lines : defaultItems;
  }
  return defaultItems;
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = authStorage.getUser();
  const isJobseeker = currentUser?.role === "jobseeker";
  const isEmployer = currentUser?.role === "employer";
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      setError("Invalid job ID. Open a job from the jobs list.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    jobsApi.getById(id)
      .then((response) => {
        setJob(response.data);
        if (localStorage.getItem("token") && isJobseeker) {
          return usersApi.savedJobs().then((savedResponse) => {
            setIsSaved(savedResponse.data.some((savedJob) => savedJob._id === response.data._id));
          });
        }
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError, "Unable to load job"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, isJobseeker]);

  const toggleSaved = async () => {
    if (!job) return;
    if (!localStorage.getItem("token") || !isJobseeker) {
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await usersApi.removeSavedJob(job._id);
      } else {
        await usersApi.saveJob(job._id);
      }
      setIsSaved(!isSaved);
      setMessage(isSaved ? "Job removed from saved jobs." : "Job saved successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update saved job"));
    } finally {
      setIsSaving(false);
    }
  };

  const openApplicationForm = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!isJobseeker) {
      setError("Only job seekers can apply for jobs.");
      return;
    }

    setMessage("");
    setError("");
    setShowApplicationForm(true);
  };

  const handleApply = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setError("Please upload your resume before submitting.");
      return;
    }

    setIsApplying(true);
    setMessage("");
    setError("");

    try {
      await applicationsApi.create({
        jobId: job._id,
        resume: resumeFile.name,
        coverLetter,
      });
      setMessage("Application submitted successfully.");
      setShowApplicationForm(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to submit application"));
    } finally {
      setIsApplying(false);
    }
  };

  const postedLabel = (() => {
    if (!job?.createdAt) return "Recently posted";
    const time = new Date(job.createdAt).getTime();
    if (isNaN(time)) return "Recently posted";
    const days = Math.floor((Date.now() - time) / 86400000);
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  })();

  const responsibilities = toList(job?.responsibilities, defaultResponsibilities);
  const requirements = toList(job?.requirements, defaultRequirements);
  const benefits = toList(job?.benefits, []);
  const skills = (() => {
    if (Array.isArray(job?.skills) && job.skills.length > 0) return job.skills.filter(Boolean);
    if (typeof job?.skills === "string" && job.skills.trim()) {
      return job.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return ["React", "JavaScript", "HTML/CSS", "Git"];
  })();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eaf4f2] px-6 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          {error && !job && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-semibold text-red-600">{error}</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#132238] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d9f9a]"
                >
                  <FiArrowLeft /> Go Back
                </button>
              </div>
            </div>
          )}

          {isLoading && !job && !error && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <p className="text-lg font-bold">Loading job details...</p>
            </div>
          )}

          {job && (
            <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(19,34,56,0.08)] md:p-10">
              {/* Back navigation */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0d9f9a]"
                >
                  <FiArrowLeft /> Back
                </button>
              </div>

              <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d9f9a]">{job.company}</p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight text-[#132238] md:text-5xl">{job.title}</h1>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5"><FiMapPin className="text-[#0d9f9a]" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1.5"><FiDollarSign className="text-[#0d9f9a]" /> {job.salary}</span>
                    <span className="inline-flex items-center gap-1.5"><FiBriefcase className="text-[#0d9f9a]" /> {job.jobType || "Full Time"}</span>
                    <span className="inline-flex items-center gap-1.5"><FiHome className="text-[#0d9f9a]" /> {job.workMode || (job.jobType === "Remote" ? "Remote" : "Hybrid")}</span>
                    {job.deadline && (
                      <span className="inline-flex items-center gap-1.5"><FiCalendar className="text-[#0d9f9a]" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#e8f9f8] px-4 py-2 text-sm font-bold text-[#0d9f9a]">Posted: {postedLabel}</span>
              </div>

              <section className="mt-8">
                <h2 className="text-2xl font-black text-[#132238]">About the Job</h2>
                <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{job.description || "We are looking for a talented professional to join our team."}</p>
              </section>

              <DetailList title="Responsibilities" items={responsibilities} />
              <DetailList title="Requirements" items={requirements} />
              {benefits.length > 0 && <DetailList title="Benefits & Perks" items={benefits} />}

              {skills.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-2xl font-black text-[#132238]">Skills</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-[#e0f5f2] px-4 py-2 text-sm font-bold text-[#087b78]">{skill}</span>
                    ))}
                  </div>
                </section>
              )}

              {(message || error) && <p className={`mt-8 rounded-xl p-4 text-sm ${error ? "bg-red-50 text-red-600" : "bg-[#e8f9f8] text-[#087b78]"}`}>{error || message}</p>}

              {showApplicationForm && (
                <form onSubmit={handleApply} className="mt-10 rounded-2xl border border-[#c8dfdc] bg-[#f6fbfa] p-5">
                  <h2 className="text-2xl font-black text-[#132238]">Apply for {job.title}</h2>

                  <label className="mt-5 block text-sm font-bold text-[#132238]">
                    Resume
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-600">
                        {resumeFile?.name || "No resume selected"}
                      </span>
                      <label className="cursor-pointer rounded-xl bg-[#0d9f9a] px-5 py-3 text-center font-bold text-white transition hover:bg-[#087b78]">
                        Upload
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <span className="mt-2 block text-xs font-normal text-slate-500">PDF, DOC, or DOCX</span>
                  </label>

                  <label className="mt-5 block text-sm font-bold text-[#132238]">
                    Cover Letter
                    <textarea
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      rows="5"
                      placeholder="Tell the employer why you are a good fit..."
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-700 outline-none ring-[#69d4cf] placeholder:text-slate-400 focus:ring-4"
                    />
                  </label>

                  <button type="submit" disabled={isApplying} className="mt-5 w-full rounded-xl bg-[#132238] px-6 py-3.5 font-black text-white transition hover:bg-[#0d9f9a] disabled:cursor-wait disabled:opacity-60">
                    {isApplying ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}

              {/* Actions for Job Seeker */}
              {isJobseeker && (
                <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <button type="button" onClick={toggleSaved} disabled={isSaving} className="rounded-xl border border-slate-300 px-6 py-3.5 font-black text-[#132238] transition hover:border-[#0d9f9a] hover:text-[#0d9f9a] disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      <FiHeart className={isSaved ? "fill-current" : ""} />
                      {isSaved ? "Saved Job" : "Save Job"}
                    </span>
                  </button>
                  <button type="button" onClick={openApplicationForm} className="rounded-xl bg-[#132238] px-8 py-3.5 font-black text-white transition hover:bg-[#0d9f9a]">
                    <span className="inline-flex items-center gap-2"><FiSend /> Apply Now</span>
                  </button>
                </div>
              )}

              {/* Actions for Employer */}
              {isEmployer && (
                <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
                  <Link
                    to="/dashboard/employer/jobs"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-black text-[#132238] transition hover:bg-slate-100"
                  >
                    <FiArrowLeft /> Back to My Jobs
                  </Link>
                  <Link
                    to={`/dashboard/employer/post-job?edit=${job._id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0d9f9a] px-6 py-3.5 font-black text-[#087b78] transition hover:bg-[#e8f9f8]"
                  >
                    <FiEdit3 /> Edit Job
                  </Link>
                  <Link
                    to="/dashboard/employer/applications"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#132238] px-6 py-3.5 font-black text-white transition hover:bg-[#0d9f9a]"
                  >
                    <FiUsers /> View Applications
                  </Link>
                </div>
              )}

              {/* Actions for Admin */}
              {isAdmin && (
                <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
                  <Link
                    to="/dashboard/admin/jobs"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-black text-[#132238] transition hover:bg-slate-100"
                  >
                    <FiArrowLeft /> Back to Admin Jobs
                  </Link>
                </div>
              )}

              {/* Actions for Guest / Not Logged In */}
              {!currentUser && (
                <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#132238] px-8 py-3.5 font-black text-white transition hover:bg-[#0d9f9a]"
                  >
                    <FiSend /> Login to Apply
                  </Link>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
    </>
  );
};

const DetailList = ({ title, items }) => {
  const safeItems = Array.isArray(items) ? items : toList(items, []);
  if (!safeItems || safeItems.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-black text-[#132238]">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-600">
        {safeItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3">
            <span className="text-[#0d9f9a]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default JobDetails;