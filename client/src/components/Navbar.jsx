import logo from "../assets/intern logo.png";
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
    <nav className="w-full h-16 bg-gradient-to-r from-[#ffffff] via-[#a7bc5b]/30 to-[#8da242]/40 shadow-md flex items-center px-8">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="Intern Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Menu */}
      <div className="ml-12 flex items-center gap-12 font-medium text-[#2d2d2d]">
        <Link
          to="/internships"
          className="flex items-center hover:text-[#8da242] transition"
        >
          Internships
          <i className="bi bi-caret-down-fill ml-2 text-xs"></i>
        </Link>

        <Link
          to="/jobs"
          className="flex items-center hover:text-[#8da242] transition"
        >
          Jobs
          <i className="bi bi-caret-down-fill ml-2 text-xs"></i>
        </Link>
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center bg-white/80 backdrop-blur-sm border border-[#a7bc5b] rounded-full px-4 py-1 shadow-sm">
        <i className="bi bi-search text-[#8da242] mr-2"></i>
        <input
          type="text"
          placeholder="Search"
          className="outline-none text-sm w-48 bg-transparent placeholder:text-[#8da242]/70"
        />
      </div>

      {/* Right Side */}
      <div className="ml-10 flex items-center gap-6 font-medium">

        {/* 🔓 NOT LOGGED IN */}
        {!token && (
          <>
            <Link
              to="/user-login"
              className="text-[#2d2d2d] hover:text-[#8da242] transition"
            >
              User Login
            </Link>

            <Link
              to="/admin-login"
              className="text-[#2d2d2d] hover:text-[#8da242] transition"
            >
              Admin Login
            </Link>

            <Link
              to="/register"
              className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-4 py-1.5 rounded-full transition shadow"
            >
              Register
            </Link>
          </>
        )}

        {/* 👤 USER LOGGED IN */}
        {token && role === "user" && (
          <>
            <span className="bg-[#a7bc5b]/30 text-[#8da242] px-3 py-1 rounded-full text-sm font-semibold">
              User Panel
            </span>

            <Link
              to="/my-applications"
              className="hover:text-[#8da242] transition"
            >
              My Applications
            </Link>

            <button
              onClick={handleLogout}
              className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-4 py-1.5 rounded-full transition shadow"
            >
              Logout
            </button>
          </>
        )}

        {/* 👑 ADMIN LOGGED IN */}
        {token && role === "admin" && (
          <>
            <span className="bg-[#8da242]/30 text-[#2d2d2d] px-3 py-1 rounded-full text-sm font-semibold">
              Admin Panel
            </span>

            <Link
              to="/add-internship"
              className="hover:text-[#8da242] transition"
            >
              Add Internship
            </Link>

            <Link
              to="/admin-dashboard"
              className="hover:text-[#8da242] transition"
            >
              Applications
            </Link>
            <Link
  to="/add-job"
  className="hover:text-[#8da242] transition"
>
  Add Job
</Link>


            <button
              onClick={handleLogout}
              className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-4 py-1.5 rounded-full transition shadow"
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
