import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const user = useSelector((state) => state.user);

  return (
    <nav className="navbar">
      <div className="user-status">
        <img
          src={user && user.profilePhoto && user.profilePhoto.url}
          alt="User"
          className="user-image"
        />
        <h6>{user && user.username && user.username}</h6>
      </div>
      <div className="user-status">
        <img
          src={user && user.profilePhoto && user.profilePhoto.url}
          alt="User"
          className="user-image"
        />
        <h6>{user && user.username && user.username}</h6>
      </div>
      <div className="user-status">
        <img
          src={user && user.profilePhoto && user.profilePhoto.url}
          alt="User"
          className="user-image"
        />
        <h6>{user && user.username && user.username}</h6>
      </div>
      <div className="user-status">
        <img
          src={user && user.profilePhoto && user.profilePhoto.url}
          alt="User"
          className="user-image"
        />
        <h6>{user && user.username && user.username}</h6>
      </div>
    </nav>
  );
};

export default Navbar;
