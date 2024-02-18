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
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useGetUserToken } from "../../hooks/useGetUserToken";
import LanguageToggle from "../../languages/LanguageToggle";
import "./sideMenu.css";
import { useTranslation } from "react-i18next";

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