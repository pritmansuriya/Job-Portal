import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, jobsApi } from "../../services/api";

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full Time",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold">
        Post a Job
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-8 mt-8 max-w-4xl space-y-5"
      >

        {error && <p className="text-red-600">{error}</p>}

        <input
          placeholder="Job Title"
          className="w-full border rounded-lg px-4 py-3"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Company Name"
          className="w-full border rounded-lg px-4 py-3"
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
        />

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Location"
            className="border rounded-lg px-4 py-3"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            placeholder="Salary"
            className="border rounded-lg px-4 py-3"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

        </div>

        <select
          className="w-full border rounded-lg px-4 py-3"
          value={form.jobType}
          onChange={(e) =>
            setForm({ ...form, jobType: e.target.value })
          }
        >
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Remote</option>
          <option>Internship</option>
        </select>

        <textarea
          rows="7"
          placeholder="Job Description"
          className="w-full border rounded-lg px-4 py-3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-7 py-3 rounded-lg"
        >
          {isSubmitting ? "Publishing..." : "Publish Job"}
        </button>

      </form>

    </div>
  );
};

export default PostJob;