import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="w-full h-16 bg-white shadow-sm flex items-center px-8 justify-between">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-12">

        {/* 🔥 Modern Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8da242] to-[#a7bc5b] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">IH</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            Intern<span className="text-[#8da242]">Hub</span>
          </h1>
        </Link>

        {/* Menu - Visible Only If Logged In */}
        {token && (
          <div className="flex items-center gap-10 font-medium text-gray-700">
            <Link
              to="/internships"
              className="hover:text-[#8da242] transition"
            >
              Internships
            </Link>

            <Link
              to="/jobs"
              className="hover:text-[#8da242] transition"
            >
              Jobs
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 font-medium">

        {/* 🔓 NOT LOGGED IN */}
        {!token && (
          <>
            <Link
              to="/user-login"
              className="hover:text-[#8da242] transition"
            >
              User Login
            </Link>

            <Link
              to="/admin-login"
              className="hover:text-[#8da242] transition"
            >
              Admin Login
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-[#8da242] to-[#a7bc5b] text-white px-5 py-2 rounded-full shadow-md hover:opacity-90 transition"
            >
              Register
            </Link>
          </>
        )}

        {/* 👤 USER LOGGED IN */}
        {/* 👤 USER LOGGED IN */}
{token && role === "user" && (
  <>
    <span className="bg-[#a7bc5b]/30 text-[#8da242] px-3 py-1 rounded-full text-sm font-semibold">
      User Panel
    </span>

    <Link
      to="/profile"
      className="hover:text-[#8da242] transition"
    >
      Profile
    </Link>

    <Link
      to="/my-applications"
      className="hover:text-[#8da242] transition"
    >
      My Applications
    </Link>

    <Link
      to="/resume-analysis"
      className="hover:text-[#8da242] transition"
    >
      Resume Analysis
    </Link>

    <button
      onClick={handleLogout}
      className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-5 py-2 rounded-full shadow-md transition"
    >
      Logout
    </button>
  </>
)}

        {/* 👑 ADMIN LOGGED IN */}
        {token && role === "admin" && (
          <>
            <span className="bg-[#8da242]/20 text-[#2d2d2d] px-3 py-1 rounded-full text-sm font-semibold">
              Admin Panel
            </span>

            <Link
              to="/add-internship"
              className="hover:text-[#8da242] transition"
            >
              Add Internship
            </Link>

            <Link
              to="/add-job"
              className="hover:text-[#8da242] transition"
            >
              Add Job
            </Link>

            <Link
              to="/admin-dashboard"
              className="hover:text-[#8da242] transition"
            >
              Applications
            </Link>

            <button
              onClick={handleLogout}
              className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-5 py-2 rounded-full shadow-md transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;