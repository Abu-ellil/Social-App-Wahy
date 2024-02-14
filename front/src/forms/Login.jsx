import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { useGetUserID } from "../hooks/useGetUserID";
import { FaHome } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

function Login() {
  const token = useGetUserID();
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
      // Display a success toast
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
      // Display an error toast
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      {!token ? (
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {isLoading && <LoadingSpinner />} <ToastContainer />
        </div>
      ) : (
        <>
          <NavLink to="/" className="navbar-link">
            <FaHome className="ico" />
            <h2> Go Home 👌👌👌👌</h2>
          </NavLink>
        </>
      )}
    </>
  );
}

export default Login;
