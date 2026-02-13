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
      const res = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-4">

      <div className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 p-10 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold mb-8 text-center text-[#2d2d2d]">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 text-sm font-medium text-[#8da242] text-center">
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
            className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242] transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242] transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b]/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8da242] transition"
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
  );
};

export default Register;
