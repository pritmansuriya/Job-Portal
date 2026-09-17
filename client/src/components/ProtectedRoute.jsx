import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../services/api";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const user = authStorage.getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ fromUnauthorized: true, message: "Please log in to access this page." }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for this role
    if (user.role === "jobseeker") {
      return <Navigate to="/dashboard/jobseeker" replace state={{ message: "Access restricted to employers only." }} />;
    }
    return <Navigate to="/login" replace state={{ message: "Access restricted." }} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

