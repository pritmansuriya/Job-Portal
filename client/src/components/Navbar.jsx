import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBriefcase, FiUser } from "react-icons/fi";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f5f7f4]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-xl font-black tracking-tight text-[#132238]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#132238] text-[#f6c453] shadow-[4px_4px_0_#f6c453] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
            <FiBriefcase className="text-lg" />
          </span>
          <span>Job<span className="text-[#0d9f9a]">Portal</span></span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 md:flex">

          <Link to="/" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0d9f9a]">
            Home
          </Link>

          <Link to="/jobs" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0d9f9a]">
            Jobs
          </Link>

         

          {/* Login */}
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0d9f9a]">
            Login
          </Link>

          {/* Register */}
          <Link
            to="/register"
            className="ml-2 flex items-center gap-2 rounded-full bg-[#0d9f9a] px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#132238] transition-all hover:-translate-y-0.5 hover:bg-[#087b78] hover:shadow-[5px_5px_0_#132238]"
          >
            Register
            <FiArrowUpRight />
          </Link>

          {isLoggedIn && (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <Link
                to="/dashboard/jobseeker/profile"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <FiUser />
                Profile
              </Link>
            </>
          )}

        </div>

        {/* Mobile User Icon */}
        <FiUser className="text-xl text-[#132238] md:hidden" />
      </div>
    </nav>
  );
};

export default Navbar;