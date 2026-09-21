import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi, authStorage, getErrorMessage } from "../services/api";
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheck,
  FiKey,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

const DEFAULT_EMPLOYER_EMAIL = "employer@gmail.com";
const DEFAULT_EMPLOYER_PASSWORD = "Employer@123";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(location.state?.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState("jobseeker"); // 'jobseeker' | 'employer'

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setError("");
    if (role === "employer") {
      setForm({
        email: DEFAULT_EMPLOYER_EMAIL,
        password: DEFAULT_EMPLOYER_PASSWORD,
      });
    } else {
      setForm({
        email: "",
        password: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        email: form.email,
        password: form.password,
      });

      authStorage.setSession(response.data);

      const userRole = response.data.user?.role || "jobseeker";
      navigate(`/dashboard/${userRole}`);
    } catch (err) {
      const message = getErrorMessage(err, "Invalid email or password");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#132238] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-[12px_12px_0_#f6c453] md:p-10">
        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#0d9f9a]">
          Welcome back
        </p>
        <h1 className="mt-3 text-center text-4xl font-black tracking-tight text-[#132238]">
          Login
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Sign in to access your portal workspace.
        </p>

        {/* Role Mode Tabs */}
        <div className="mt-6 flex rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => handleRoleTabChange("jobseeker")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition ${
              activeRoleTab === "jobseeker"
                ? "bg-white text-[#132238] shadow-sm"
                : "text-slate-500 hover:text-[#132238]"
            }`}
          >
            <FiUser className="text-sm" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange("employer")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition ${
              activeRoleTab === "employer"
                ? "bg-[#17212b] text-[#c5f36c] shadow-sm"
                : "text-slate-500 hover:text-[#132238]"
            }`}
          >
            <FiBriefcase className="text-sm" />
            Employer
          </button>
        </div>

        {/* Employer Default Credentials Notice */}
        {activeRoleTab === "employer" && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <FiKey className="text-amber-600" />
              <span>Default Employer Credentials Pre-set:</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-700">
              Email: <strong>{DEFAULT_EMPLOYER_EMAIL}</strong>
              <br />
              Password: <strong>{DEFAULT_EMPLOYER_PASSWORD}</strong>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-semibold text-rose-700">
            <FiAlertCircle className="shrink-0 text-lg text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <FiMail />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <FiLock />
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#0d9f9a] focus:bg-white focus:ring-4 focus:ring-[#0d9f9a]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-2xl py-3.5 font-black text-white shadow-[4px_4px_0_#132238] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#132238] disabled:cursor-not-allowed disabled:opacity-60 ${
              activeRoleTab === "employer"
                ? "bg-[#17212b] text-[#c5f36c] hover:bg-[#2d3b47]"
                : "bg-[#0d9f9a] hover:bg-[#087b78]"
            }`}
          >
            {isSubmitting
              ? "Signing in..."
              : activeRoleTab === "employer"
                ? "Login as Employer"
                : "Login"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-slate-500">
          {activeRoleTab === "jobseeker" ? (
            <>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-black text-[#0d9f9a] hover:text-[#087b78]"
              >
                Register as Job Seeker
              </Link>
            </>
          ) : (
            <span>
              Employer accounts are restricted to pre-authorized access.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
