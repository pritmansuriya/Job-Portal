import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FiArrowUpRight, FiBriefcase, FiUser } from "react-icons/fi";
import { authStorage } from "../services/api";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const currentUser = authStorage.getUser();

  const dashboardPath =
    currentUser?.role === "employer"
      ? "/dashboard/employer"
      : currentUser?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/jobseeker/profile";

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Jobs", id: "jobs" },
    { label: "Companies", id: "companies" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const targetId = location.state?.scrollTo || location.hash?.replace("#", "");
    if (!targetId) return;

    const timer = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (location.state?.scrollTo) {
        navigate("/", { replace: true, state: {} });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, location.state, location.hash, navigate]);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const navLinkClass =
    "rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0d9f9a] cursor-pointer";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f5f7f4]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-5 py-3 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="group flex items-center gap-3 text-xl font-black tracking-tight text-[#132238]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#132238] text-[#f6c453] shadow-[4px_4px_0_#f6c453] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
            <FiBriefcase className="text-lg" />
          </span>
          <span>
            Job<span className="text-[#0d9f9a]">Portal</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={navLinkClass}
            >
              {item.label}
            </button>
          ))}

          {!isLoggedIn && (
            <>
              <Link to="/login" className={navLinkClass}>
                Login
              </Link>

              <Link
                to="/register"
                className="ml-2 flex items-center gap-2 rounded-full bg-[#0d9f9a] px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#132238] transition-all hover:-translate-y-0.5 hover:bg-[#087b78] hover:shadow-[5px_5px_0_#132238]"
              >
                Register
                <FiArrowUpRight />
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <NotificationBell />

              <Link
                to={dashboardPath}
                className="flex items-center gap-2 font-bold text-slate-700 hover:text-[#0d9f9a]"
              >
                <FiUser />
                {currentUser?.role === "employer"
                  ? "Dashboard"
                  : currentUser?.role === "admin"
                  ? "Admin"
                  : "Profile"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile icon placeholder */}
        <Link
          to={isLoggedIn ? dashboardPath : "/login"}
          aria-label={isLoggedIn ? "Open profile" : "Login"}
          className="text-xl text-[#132238] md:hidden"
        >
          <FiUser />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;