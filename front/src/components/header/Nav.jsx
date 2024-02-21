import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai"; // Import the message icon
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const user = useSelector((state) => state.user);

  return (
    user && (
      <nav className="navbar">
        <Link to="/samar">
          {" "}
          {/* Specify the route to the Chat component */}
          <AiOutlineMessage size={24} />{" "}
        </Link>

        <Link to="/my-posts">
          <div className="user-status">
            {/* Adjust size as needed */}
            <img
              src={user.profilePhoto && user.profilePhoto.url}
              alt="User"
              className="user-image"
            />
            <h6>{user.username && user.username}</h6>
          </div>
        </Link>
      </nav>
    )
  );
};

export default Navbar;
