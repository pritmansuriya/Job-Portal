import { Link, useNavigate } from "react-router-dom";
import { FiBriefcase, FiUser } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <FiBriefcase />
          JobPortal
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/jobs" className="hover:text-blue-600">
            Jobs
          </Link>

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

        <FiUser className="md:hidden text-xl" />
      </div>
    </nav>
  );
};

export default Navbar;