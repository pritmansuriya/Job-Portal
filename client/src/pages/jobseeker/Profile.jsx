import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { authStorage } from "../../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const lastUser = authStorage.getUser();
  const [profile, setProfile] = useState(lastUser ? { ...lastUser } : null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await api.get("/users/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Profile error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        authStorage.clear();
        navigate("/login");
        return;
      }

      if (lastUser) {
        setProfile({ ...lastUser });
      }
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

  const profileFields = [
    profile.name,
    profile.jobTitle,
    profile.email,
    profile.location,
    profile.phone,
    profile.bio,
    profile.skills?.length,
    profile.experience,
    profile.education,
    profile.resume,
    profile.projects,
    profile.certifications,
    profile.languages,
    profile.achievements,
  ];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const navItems = [
    ["Dashboard", "/dashboard/jobseeker", "🏠"], ["Find Jobs", "/dashboard/jobseeker#find-jobs", "🔍"],
    ["Saved Jobs", "/dashboard/jobseeker/saved", "❤️"], ["My Applications", "/dashboard/jobseeker/applications", "📄"],
    ["Notifications", "/dashboard/jobseeker/notifications", "🔔"], ["My Profile", "/dashboard/jobseeker/profile", "👤"],
    ["My Resume", "/dashboard/jobseeker/profile/edit", "📄"], ["Settings", "/dashboard/jobseeker/profile/edit", "⚙️"],
  ];

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#eaf4f2] text-[#132238]"><div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-[290px] shrink-0 bg-[#132238] px-6 py-8 text-white shadow-[10px_0_30px_rgba(19,34,56,0.15)] md:block">
        <div className="mb-10 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9f9a] text-xl font-black shadow-[4px_4px_0_#f6c453]">{profile.name?.charAt(0)?.toUpperCase() || "J"}</div><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Job Seeker</p><h2 className="mt-1 text-xl font-bold">{profile.name || "User"}</h2></div></div>
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-300">Profile</p><p className="mt-2 text-sm text-slate-100">{profile.email || "No email available"}</p></div>
        <nav className="space-y-2">{navItems.map(([label, path, icon]) => <Link key={label} to={path} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 hover:text-white ${label === "My Profile" ? "bg-white/10 text-white" : "text-slate-200"}`}><span className="text-lg">{icon}</span><span>{label}</span></Link>)}<button type="button" onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"><span>🚪</span><span>Logout</span></button></nav>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10"><div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-[#0d9f9a]">Job seeker portal</p><h1 className="mt-2 text-4xl font-black tracking-tight">My Profile</h1></div><Link to="/dashboard/jobseeker/profile/edit" className="rounded-xl bg-[#132238] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9f9a]">Edit Profile</Link></div>

        <section className="rounded-[2rem] bg-white p-6 shadow-[0_15px_35px_rgba(19,34,56,0.08)] md:p-8">
          <div className="flex flex-col items-center text-center"><div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0d9f9a] text-4xl font-black text-white shadow-[5px_5px_0_#f6c453]">{profile.name?.charAt(0)?.toUpperCase() || "J"}</div><h2 className="mt-5 text-3xl font-black">{profile.name || "John Doe"}</h2><p className="mt-1 text-lg font-semibold text-[#0d9f9a]">{profile.jobTitle || "Frontend Developer"}</p></div>
          <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3"><ContactItem icon="📧" value={profile.email || lastUser?.email || "No email"} /><ContactItem icon="📍" value={profile.location || "Location not added"} /><ContactItem icon="📱" value={profile.phone || "Phone not added"} /></div>
          <div className="mt-8"><div className="flex items-center justify-between text-sm font-bold"><span>Profile Completion</span><span className="text-[#0d9f9a]">{completion}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0d9f9a] transition-all" style={{ width: `${completion}%` }} /></div></div>
        </section>

        <ProfileSection title="About Me"><p className="leading-8 text-slate-600">{profile.bio || "Add a short introduction about your experience, goals, and the work you enjoy."}</p></ProfileSection>
        <ProfileSection title="Skills"><div className="flex flex-wrap gap-3">{(profile.skills?.length ? profile.skills : ["React", "JavaScript", "Node.js", "MongoDB", "Tailwind CSS"]).map((skill) => <span key={skill} className="rounded-full bg-[#e0f5f2] px-4 py-2 text-sm font-bold text-[#087b78]">{skill}</span>)}</div></ProfileSection>
        <ProfileSection title="Experience"><div className="border-l-4 border-[#0d9f9a] pl-5"><h3 className="text-xl font-black">{profile.jobTitle || "Frontend Developer"}</h3><p className="mt-1 font-semibold text-slate-500">{profile.experience || "Experience not added"}</p><p className="mt-1 text-sm text-slate-500">{profile.experience ? "Professional Experience" : "Add your company and dates from Edit Profile"}</p></div></ProfileSection>
        <ProfileSection title="Education"><p className="text-lg font-bold text-[#132238]">{profile.education || "B.Tech Computer Science"}</p></ProfileSection>
        <ProfileSection title="Projects"><p className="whitespace-pre-line leading-8 text-slate-600">{profile.projects || "Add your projects, responsibilities, and technologies used."}</p></ProfileSection>
        <ProfileSection title="Certifications"><p className="whitespace-pre-line leading-8 text-slate-600">{profile.certifications || "Add your professional certifications."}</p></ProfileSection>
        <ProfileSection title="Languages"><p className="leading-8 text-slate-600">{profile.languages || "Add the languages you speak."}</p></ProfileSection>
        <ProfileSection title="Achievements"><p className="whitespace-pre-line leading-8 text-slate-600">{profile.achievements || "Add your awards and achievements."}</p></ProfileSection>
        <ProfileSection title="Resume"><div className="flex flex-col gap-4 rounded-2xl bg-[#f5f7fb] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="text-2xl">📄</span><span className="font-bold">{profile.resume || "No resume uploaded"}</span></div>{profile.resume && <div className="flex gap-3"><a href={profile.resume} target="_blank" rel="noreferrer" className="rounded-xl border border-[#0d9f9a] px-4 py-2 text-sm font-bold text-[#087b78]">View</a><a href={profile.resume} download className="rounded-xl bg-[#132238] px-4 py-2 text-sm font-bold text-white">Download</a></div>}</div></ProfileSection>
      </div></main>
    </div></div>
  );
};

const ContactItem = ({ icon, value }) => <div className="flex items-center gap-3 text-sm text-slate-600"><span className="text-xl">{icon}</span><span>{value}</span></div>;
const ProfileSection = ({ title, children }) => <section className="mt-6 rounded-[1.7rem] bg-white p-6 shadow-[0_12px_25px_rgba(19,34,56,0.05)] md:p-7"><h2 className="mb-5 border-b border-slate-200 pb-4 text-2xl font-black">{title}</h2>{children}</section>;

export default Profile;