import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Job Seeker
import JobSeekerDashboard from "./pages/jobseeker/Dashboard";
import Profile from "./pages/jobseeker/Profile";
import Applications from "./pages/jobseeker/Applications";
import SavedJobs from "./pages/jobseeker/SavedJobs";

// Employer
import EmployerDashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import MyJobs from "./pages/employer/MyJobs";
import EmployerApplications from "./pages/employer/Applications";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Job Seeker */}
        <Route
          path="/dashboard/jobseeker"
          element={<JobSeekerDashboard />}
        />

        <Route
          path="/dashboard/jobseeker/profile"
          element={<Profile />}
        />

        <Route
          path="/dashboard/jobseeker/applications"
          element={<Applications />}
        />

        <Route
          path="/dashboard/jobseeker/saved"
          element={<SavedJobs />}
        />

        {/* Employer */}
        <Route
          path="/dashboard/employer"
          element={<EmployerDashboard />}
        />

        <Route
          path="/dashboard/employer/post-job"
          element={<PostJob />}
        />

        <Route
          path="/dashboard/employer/jobs"
          element={<MyJobs />}
        />

        <Route
          path="/dashboard/employer/applications"
          element={<EmployerApplications />}
        />

        {/* Admin */}
        <Route
          path="/dashboard/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/dashboard/admin/users"
          element={<Users />}
        />

        <Route
          path="/dashboard/admin/jobs"
          element={<AdminJobs />}
        />

        <Route
          path="/dashboard/admin/applications"
          element={<AdminApplications />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;