import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "user") {
      navigate("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
          return;
        }

        setApplications(data);
      } catch (err) {
        setError("Failed to fetch applications");
      }
    };

    fetchApplications();
  }, [token, role, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6 py-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-[#2d2d2d]">
          My Applications
        </h1>

        {error && (
          <p className="mb-4 font-medium text-[#8da242]">
            {error}
          </p>
        )}

        {applications.length === 0 ? (
          <div className="bg-white/80 border border-[#a7bc5b]/40 rounded-2xl p-8 shadow-lg text-center">
            <p className="text-lg font-medium text-[#2d2d2d]">
              No applications yet.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-[#2d2d2d]">
                {app.internship.title}
              </h3>

              <p className="mt-1 text-[#2d2d2d]/70">
                {app.internship.company}
              </p>

              <div className="mt-4">
                <span className="text-sm font-medium text-[#2d2d2d]">
                  Status:
                </span>

                <span
                  className={`ml-3 px-4 py-1 rounded-full text-white text-sm font-medium ${
                    app.status === "accepted"
                      ? "bg-[#8da242]"
                      : app.status === "rejected"
                      ? "bg-[#a7bc5b]"
                      : "bg-[#8da242]"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApplications;
