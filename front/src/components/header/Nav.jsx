import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai"; // Import the message icon
import "./Navbar.css"; // Import the CSS file
import Notifications from "../chat/Notifications";

const Navbar = () => {
  const user = useSelector((state) => state.user);

  return (
    user && (
      <div className="header-navbar">
        <Notifications/>
        <Link to="/samar">
          {" "}
          {/* Specify the route to the Chat component */}
          <AiOutlineMessage size={42} />{" "}
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
            <span>"{user?.bio}"</span>
          </div>
        </Link>
      </div>
    )
  );
};

export default Navbar;
