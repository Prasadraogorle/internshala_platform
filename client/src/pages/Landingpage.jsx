import React from "react";

const Landingpage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] 
    bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 
    flex items-center justify-center px-4">

      <div className="max-w-5xl w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
          Find the right{" "}
          <span className="text-[#8da242]">Internship</span> or{" "}
          <span className="text-[#a7bc5b]">Job</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-700 text-lg mb-12">
          India’s largest internship and job platform for students and freshers
        </p>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-14">

          <div className="flex items-center bg-white 
          border border-[#a7bc5b] rounded-xl px-5 py-3 
          w-full md:w-[420px] shadow-md">

            <i className="bi bi-search text-[#8da242] mr-3 text-lg"></i>

            <input
              type="text"
              placeholder="Search internships or jobs"
              className="outline-none w-full text-gray-700"
            />
          </div>

          <button className="bg-gradient-to-r from-[#8da242] to-[#a7bc5b] 
          text-white px-8 py-3 rounded-xl shadow-md 
          hover:opacity-90 transition duration-300">
            Search
          </button>

        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-6 mt-6">

          <button className="border-2 border-[#8da242] 
          text-[#8da242] px-8 py-3 rounded-xl 
          hover:bg-[#8da242] hover:text-white 
          transition duration-300 shadow-sm">
            Explore Internships
          </button>

          <button className="border-2 border-[#a7bc5b] 
          text-[#8da242] px-8 py-3 rounded-xl 
          hover:bg-[#a7bc5b] hover:text-white 
          transition duration-300 shadow-sm">
            Explore Jobs
          </button>

        </div>

      </div>
    </div>
  );
};

export default Landingpage;
