import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
