import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // Import the toast module
import "react-toastify/dist/ReactToastify.css"; // Import the default styles

import "./PostForm.css";

function PostForm() {
  const user = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("user", user._id);
      formDataToSend.append("image", files[0]);

      const response = await axios.post(
        "http://localhost:3030/api/posts",
        formDataToSend
      );

      // Notify user on successful submission
      toast.success("Post submitted successfully!", {
        position: "top-right",
        autoClose: 3000, // Close the notification after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear the form and file input on successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
      });
      setFiles([]);
      setLoading(false);
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

      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Create a New Post</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="file"
          onChange={(ev) => setFiles(ev.target.files)}
          accept="image/*"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}

export default PostForm;
