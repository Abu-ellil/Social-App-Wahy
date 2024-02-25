import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaSearch,
  FaWpexplorer,
  FaPlusCircle,
  FaRegUser,
} from "react-icons/fa";
import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import LanguageToggle from "../../languages/LanguageToggle";
import "./sideMenu.css";
import { useTranslation } from "react-i18next";
import { useGetUserToken } from "../../hooks/useGetUserToken";

const SideMenu = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const token = useGetUserToken();

  const [menuVisible, setMenuVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isVisible = prevScrollPos > currentScrollPos;

    setMenuVisible(isVisible);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const [activeLink, setActiveLink] = useState("");

  return (
    <div className={`side-menu ${menuVisible ? "show" : "hide"}`}>
      <div className="logo">
      </div>

      <div className="side-menu-links">
        <Link
          to="/"
          className={`navbar-link ${activeLink === "home" ? "active" : ""}`}
          onClick={() => setActiveLink("home")}
        >
          <FaHome className="ico" />
          <h2>{t("home")}</h2>
        </Link>

        {token && (
          <Link
            to="/search"
            className={`navbar-link ${activeLink === "search" ? "active" : ""}`}
            onClick={() => setActiveLink("search")}
          >
            <FaSearch className="ico" />
            <h2>{t("search")}</h2>
          </Link>
        )}

        {token && (
          <Link
            to="/"
            className={`navbar-link ${
              activeLink === "explore" ? "active" : ""
            }`}
            onClick={() => setActiveLink("explore")}
          >
            <FaWpexplorer className="ico" />
            <h2>{t("explore")}</h2>
          </Link>
        )}

        {token && (
          <Link
            to="/post-form"
            className={`navbar-link ${activeLink === "create" ? "active" : ""}`}
            onClick={() => setActiveLink("create")}
          >
            <FaPlusCircle className="ico" />
            <h2>{t("create")}</h2>
          </Link>
        )}

        {token && (
          <Link
            to="/edit-profile"
            className={`navbar-link ${
              activeLink === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveLink("profile")}
          >
            <FaRegUser className="ico" />
            <h2>{t("profile")}</h2>
          </Link>
        )}
      </div>

      {user ? (
        <button onClick={handleLogout} className="logout-btn">
          <RiLogoutCircleLine className="ico" />
          <h2 className="log-text">{t("logout")}</h2>
        </button>
      ) : (
        <Link to="/login" className="navbar-link">
          <RiLoginCircleLine className="ico login-icon" />
          <h2 className="log-text">{t("login")}</h2>
        </Link>
      )}
    </div>
  );
};

export default SideMenu;
