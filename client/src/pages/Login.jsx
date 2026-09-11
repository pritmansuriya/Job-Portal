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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="bg-white border rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Welcome back
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;