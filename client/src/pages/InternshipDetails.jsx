import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/internships/${id}`
        );

        if (!res.ok) {
          throw new Error("Internship not found");
        }

        const data = await res.json();
        setInternship(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleApply = async () => {
    if (!token) {
      navigate("/register");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/apply/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Application submitted successfully");
    } catch (error) {
      setMessage("Application failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-[#8da242] font-medium">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-[#8da242] font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 flex items-center justify-center px-4">

      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-[#2d2d2d] mb-3">
          {internship.title}
        </h1>

        <p className="text-[#8da242] font-semibold text-lg mb-4">
          {internship.company}
        </p>

        <div className="text-[#2d2d2d] mb-6">
          📍 {internship.location} | ₹{internship.stipend} /month
        </div>

        <p className="text-[#2d2d2d] leading-relaxed">
          This is a great opportunity to gain real-world experience and
          enhance your professional skills in a dynamic environment.
        </p>

        {/* APPLY SECTION */}

       {role === "user" && (
  <button
    onClick={handleApply}
    className="mt-6 bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-6 py-2 rounded-full"
  >
    Apply Now
  </button>
)}

{role === "admin" && (
  <button
    disabled
    className="mt-6 bg-gray-300 text-gray-600 px-6 py-2 rounded-full cursor-not-allowed"
  >
    Admin Cannot Apply
  </button>
)}

{!token && (
  <button
    onClick={() => navigate("/login")}
    className="mt-6 bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-6 py-2 rounded-full"
  >
    Login to Apply
  </button>
)}


        {/* MESSAGE */}
        {message && (
          <p className="mt-6 font-semibold text-[#8da242]">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default InternshipDetails;
