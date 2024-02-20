import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/isLoading/LoadingSpinner";
import { signupUser } from "../redux/redux";
import "./Form.css";

function SignupForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(signupUser(formData));
      toast.success(t("signupSuccessMessage"));
      navigate("/");
    } catch (error) {
      toast.error(`${t("errorMessage")}: ${error.message}`);
    } finally {
      setLoading(false);
       
    }
  };


  return (
    <div className="login-container">
      <h2>{t("signupTitle")}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder={t("usernamePlaceholder")}
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : t("signupButton")}
        </button>
      </form>
      <p>
        {t("alreadyHaveAccountMessage")}{" "}
        <NavLink to="/login">{t("loginLink")}</NavLink>
      </p>
      <ToastContainer />
    </div>
  );
}

export default SignupForm;
