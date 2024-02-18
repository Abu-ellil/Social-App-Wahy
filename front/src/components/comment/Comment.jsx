import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./comment.css";

const Comment = ({ comment, onDelete, user, timeDifference }) => {
  const handleDelete = async () => {
    onDelete(comment._id);
  };

  return (
    <div className="comment">
      {comment.user && comment.user.profilePhoto && (
        <img src={comment.user.profilePhoto.url} alt="Comment User Profile" />
      )}
      <div className="comment-text-time">
        <p>{comment.text}</p>
        <p className="time-stamp">
          <span>{timeDifference(comment.createdAt)}</span> ago
        </p>
      </div>
      
      {(comment.user._id == user._id) && (
        <button
          className="delete-comment-btn"
          onClick={() => handleDelete(comment._id)}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default Comment;
