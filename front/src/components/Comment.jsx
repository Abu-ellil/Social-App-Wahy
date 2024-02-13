// Comment.jsx
import React from "react";

const Comment = ({ text, user }) => {
  return (
    <div>
      <p>{text}</p>
      <p>Comment by: {user}</p>
    </div>
  );
};

export default Comment;
