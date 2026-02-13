import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    stipend: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/internships/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setFormData({
          title: data.title,
          company: data.company,
          location: data.location,
          stipend: data.stipend,
        })
      );
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/internships/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        stipend: Number(formData.stipend),
      }),
    });

    navigate("/internships");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-[#a7bc5b]/40">

        <h1 className="text-3xl font-bold text-center text-[#2d2d2d] mb-8">
          Edit Internship
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <input
            type="number"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            required
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none p-3 rounded-xl transition"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition-transform shadow-md"
          >
            Update Internship
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditInternship;
