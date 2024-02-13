import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/redux";
import { toast } from "react-toastify"; // Import the toast module
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import "./Form.css";

function SignupForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch signup action
      await dispatch(signupUser(formData));

      // Notify user on successful signup
      toast.success("Signup successful! Please log in.", {
        position: "top-right",
        autoClose: 5000, // Close the notification after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Optionally, redirect to login page or handle login process
    } catch (error) {
      // Notify user on error
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000, // Close the notification after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
