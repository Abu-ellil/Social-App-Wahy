import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import LoadingSpinner from "../isLoading/LoadingSpinner";
import "./UserPosts.css";

const UserPosts = ({ userId }) => {
  const { t } = useTranslation(); // Initialize the useTranslation hook
  const user = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [editedPostData, setEditedPostData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
  });

  // Define translations for success and error messages
  const successMessage = t("postUpdatedSuccess");
  const errorMessage = t("errorEditingPost");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/${user._id}/posts`);
      setUserData(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, user._id]);

  const handleEdit = (postId, post) => {
    setEditPostId(postId);
    setEditedPostData({
      title: post.title,
      description: post.description,
      category: post.category,
      image: post.image,
    });
  };

  const handleCancelEdit = () => {
    setEditPostId(null);
    setEditedPostData({
      title: "",
      description: "",
      category: "",
      image: "",
    });
  };

  const handleSaveEdit = async (postId) => {
    try {
      // Implement your logic to update the post data
      await axios.patch(`${apiUrl}/api/posts/${postId}`, editedPostData);
      // Refresh the user posts after editing
      fetchUserData();
      // Close the edit form
      setEditPostId(null);
      // Reset edited post data
      setEditedPostData({
        title: "",
        description: "",
        category: "",
        image: "",
      });
      // Show success toast
      toast.success(successMessage);
    } catch (error) {
      console.error("Error editing post:", error);
      // Show error toast
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${apiUrl}/api/posts/${postId}`);
      fetchUserData();
      // Show success toast
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      // Show error toast
      toast.error("Error deleting post. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="user-posts-container">
      {loading ? (
        <LoadingSpinner />
      ) : userData ? (
        <>
          <h2>{userData.username}'s Posts</h2>
          <div className="posts-list">
            {userData.posts.map((post) => (
              <div key={post._id} className="post-item">
                {editPostId === post._id ? (
                  // Edit form
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={editedPostData.title}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="description"
                      value={editedPostData.description}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="category"
                      value={editedPostData.category}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="image"
                      value={editedPostData.image}
                      onChange={handleInputChange}
                    />
                    <button onClick={() => handleSaveEdit(post._id)}>
                      {t("save")}
                    </button>
                    <button onClick={handleCancelEdit}>{t("cancel")}</button>
                  </div>
                ) : (
                  // Display post details
                  <>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <p>{post.category}</p>
                    <img src={post.image} alt={post.title} />
                    <div className="edite-del-container">
                      {/* Edit button */}
                      <button
                        className="btn"
                        onClick={() => handleEdit(post._id, post)}
                      >
                        {t("edit")}
                      </button>
                      {/* Delete button */}
                      <button
                        className="btn"
                        onClick={() => handleDelete(post._id)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>{t("errorLoadingPosts")}</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserPosts;
