import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const user = useSelector((state) => state.user);

  return (
    user && (
      <nav className="navbar">
        <div className="user-status">
          <img
            src={user.profilePhoto && user.profilePhoto.url}
            alt="User"
            className="user-image"
          />
          <h6>{user.username && user.username}</h6>
        </div>
       
      </nav>
    )
  );
};

export default Navbar;
