import {
  FaHome,
  FaMoon,
  FaPlusCircle,
  FaRegUser,
  FaSearch,
  FaSun,
  FaWpexplorer,
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="side-menu">
      <Link to="/" className="navbar-link">
        <FaHome className="ico" />
        <h2>{t("home")}</h2>
      </Link>

      {token && (
        <Link to="/search" className="navbar-link">
          <FaSearch className="ico" />
          <h2>{t("search")}</h2>
        </Link>
      )}

      {token && (
        <Link to="/" className="navbar-link">
          <FaWpexplorer className="ico" />
          <h2>{t("explore")}</h2>
        </Link>
      )}

      {token && (
        <Link to="/post-form" className="navbar-link">
          <FaPlusCircle className="ico" />
          <h2>{t("create")}</h2>
        </Link>
      )}

      {user ? (
        <>
          <Link to="/edit-profile" className="navbar-link">
            <FaRegUser className="ico" />
            <h2>{t("profile")}</h2>
          </Link>
          <Link to="/my-posts" className="navbar-link">
            <img
              src={user && user.profilePhoto && user.profilePhoto.url}
              alt="User"
              className="user-image"
            />
            <h3>{user.username}</h3>
          </Link>
          <button onClick={handleLogout} className="logout-btn btn">
            <RiLogoutCircleLine className="ico" />
            <h2 className="log-text">{t("logout")}</h2>
          </button>
        </>
      ) : (
        <>
          <Link to="/register" className="navbar-link">
            <h2 className="log-text">{t("register")}</h2>
          </Link>
          <Link to="/login" className="navbar-link">
            <RiLoginCircleLine className="ico login-icon" />
            <h2 className="log-text">{t("login")}</h2>
          </Link>
        </>
      )}
      <div className="theme-lang-container">
        <LanguageToggle />
        <button onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
