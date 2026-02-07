import logo from "../assets/intern logo.png";

function Navbar() {
  return (
    <nav className="w-full h-16 bg-white border-b flex items-center px-6">
      
      {/* Logo */}
      <img
        src={logo}
        alt="Intern Logo"
        className="h-10 w-auto max-w-[180px] object-contain"
      />

      {/* Menu: Internships & Jobs */}
      <div
        style={{ marginLeft: "48px", display: "flex", alignItems: "center" }}
      >
        <span
          style={{
            marginRight: "48px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          className="hover:text-blue-600"
        >
          Internships
          <i className="bi bi-caret-down-fill ml-2 text-xs"></i>
        </span>

        <span
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          className="hover:text-blue-600"
        >
          Jobs
          <i className="bi bi-caret-down-fill ml-2 text-xs"></i>
        </span>
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center border rounded-md px-3 py-1">
        <i className="bi bi-search text-gray-500 mr-2"></i>
        <input
          type="text"
          placeholder="Search"
          className="outline-none text-sm w-48"
        />
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div
        style={{
          marginLeft: "48px",
          display: "flex",
          alignItems: "center",
          gap: "32px", // 👈 CLEAR GAP BETWEEN ALL BUTTONS
        }}
      >
        <button className="text-gray-700 hover:text-blue-600">
          Login
        </button>

        <button className="text-gray-700 hover:text-blue-600">
          Hire Talent
        </button>

        <button className="text-gray-700 hover:text-blue-600">
          Register
        </button>

        <button className="text-gray-700 hover:text-blue-600">
          Admin
        </button>
      </div>

    </nav>
  );
}

export default Navbar;
