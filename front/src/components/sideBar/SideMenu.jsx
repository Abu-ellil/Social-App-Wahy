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
import logo from "../../assets/logo.png"
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
      <div className="logo">
      </div>

      <div className="side-menu-links">
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

        {token && (
          <Link to="/edit-profile" className="navbar-link">
            <FaRegUser className="ico" />
            <h2>{t("profile")}</h2>
          </Link>
        )}
      </div>

      {user ? (
        <>
          <button onClick={handleLogout} className="logout-btn">
            <RiLogoutCircleLine className="ico" />
            <h2 className="log-text">{t("logout")}</h2>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-link">
            <RiLoginCircleLine className="ico login-icon" />
            <h2 className="log-text">{t("login")}</h2>
          </Link>
        </>
      )}
    </div>
  );
};

export default SideMenu;
