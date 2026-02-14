import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
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
    fetchStats();
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
        setError(data.message || "Failed to fetch applications");
        return;
      }

      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load applications");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#2d2d2d] mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/90 p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold text-[#8da242]">
                {stats.totalInternships}
              </h2>
              <p className="text-[#2d2d2d]">Internships</p>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold text-[#8da242]">
                {stats.totalJobs}
              </h2>
              <p className="text-[#2d2d2d]">Jobs</p>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold text-[#8da242]">
                {stats.totalApplications}
              </h2>
              <p className="text-[#2d2d2d]">Applications</p>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold text-[#8da242]">
                {stats.totalUsers}
              </h2>
              <p className="text-[#2d2d2d]">Users</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4 mb-10 justify-center">
          <button
            onClick={() => navigate("/add-internship")}
            className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-6 py-2 rounded-full shadow hover:scale-[1.05] transition"
          >
            + Add Internship
          </button>

          <button
            onClick={() => navigate("/add-job")}
            className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-6 py-2 rounded-full shadow hover:scale-[1.05] transition"
          >
            + Add Job
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 font-medium mb-6">
            {error}
          </p>
        )}

        {/* Applications */}
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
                  {app?.user?.name || "Unknown"} (
                  {app?.user?.email || "Unknown"})
                </span>
              </p>

              <p className="mt-2">
                Status:
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-[#a7bc5b]/30 text-[#2d2d2d]">
                  {app.status}
                </span>
              </p>

              <div className="mt-5 flex gap-4">
                <button
                  onClick={() => updateStatus(app._id, "accepted")}
                  className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-5 py-2 rounded-full shadow"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="border border-[#8da242] text-[#8da242] px-5 py-2 rounded-full hover:bg-[#a7bc5b]/30"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
