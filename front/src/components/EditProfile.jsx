// Import necessary libraries
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserRequest } from "../redux/redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./EditProfile.css"; // Import the CSS file

const EditProfile = ({ token, userID }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      const { username, email } = user;
      setUsername(username);
      setEmail(email);
    } else {
      setError("User not found");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleUserInfoUpdate = async () => {
    try {
      dispatch(updateUserRequest());
      setLoading(true); // Set loading to true during the update
      const response = await axios.patch(
        `https://wahy-social-app-api.onrender.com/users/me/${user._id}`,
        { username, email },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(updateUser(response.data));
      setSuccessMessage("Username and email updated successfully");
      toast.success(
        "Username and email updated successfully. Please log in again."
      );
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response?.data.message || "Unknown error"
      );
      setError("Error updating username and email");
      toast.error("Error updating username and email");
    } finally {
      setLoading(false); // Set loading back to false after the update or an error
    }
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
setLoading(true);
      const response = await axios.patch(
        `https://wahy-social-app-api.onrender.com/users/${user._id}/avatar`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedImageUrl = response.data.profilePhoto.url;
      const updatedUser = { ...user, profilePhoto: { url: updatedImageUrl } };
      dispatch(updateUser(updatedUser));
      setLoading(false);
      toast.success("User avatar updated successfully");
      setSuccessMessage("User avatar updated successfully");
    } catch (error) {
      console.error("Error updating user avatar:", error);
      setError(
        "Error updating user avatar: " +
          (error.response?.data.message || "Unknown error")
      );
      toast.error("Error updating user avatar");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <ToastContainer />
      {loading && <div className="loading-spinner"></div>}
      {error && <p className="error">Error: {error}</p>}
      {successMessage && <p className="success">Success: {successMessage}</p>}
      {!loading && !error && (
        <div>
          <form className="user-info-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </label>
            <br />
            <button
              className="btn btn-update"
              type="button"
              onClick={handleUserInfoUpdate}
            >
              Update User Information
            </button>
          </form>
          <br />
          <form className="avatar-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              Avatar:
              <input type="file" name="avatar" onChange={handleFileChange} />
            </label>
            <br />
            {avatar ? (
              <img
                className="avatar-image"
                src={user.profilePhoto.url}
                alt="User Avatar"
              />
            ) : (
              <p>No avatar available</p>
            )}
            <br />
            <button
              className="btn btn-update"
              type="button"
              onClick={handleAvatarUpdate}
            >
              Update Avatar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
