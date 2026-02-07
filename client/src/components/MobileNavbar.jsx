import { useState } from "react";
import logo from "../assets/intern logo.png";

function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top mobile bar */}
      <nav className="w-full h-16 bg-white border-b flex items-center px-4">
        
        {/* Logo */}
        <img
          src={logo}
          alt="Intern Logo"
          className="h-10 w-auto"
        />

        {/* Hamburger */}
        <button
          className="ml-auto text-2xl"
          onClick={() => setOpen(true)}
        >
          <i className="bi bi-list"></i>
        </button>
      </nav>

      {/* Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white p-6">
            
            {/* Close button */}
            <button
              className="text-2xl mb-6"
              onClick={() => setOpen(false)}
            >
              <i className="bi bi-x"></i>
            </button>

            {/* Menu items */}
            <div className="flex flex-col gap-5 text-gray-700 font-medium">
              <span>Internships</span>
              <span>Jobs</span>
              <span>Search</span>
              <span>Login</span>
              <span>Hire Talent</span>
              <span>Register</span>
              <span>Admin</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNavbar;
