import React from "react";
import {
  FaHome,
  FaPlusCircle,
  FaRegUser,
  FaSearch,
  FaWpexplorer,
} from "react-icons/fa";
import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useGetUserToken } from "../hooks/useGetUserToken";
import "./sideMenu.css";
import LanguageToggle from "../languages/LanguageToggle";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const SideMenu = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const token = useGetUserToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="side-menu">
      <LanguageToggle />
      <NavLink to="/" className="navbar-link">
        <FaHome className="ico" />
        <h2>{t("home")}</h2>
      </NavLink>

      {token && (
        <NavLink to="/search" className="navbar-link">
          <FaSearch className="ico" />
          <h2>{t("search")}</h2>
        </NavLink>
      )}

      {token && (
        <NavLink to="/" className="navbar-link">
          <FaWpexplorer className="ico" />
          <h2>{t("explore")}</h2>
        </NavLink>
      )}

      {token && (
        <NavLink to="/post-form" className="navbar-link">
          <FaPlusCircle className="ico" />
          <h2>{t("create")}</h2>
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink to="/edit-profile" className="navbar-link">
            <FaRegUser className="ico" />
            <h2>{t("profile")}</h2>
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
            <h2 className="log-text">{t("logout")}</h2>
          </button>
        </>
      ) : (
        <>
          <NavLink to="/register" className="navbar-link">
            <h2 className="log-text">{t("register")}</h2>
          </NavLink>
          <NavLink to="/login" className="navbar-link">
            <RiLoginCircleLine className="ico login-icon" />
            <h2 className="log-text">{t("login")}</h2>
          </NavLink>
        </>
      )}
      <button onClick={toggleTheme}>Theme</button>
    </div>
  );
};

export default SideMenu;
