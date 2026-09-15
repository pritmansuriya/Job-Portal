import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  applicationsApi,
  authStorage,
  getErrorMessage,
  jobsApi,
  usersApi,
} from "../services/api";

const defaultResponsibilities = [
  "Build React applications",
  "Work with designers",
  "Write reusable components",
];

const defaultRequirements = ["React", "JavaScript", "HTML/CSS", "Git"];

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
  const currentUser = authStorage.getUser();
  const isJobseeker = currentUser?.role === "jobseeker";

  useEffect(() => {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      setError("Invalid job ID. Open a job from the jobs list.");
      return;
    }

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

  const postedLabel = job?.createdAt
    ? `${Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000))} days ago`
    : "Recently posted";
  const responsibilities = job?.responsibilities?.length ? job.responsibilities : defaultResponsibilities;
  const requirements = job?.requirements?.length ? job.requirements : defaultRequirements;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eaf4f2] px-6 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          {error && !job && <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">{error}</p>}
          {!job && !error && <p className="text-slate-500">Loading job...</p>}

          {job && (
            <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(19,34,56,0.08)] md:p-10">
              <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d9f9a]">{job.company}</p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight text-[#132238] md:text-5xl">{job.title}</h1>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>💼 {job.jobType || "Full Time"}</span>
                    <span>🏢 {job.workMode || (job.jobType === "Remote" ? "Remote" : "Hybrid")}</span>
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

              <section className="mt-8">
                <h2 className="text-2xl font-black text-[#132238]">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(job.skills?.length ? job.skills : ["React", "JavaScript", "Tailwind", "Git"]).map((skill) => (
                    <span key={skill} className="rounded-full bg-[#e0f5f2] px-4 py-2 text-sm font-bold text-[#087b78]">{skill}</span>
                  ))}
                </div>
              </section>

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

              <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                {isJobseeker && <button type="button" onClick={toggleSaved} disabled={isSaving} className="rounded-xl border border-slate-300 px-6 py-3.5 font-black text-[#132238] transition hover:border-[#0d9f9a] hover:text-[#0d9f9a] disabled:opacity-60">
                  {isSaved ? "♥ Saved Job" : "♡ Save Job"}
                </button>}
                {isJobseeker && <button type="button" onClick={openApplicationForm} className="rounded-xl bg-[#132238] px-8 py-3.5 font-black text-white transition hover:bg-[#0d9f9a]">
                  🚀 Apply Now
                </button>}
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
};

const DetailList = ({ title, items }) => (
  <section className="mt-8">
    <h2 className="text-2xl font-black text-[#132238]">{title}</h2>
    <ul className="mt-4 space-y-3 text-slate-600">
      {items.map((item) => <li key={item} className="flex gap-3"><span className="text-[#0d9f9a]">•</span><span>{item}</span></li>)}
    </ul>
  </section>
);

export default JobDetails;