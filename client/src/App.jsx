import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";

import Landingpage from "./pages/Landingpage";
import Internships from "./pages/Internships";
import Jobs from "./pages/Jobs";
import InternshipDetails from "./pages/InternshipDetails";
import AddInternship from "./pages/AddInternship";
import EditInternship from "./pages/EditInternship";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";


function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <main className="pt-4 px-6">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />

          <Route
            path="/add-internship"
            element={
              <ProtectedRoute>
                <AddInternship />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-internship/:id"
            element={
              <ProtectedRoute>
                <EditInternship />
              </ProtectedRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Separate logins */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
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

<Route
  path="/admin-dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/my-applications"
  element={
    <UserRoute>
      <MyApplications />
    </UserRoute>
  }
/>

        </Routes>
      </main>
    </div>
  );
}

export default App;
