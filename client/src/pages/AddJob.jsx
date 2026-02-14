import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add job");
        return;
      }

      navigate("/jobs");

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-[#a7bc5b]/40">

        <h1 className="text-3xl font-bold text-center text-[#2d2d2d] mb-8">
          Add Job
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] p-3 rounded-xl"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] p-3 rounded-xl"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] p-3 rounded-xl"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white font-semibold py-3 rounded-xl shadow-md"
          >
            Add Job
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddJob;
