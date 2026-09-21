import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiBell, FiBriefcase, FiCalendar, FiGrid, FiLogOut, FiPlus, FiSettings, FiUsers } from "react-icons/fi";
import { authStorage, getErrorMessage, jobsApi } from "../../services/api";

const navigation = [
  ["Dashboard", "/dashboard/employer", FiGrid],
  ["Post a Job", "/dashboard/employer/post-job", FiPlus],
  ["My Jobs", "/dashboard/employer/jobs", FiBriefcase],
  ["Applications", "/dashboard/employer/applications", FiUsers],
  ["Interviews", "/dashboard/employer/interviews", FiCalendar],
  ["Notifications", "/dashboard/employer/notifications", FiBell],
  ["Company Profile", "/dashboard/employer/profile", FiBriefcase],
  ["Settings", "/dashboard/employer/settings", FiSettings],
];

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full Time",
    workMode: "Hybrid",
    experience: "1-3 Years",
    skills: [],
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = authStorage.getUser();

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const toggleSkill = (skill) => updateField("skills", form.skills.includes(skill) ? form.skills.filter((item) => item !== skill) : [...form.skills, skill]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await jobsApi.create(form);
      navigate("/dashboard/employer/jobs");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to publish job"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => { authStorage.clear(); navigate("/login"); window.location.reload(); };
  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]";
  const labelClass = "text-sm font-bold text-[#17212b]";

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f2] text-[#17212b]"><div className="mx-auto flex h-screen max-w-[1680px] overflow-hidden">
      <aside className="hidden w-68.5 shrink-0 flex-col overflow-y-auto bg-[#17212b] px-5 py-7 text-white lg:flex"><Link to="/dashboard/employer" className="mb-12 flex items-center gap-3 px-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5f36c] text-[#17212b] shadow-[4px_4px_0_#f4a261]"><FiBriefcase /></span><span className="text-lg font-black tracking-[0.18em]">JOB PORTAL</span></Link><p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Workspace</p><nav className="mt-4 space-y-1.5">{navigation.map(([label, path, Icon]) => <Link key={label} to={path} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === "Post a Job" ? "bg-[#c5f36c] text-[#17212b]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="text-lg" /><span>{label}</span></Link>)}</nav><div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold text-slate-400">Need a hand?</p><p className="mt-1 text-sm leading-5 text-slate-200">Create a role candidates want to join.</p><Link to="/contact" className="mt-4 flex items-center gap-2 text-xs font-black text-[#c5f36c]">Contact support <FiArrowUpRight /></Link></div><button type="button" onClick={handleLogout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"><FiLogOut /> Logout</button></aside>
      <main className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-11 lg:py-9"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-3 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a45]">Employer workspace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Post New Job</h1><p className="mt-2 text-sm text-slate-500">Share the opportunity and find the people who will move your team forward.</p></div><Link to="/dashboard/employer" className="text-sm font-black text-[#b65b2d]">Back to dashboard <FiArrowUpRight className="inline" /></Link></header>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(23,33,43,0.04)] sm:p-8"><div className="mb-6"><h2 className="text-xl font-black">Role details</h2><p className="mt-1 text-sm text-slate-500">Start with the essentials candidates look for first.</p></div><div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Job Title<input required className={inputClass} placeholder="Frontend Developer" value={form.title} onChange={(e) => updateField("title", e.target.value)} /></label><label className={labelClass}>Company<input required className={inputClass} placeholder="ABC Technologies" value={form.company} onChange={(e) => updateField("company", e.target.value)} /></label><label className={labelClass}>Location<input required className={inputClass} placeholder="Ahmedabad" value={form.location} onChange={(e) => updateField("location", e.target.value)} /></label><label className={labelClass}>Salary<input required className={inputClass} placeholder="₹5 - ₹8 LPA" value={form.salary} onChange={(e) => updateField("salary", e.target.value)} /></label><SelectField label="Job Type" value={form.jobType} onChange={(value) => updateField("jobType", value)} options={["Full Time", "Part Time", "Internship", "Contract"]} inputClass={inputClass} labelClass={labelClass} /><SelectField label="Work Mode" value={form.workMode} onChange={(value) => updateField("workMode", value)} options={["On-site", "Hybrid", "Remote"]} inputClass={inputClass} labelClass={labelClass} /><SelectField label="Experience" value={form.experience} onChange={(value) => updateField("experience", value)} options={["Fresher", "1-3 Years", "3-5 Years", "5+ Years"]} inputClass={inputClass} labelClass={labelClass} /><label className={labelClass}>Application Deadline<input type="date" className={inputClass} value={form.deadline} onChange={(e) => updateField("deadline", e.target.value)} /></label></div><div className="mt-5"><p className={labelClass}>Skills</p><div className="mt-2 flex flex-wrap gap-2">{["React", "JavaScript", "Node.js", "MongoDB", "TypeScript"].map((skill) => <button type="button" key={skill} onClick={() => toggleSkill(skill)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${form.skills.includes(skill) ? "border-[#17212b] bg-[#17212b] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#e07a45]"}`}>{skill}</button>)}</div></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(23,33,43,0.04)] sm:p-8"><h2 className="text-xl font-black">Role overview</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><TextArea label="Description" placeholder="Tell candidates what makes this role exciting..." value={form.description} onChange={(value) => updateField("description", value)} required labelClass={labelClass} /><TextArea label="Responsibilities" placeholder="What will this person own day to day?" value={form.responsibilities} onChange={(value) => updateField("responsibilities", value)} labelClass={labelClass} /><TextArea label="Requirements" placeholder="Skills, experience, and qualifications..." value={form.requirements} onChange={(value) => updateField("requirements", value)} labelClass={labelClass} /><TextArea label="Benefits" placeholder="Share the benefits and perks of joining your team..." value={form.benefits} onChange={(value) => updateField("benefits", value)} labelClass={labelClass} /></div></section>
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">{error}</p>}<div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[#17212b] px-6 py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#f4a261] transition hover:-translate-y-0.5 hover:bg-[#2d3b47] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Publishing..." : "Publish Job"} <FiArrowUpRight /></button></div></form>
      </div></main>
    </div></div>
  );
};

const SelectField = ({ label, value, onChange, options, inputClass, labelClass }) => <label className={labelClass}>{label}<select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
const TextArea = ({ label, placeholder, value, onChange, required, labelClass }) => <label className={labelClass}>{label}<textarea required={required} rows="5" className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#e07a45] focus:ring-4 focus:ring-[#fce7d5]" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></label>;

export default PostJob;