import React from "react";
import { NavLink } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FaBookOpen />
        <span>Library Admin</span>
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/add-book"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Add Book
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;