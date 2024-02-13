import React from "react";

const Comment = ({ comment, onDelete }) => {
  const handleDelete = async () => {
    // Call onDelete function to handle the delete action
    onDelete(comment._id);
  };

  return (
    <div className="comment">
      <p>{comment.text}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Comment;
