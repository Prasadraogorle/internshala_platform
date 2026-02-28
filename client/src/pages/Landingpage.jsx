import React, { useEffect, useState } from "react";
import manImage from "../assets/image1.png"; // ✅ Import local image

const Landingpage = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 25;
      const y = (e.clientY - window.innerHeight / 2) / 25;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-[#f4f8e8] to-[#e3ecc2] overflow-hidden flex items-center justify-center">

      {/* Background Blobs */}
      <div className="absolute w-96 h-96 bg-[#a7bc5b]/20 rounded-full -top-20 -left-20 blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-[#8da242]/20 rounded-full -bottom-20 -right-20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-20 px-8">

        {/* LEFT SIDE TEXT */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Building Dreams Through{" "}
            <span className="text-[#8da242]">Internships</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Every application is a step closer to your career.
            Start exploring opportunities and shape your future.
          </p>

          <button className="bg-gradient-to-r from-[#8da242] to-[#a7bc5b] text-white px-8 py-3 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
            Get Started
          </button>
        </div>

        {/* RIGHT SIDE IMAGE (Local) */}
        <div
          style={{
            transform: `translate(${mouse.x}px, ${mouse.y}px)`
          }}
          className="transition-transform duration-150"
        >
          <img
            src={manImage}   // ✅ Use imported image
            alt="Man applying for internship"
            className="w-[420px] drop-shadow-2xl select-none"
            draggable="false"
          />
        </div>

      </div>
    </div>
  );
};

export default Landingpage;