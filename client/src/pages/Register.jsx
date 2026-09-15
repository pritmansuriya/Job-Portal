import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi, authStorage, getErrorMessage } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.register(form);
      authStorage.setSession(response.data);
      navigate(`/dashboard/${response.data.user?.role || "jobseeker"}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#132238] px-6 py-12">

      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-[12px_12px_0_#69d4cf] md:p-10">

        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#0d9f9a]">Your next move</p>
        <h1 className="mt-3 text-center text-4xl font-black tracking-tight text-[#132238]">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-[#69d4cf] focus:bg-white focus:ring-4 focus:ring-[#69d4cf]/20"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#0d9f9a] py-3.5 font-black text-white shadow-[4px_4px_0_#132238] transition-all hover:-translate-y-0.5 hover:bg-[#087b78] hover:shadow-[6px_6px_0_#132238]"
          >
            {isSubmitting ? "Creating account..." : "Register"}
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
  );
};

export default Register;