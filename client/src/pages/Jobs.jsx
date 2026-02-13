import React from "react";

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Pvt Ltd",
    location: "Hyderabad",
    salary: "₹4 - 6 LPA",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Innovate Labs",
    location: "Bangalore",
    salary: "₹5 - 8 LPA",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Startup Hub",
    location: "Remote",
    salary: "₹6 - 10 LPA",
  },
];

const Jobs = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6 py-10">

      <div className="max-w-7xl mx-auto flex gap-8">

        {/* FILTER SECTION */}
        <div className="w-1/4 bg-white/90 backdrop-blur-md p-6 border border-[#a7bc5b]/40 rounded-2xl shadow-lg h-fit">

          <h2 className="text-xl font-semibold mb-6 text-[#2d2d2d]">
            Filters
          </h2>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-[#2d2d2d]">
              Location
            </label>
            <input
              type="text"
              placeholder="Search location"
              className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none px-4 py-2 rounded-xl transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[#2d2d2d]">
              Minimum Salary (LPA)
            </label>
            <input
              type="number"
              placeholder="4"
              className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none px-4 py-2 rounded-xl transition"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white py-2 rounded-full shadow hover:scale-[1.05] transition-transform">
            Apply Filters
          </button>
        </div>

        {/* JOB LISTINGS */}
        <div className="w-3/4">

          <h1 className="text-3xl font-bold text-[#2d2d2d] mb-8">
            Available Jobs
          </h1>

          <div className="space-y-6">
            {jobsData.map((job) => (
              <div
                key={job.id}
                className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-[#2d2d2d]">
                  {job.title}
                </h3>

                <p className="text-[#8da242] font-medium">
                  {job.company}
                </p>

                <div className="flex justify-between mt-4 text-[#2d2d2d]">
                  <span>📍 {job.location}</span>
                  <span>{job.salary}</span>
                </div>

                <button className="mt-6 bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-5 py-2 rounded-full shadow hover:scale-[1.05] transition-transform">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Jobs;
