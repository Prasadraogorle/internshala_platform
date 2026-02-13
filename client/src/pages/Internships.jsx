import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Internships = () => {
  const [internshipsData, setInternshipsData] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ FIXED

  useEffect(() => {
    fetch("http://localhost:5000/api/internships")
      .then((res) => res.json())
      .then((data) => setInternshipsData(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredInternships = internshipsData.filter((internship) => {
    const matchesLocation =
      internship.location
        ?.toLowerCase()
        .includes(locationFilter.toLowerCase());

    const matchesStipend =
      stipendFilter === "" ||
      internship.stipend >= Number(stipendFilter);

    return matchesLocation && matchesStipend;
  });

  const handleDelete = async (id) => {
    if (role !== "admin") return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/internships/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Delete failed");
        return;
      }

      setInternshipsData((prev) =>
        prev.filter((internship) => internship._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 px-6 py-10">
      <div className="max-w-7xl mx-auto flex gap-8">

        {/* FILTERS */}
        <div className="w-1/4 bg-white/90 backdrop-blur-md p-6 border border-[#a7bc5b]/40 rounded-2xl shadow-lg h-fit">
          <h2 className="text-xl font-semibold mb-6 text-[#2d2d2d]">
            Filters
          </h2>

          <input
            type="text"
            placeholder="Search location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none px-4 py-2 rounded-xl mb-4 transition"
          />

          <input
            type="number"
            placeholder="Minimum Stipend"
            value={stipendFilter}
            onChange={(e) => setStipendFilter(e.target.value)}
            className="w-full border border-[#a7bc5b] focus:border-[#8da242] focus:ring-2 focus:ring-[#8da242]/40 outline-none px-4 py-2 rounded-xl transition"
          />
        </div>

        {/* LISTINGS */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-[#2d2d2d] mb-8">
            Available Internships
          </h1>

          {filteredInternships.length === 0 ? (
            <p className="text-[#8da242] font-medium">
              No internships found.
            </p>
          ) : (
            <div className="space-y-6">
              {filteredInternships.map((internship) => (
                <div
                  key={internship._id}
                  className="bg-white/90 backdrop-blur-md border border-[#a7bc5b]/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold text-[#2d2d2d]">
                    {internship.title}
                  </h3>

                  <p className="text-[#8da242] font-medium">
                    {internship.company}
                  </p>

                  <div className="flex justify-between mt-4 text-[#2d2d2d]">
                    <span>📍 {internship.location}</span>
                    <span>₹{internship.stipend} /month</span>
                  </div>

                  <div className="flex gap-4 mt-6">

                    <Link
                      to={`/internships/${internship._id}`}
                      className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-5 py-2 rounded-full shadow hover:scale-[1.05] transition-transform"
                    >
                      View Details
                    </Link>

                    {/* ✅ Admin Only Controls */}
                    {role === "admin" && (
                      <>
                        <Link
                          to={`/edit-internship/${internship._id}`}
                          className="border border-[#8da242] text-[#8da242] px-5 py-2 rounded-full hover:bg-[#a7bc5b]/30 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(internship._id)
                          }
                          className="border border-[#8da242] text-[#8da242] px-5 py-2 rounded-full hover:bg-[#a7bc5b]/30 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
