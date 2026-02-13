import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
  navigate("/admin-login");
  return;
}


    if (role !== "admin") {
      navigate("/");
      return;
    }

    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch");
        return;
      }

      // Make sure it's array
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }

    } catch (err) {
      setError("Failed to load applications");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-[#2d2d2d] mb-8 text-center">
          Admin Dashboard - Applications
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium mb-6">
            {error}
          </p>
        )}

        {applications.length === 0 ? (
          <p className="text-center text-[#2d2d2d]">
            No applications found.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl p-6 mb-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-[#2d2d2d]">
                {app?.internship?.title || "No Title"}
              </h3>

              <p className="text-[#8da242] font-medium">
                {app?.internship?.company || "No Company"}
              </p>

              <p className="mt-3 text-[#2d2d2d]">
                Applicant:
                <span className="ml-2 font-semibold">
                  {app?.user?.name || "Unknown"} ({app?.user?.email || "Unknown"})
                </span>
              </p>

              <p className="mt-2">
                Status:
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-[#a7bc5b]/30 text-[#2d2d2d]">
                  {app.status}
                </span>
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
