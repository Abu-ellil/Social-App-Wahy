import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/redux";
// import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import "./Login.css"; // Import CSS file for styling

function Login() {
  const dispatch = useDispatch();
 
 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true while the request is in progress
    try {
      // Dispatch login action
      await dispatch(loginUser(formData));
      setIsLoading(false); // Set loading to false after successful login
      // Redirect/navigate home
      //   history.push("/"); // Assuming "/" is the route for home
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false); // Set loading to false if login fails
      // Handle error, such as displaying an error message
    }
  };

  return (
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
    </div>
  );
}

export default Login;
