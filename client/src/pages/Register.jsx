import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#8da242] to-[#a7bc5b] text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6">
          Join InternHub Today
        </h1>

        <p className="text-lg mb-6 leading-relaxed">
          Create your account to explore internships, apply to companies,
          and kickstart your career journey.
        </p>

        <ul className="space-y-4 text-lg">
          <li>✔ Browse Verified Internships</li>
          <li>✔ Apply in One Click</li>
          <li>✔ Track Your Applications</li>
          <li>✔ Secure & Fast Platform</li>
        </ul>

        <div className="mt-10 text-sm opacity-80">
          Your career starts here.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6">
        <div className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 p-10 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-3xl font-bold mb-8 text-center text-[#2d2d2d]">
            Create Account
          </h2>

          {error && (
            <p className="mb-4 text-sm font-medium text-red-500 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242]"
            />

            <button
              type="submit"
              className="w-full bg-[#8da242] text-white py-3 rounded-xl hover:bg-[#a7bc5b] transition font-semibold shadow-md"
            >
              Register
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;