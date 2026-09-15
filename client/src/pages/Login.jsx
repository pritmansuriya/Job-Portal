import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi, authStorage, getErrorMessage } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await authApi.login({
      email: form.email,
      password: form.password,
    });

    console.log("Login response:", response.data);

    // Save JWT token
    authStorage.setSession(response.data);

    navigate(`/dashboard/${response.data.user?.role || "jobseeker"}`);

  } catch (error) {
    console.error(
      "Login error:",
      getErrorMessage(error, "Login failed")
    );

    alert(
      getErrorMessage(error, "Login failed")
    );
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#132238] px-6 py-12">

      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-[12px_12px_0_#f6c453] md:p-10">

        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#0d9f9a]">Welcome back</p>
        <h1 className="mt-3 text-center text-4xl font-black tracking-tight text-[#132238]">
          Login
        </h1>

        <p className="mt-3 text-center text-slate-500">
          Pick up where your next chapter begins.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#0d9f9a] py-3.5 font-black text-white shadow-[4px_4px_0_#132238] transition-all hover:-translate-y-0.5 hover:bg-[#087b78] hover:shadow-[6px_6px_0_#132238]"
          >
            Login
          </button>

        </form>

        <p className="mt-7 text-center text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-black text-[#0d9f9a] hover:text-[#087b78]"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;