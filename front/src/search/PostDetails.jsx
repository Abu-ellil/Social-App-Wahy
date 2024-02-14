// PostDetails.js
import React from "react";

const PostDetails = ({ post, onCloseDetails }) => {
  return (
    <div className="PostDetailsContainer">
      <button onClick={onCloseDetails}>Close</button>
      <div>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        {/* Add more details based on your Post model */}
        <p>Category: {post.category}</p>
        <img src={post.image} alt="" />
        {/* ... other details */}
      </div>
    </div>
  );
};

export default PostDetails;
