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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="bg-white border rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
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
            className="w-full border rounded-lg px-4 py-3"
          />

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

          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;