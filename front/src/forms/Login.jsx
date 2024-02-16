import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetUserToken } from "../hooks/useGetUserToken";
import { loginUser } from "../redux/redux";
import "./Login.css";

function Login() {
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
          <div>
            <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
          </div>
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