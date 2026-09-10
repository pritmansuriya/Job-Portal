import { useState } from "react";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    // Later:
    // POST /api/jobs
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
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
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
          className="bg-blue-600 text-white px-7 py-3 rounded-lg"
        >
          Publish Job
        </button>

      </form>

    </div>
  );
};

export default PostJob;