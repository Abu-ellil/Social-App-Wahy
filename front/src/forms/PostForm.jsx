import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/isLoading/LoadingSpinner";
import "./PostForm.css";

function PostForm() {
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;

  const { t } = useTranslation(); 
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
        `${apiUrl}/api/posts`,
        formDataToSend
      );

      toast.success(t("postSubmittedSuccess"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setFormData({
        title: "",
        description: "",
        category: "",
      });
      setFiles([]);
      setLoading(false);
    } catch (error) {
      toast.error(`${t("error")}: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
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
    <>
      <form className="post-form" onSubmit={handleSubmit}>
        <h2>{t("createNewPost")}</h2>
        <div>
          <label htmlFor="title">{t("title")}:</label>
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
          <label htmlFor="description">{t("description")}:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category">{t("category")}:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="file-input-container">
          <input
            type="file"
            id="file-upload"
            onChange={(ev) => setFiles(ev.target.files)}
            accept="image/*"
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            Choose File
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? t("loading") : t("submit")}
        </button>
        {loading && <LoadingSpinner />}{" "}
        {/* Display LoadingSpinner while loading */}
      </form>
      <ToastContainer />
    </>
  );
}

export default PostForm;
