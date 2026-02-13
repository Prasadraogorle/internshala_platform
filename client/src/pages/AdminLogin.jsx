import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const AdminLogin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [token, role, navigate]);

  const [formData, setFormData] = useState({
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

  const saveAdmin = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.role !== "admin") {
      setError("This account is not authorized as admin.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);

    navigate("/admin-dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      saveAdmin(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      saveAdmin(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6">
      <div className="w-full max-w-md bg-white/90 border border-[#a7bc5b]/40 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#8da242]">
          Admin Login
        </h2>

        {error && (
          <p className="text-center mb-4 text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-[#a7bc5b] px-4 py-3 rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-[#a7bc5b] px-4 py-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8da242] to-[#a7bc5b] text-white py-3 rounded-full"
          >
            Login as Admin
          </button>
        </form>

        <div className="my-6 text-center">OR</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
