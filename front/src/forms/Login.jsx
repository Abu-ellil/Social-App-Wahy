import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetUserToken } from "../hooks/useGetUserToken";
import { loginUser } from "../redux/redux";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../languages/LanguageToggle";
import "./Login.css";

function Login() {
  const { t, i18n } = useTranslation();

  const token = useGetUserToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(loginUser(formData));
      setIsLoading(false);
      toast.success(t("loginSuccessMessage"));
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
      toast.error(t("loginFailureMessage"));
    }
  };

  return (
    <>
      {!token ? (
        <div className="login-container">
          <h2>{t("loginTitle")}</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <p>{t("emailLabel")}</p>
            <input
              type="email"
              name="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p>{t("passwordLabel")}</p>
            <input
              type="password"
              name="password"
              placeholder={t("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? t("loggingIn") : t("loginButton")}
            </button>
          </form>
          <div>
            <p>
              {t("noAccountMessage")}{" "}
              <NavLink to="/register">{t("registerLink")}</NavLink>
            </p>
          </div>
          {isLoading && <LoadingSpinner />} <ToastContainer />
        </div>
      ) : (
        <>
          <NavLink to="/" className="navbar-link">
            <FaHome className="ico" />
            <h2>{t("goHomeMessage")}</h2>
          </NavLink>
        </>
      )}
    </>
  );
}

export default Login;
