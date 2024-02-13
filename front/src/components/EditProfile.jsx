// Import necessary libraries
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserRequest } from "../redux/redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./EditProfile.css"; // Import the CSS file

const EditProfile = ({ token }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      const { username, email } = user;
      setUsername(username);
      setEmail(email);
      setLoading(false);
    } else {
      setError("User not found");
      setLoading(false);
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
 const handleLogout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   window.location.reload();
 };
  const handleUserInfoUpdate = async () => {
    try {
      dispatch(updateUserRequest());
      const response = await axios.patch(
        `http://localhost:3030/users/me/${user._id}`,
        { username, email },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(updateUser(response.data));
      handleLogout()
      toast.success("Username and email updated successfully LOGIN again");
      setSuccessMessage("Username and email updated successfully");
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response?.data.message || "Unknown error"
      );
      setError("Error updating username and email");
      toast.error("Error updating username and email");
    }
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await axios.patch(
        `http://localhost:3030/users/${user._id}/avatar`,
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
      toast.success("User avatar updated successfully");
      setSuccessMessage("User avatar updated successfully");
      handleLogout()
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
      {loading && <p>Loading...</p>}
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
