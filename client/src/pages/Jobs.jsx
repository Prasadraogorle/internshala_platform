import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (role !== "admin") return;

    await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const handleApply = async (id) => {
    if (!token) {
      navigate("/user-login");
      return;
    }

    await fetch(`http://localhost:5000/api/apply-job/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Applied Successfully");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6 py-10">

      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-[#2d2d2d]">
          Available Jobs
        </h1>

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-[#2d2d2d]">
              {job.title}
            </h3>

            <p className="text-[#8da242] font-medium">
              {job.company}
            </p>

            <div className="flex justify-between mt-4">
              <span>📍 {job.location}</span>
              <span>{job.salary}</span>
            </div>

            <div className="flex gap-4 mt-6">

              {role === "admin" && (
                <>
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="border border-[#8da242] text-[#8da242] px-4 py-2 rounded-full"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-full"
                  >
                    Delete
                  </button>
                </>
              )}

              {role === "user" && (
                <button
                  onClick={() => handleApply(job._id)}
                  className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-5 py-2 rounded-full"
                >
                  Apply Now
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
