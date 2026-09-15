import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi, getErrorMessage } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate("/login");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#132238] px-6 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[12px_12px_0_#69d4cf]">
        <div className="grid md:grid-cols-2">
          <div className="bg-[#132238] px-8 py-10 text-white md:px-10 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#69d4cf]">Join us</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Create Account</h1>
            <p className="mt-4 max-w-md text-slate-300">
              Start your journey with the right opportunities and connect with the right employers.
            </p>

            <div className="mt-8 grid gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "jobseeker" })}
                className={`rounded-2xl border p-4 text-left transition ${
                  form.role === "jobseeker"
                    ? "border-[#69d4cf] bg-[#1b3151]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="text-sm font-black uppercase tracking-[0.18em] text-[#69d4cf]">Job Seeker</div>
                <div className="mt-2 text-lg font-semibold">I’m looking for a job</div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: "employer" })}
                className={`rounded-2xl border p-4 text-left transition ${
                  form.role === "employer"
                    ? "border-[#f6c453] bg-[#2a1e0d]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="text-sm font-black uppercase tracking-[0.18em] text-[#f6c453]">Employer</div>
                <div className="mt-2 text-lg font-semibold">I’m hiring employees</div>
              </button>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#0d9f9a] py-3.5 font-black text-white shadow-[4px_4px_0_#132238] transition-all hover:-translate-y-0.5 hover:bg-[#087b78] hover:shadow-[6px_6px_0_#132238] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-[#0d9f9a] hover:text-[#087b78]">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;