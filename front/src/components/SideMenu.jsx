import React from "react";
import { useSelector } from "react-redux";
import "./sideMenu.css";
import { NavLink } from "react-router-dom";
import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import {
  FaHome,
  FaSearch,
  FaWpexplorer,
  FaPlusCircle,
  FaRegUser,
} from "react-icons/fa";
import { useGetUserID } from "../hooks/useGetUserID";

const SideMenu = () => {
  const user = useSelector((state) => state.user);
 const token =  useGetUserID()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="side-menu">
      <NavLink to="/" className="navbar-link">
        <FaHome className="ico" />
        <h2>Home</h2>
      </NavLink>

      {token && (
        <NavLink to="/search" className="navbar-link">
          <FaSearch className="ico" />
          <h2>Search</h2>
        </NavLink>
      )}

      {token && (
        <NavLink to="/" className="navbar-link">
          <FaWpexplorer className="ico" />
          <h2>Explore</h2>
        </NavLink>
      )}

      {token && (
        <NavLink to="/post-form" className="navbar-link">
          <FaPlusCircle className="ico" />
          <h2>Creat</h2>
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink to="/edit-profile" className="navbar-link">
            <FaRegUser className="ico" />
            <h2>Profile</h2>
          </NavLink>
          <NavLink to="/my-posts" className="navbar-link">
            <img
              src={user && user.profilePhoto && user.profilePhoto.url}
              alt="User"
              className="user-image"
            />

            <h3>{user.username}</h3>
          </NavLink>
          <button onClick={handleLogout} className="logout-btn btn">
            <RiLogoutCircleLine className="ico" />
            <h2>Logout</h2>
          </button>
        </>
      ) : (
        <>
          <NavLink to="/register" className="navbar-link">
            <h2>Register</h2>
          </NavLink>
          <NavLink to="/login" className="navbar-link">
            <RiLoginCircleLine className="ico login-icon" />
            <h2>LOGIN</h2>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default SideMenu;
