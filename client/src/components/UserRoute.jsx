import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.role !== "user") {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default UserRoute;
