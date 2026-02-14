import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";

import Landingpage from "./pages/Landingpage";
import Internships from "./pages/Internships";
import Jobs from "./pages/Jobs";
import InternshipDetails from "./pages/InternshipDetails";
import AddInternship from "./pages/AddInternship";
import EditInternship from "./pages/EditInternship";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";

import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import AddJob from "./pages/AddJob";


function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // Responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 Smart Auto Redirect + Token Validation
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Token expired → logout
      if (decoded.exp < currentTime) {
        localStorage.clear();
        navigate("/");
        return;
      }

      // Redirect only if on root
      if (location.pathname === "/") {
        if (decoded.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/internships");
        }
      }

    } catch (error) {
      localStorage.clear();
      navigate("/");
    }
  }, [token, location.pathname, navigate]);

  return (
    <div className="w-full min-h-screen">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <main className="pt-4 px-6">
        <Routes>

          {/* Public */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Only */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/add-internship"
            element={
              <AdminRoute>
                <AddInternship />
              </AdminRoute>
            }
          />

          <Route
            path="/edit-internship/:id"
            element={
              <AdminRoute>
                <EditInternship />
              </AdminRoute>
            }
          />

          {/* User Only */}
          <Route
            path="/my-applications"
            element={
              <UserRoute>
                <MyApplications />
              </UserRoute>
            }
          />
          <Route
  path="/add-job"
  element={
    <AdminRoute>
      <AddJob />
    </AdminRoute>
  }
/>


        </Routes>
      </main>
    </div>
  );
}

export default App;
