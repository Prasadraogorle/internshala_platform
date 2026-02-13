import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddInternship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    stipend: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/internships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            stipend: Number(formData.stipend),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add internship");
      }

      navigate("/internships");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-[#a7bc5b]/40">

        <h1 className="text-3xl font-bold text-center text-[#2d2d2d] mb-8">
          Add Internship
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Internship Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="number"
            name="stipend"
            placeholder="Stipend"
            value={formData.stipend}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition-transform shadow-md"
          >
            Add Internship
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddInternship;
