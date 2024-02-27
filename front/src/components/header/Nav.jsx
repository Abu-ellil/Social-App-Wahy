import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai"; // Import the message icon
import "./Navbar.css"; // Import the CSS file
import Notifications from "../chat/Notifications";
import LanguageToggle from "../../languages/LanguageToggle";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useGetUserToken } from "../../hooks/useGetUserToken";

const Navbar = () => {
  const user = useSelector((state) => state.user);
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const token = useGetUserToken();

  return (
    <>
      <div className="theme-lang-container">
        <LanguageToggle />
        <div className="logo"></div>
        <button onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
      
      {user && (
        <div className="header-navbar">
          <Notifications />
          <Link to="/samar">
            {" "}
            {/* Specify the route to the Chat component */}
            <AiOutlineMessage size={42} />{" "}
          </Link>

          <Link to="/my-posts">
            <div className="user-status">
              {/* Adjust size as needed */}
             
              {/* <h6>{user.username && user.username}</h6> */}
              {/* <span>"{user?.bio}"</span>  */}
              <img
                src={user.profilePhoto && user.profilePhoto.url}
                alt="User"
                className="user-image"
              />
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
