// Import necessary libraries
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUser, updateUserRequest } from "../../redux/redux";
import "./EditProfile.css";

import { useTranslation } from "react-i18next";

const EditProfile = ({ token, userID }) => {
  const { t, i18n } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState(""); // Add state for bio
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (user) {
      const { username, email, bio } = user; // Include bio
      setUsername(username);
      setEmail(email);
      setBio(bio); // Set bio state
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
    } else if (name === "bio") {
      // Handle bio change
      setBio(value);
    }
  };

  const handleUserInfoUpdate = async () => {
    try {
      dispatch(updateUserRequest());
      setLoading(true);
      const response = await axios.patch(
        `${apiUrl}/users/me/${user._id}`,
        { username, email, bio }, // Include bio in the request
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(updateUser(response.data));
      setSuccessMessage("Username, email, and bio updated successfully"); // Update success message
      toast.success(
        "Username, email, and bio updated successfully. Please log in again."
      );
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response?.data.message || "Unknown error"
      );
      setError("Error updating username, email, and bio"); // Update error message
      toast.error("Error updating username, email, and bio");
    } finally {
      setLoading(false);
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
        `${apiUrl}/users/${user._id}/avatar`,
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
      <h2>{t("editProfileTitle")}</h2>
      <ToastContainer />
      {loading && <div className="loading-spinner"></div>}
      {error && (
        <p className="error">
          {t("error")}: {error}
        </p>
      )}
      {successMessage && (
        <p className="success">
          {t("success")}: {successMessage}
        </p>
      )}
      {!loading && !error && (
        <div>
          <form className="user-info-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              {t("usernameLabel")}:
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              {t("emailLabel")}:
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              {t("bioLabel")}:
              <textarea name="bio" value={bio} onChange={handleChange} />
            </label>
            <br />
            <button
              className="btn btn-update"
              type="button"
              onClick={handleUserInfoUpdate}
            >
              {t("updateUserInfoButton")}
            </button>
          </form>
          <br />
          <form className="avatar-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              {t("avatarLabel")}:
              <div>
                <button
                  className="custom-file-button"
                  onClick={handleFileButtonClick}
                >
                  {t("chooseAvatar")}
                </button>
                <input
                  className="file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </label>
            <br />
            {avatar ? (
              <img
                className="avatar-image"
                src={user.profilePhoto.url}
                alt="User Avatar"
              />
            ) : (
              <p>{t("noAvatarAvailable")}</p>
            )}
            <br />
            <button
              className="btn btn-update"
              type="button"
              onClick={handleAvatarUpdate}
            >
              {t("updateAvatarButton")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
