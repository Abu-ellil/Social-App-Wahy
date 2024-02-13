// Post.js

import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css"; // Import the CSS file

const Post = forwardRef(({ post, onLike, onComment, onDeleteComment }, ref) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // Default to false
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (post && post.user) {
      setUser(post.user);
    }

    // Load like status from local storage on component mount
    const storedLikeStatus = localStorage.getItem(`post_${post._id}_like`);
    setIsLiked(storedLikeStatus === "true");
  }, [post]);

  useEffect(() => {
    // Save like status to local storage whenever it changes
    localStorage.setItem(`post_${post._id}_like`, isLiked);
  }, [post._id, isLiked]);

  const handleLike = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    // Call onLike function to handle the like action
    onLike(post._id, isLiked);
  };

  const handleComment = async () => {
    onComment(post._id, commentText);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    // Call onDeleteComment function to handle the comment deletion
    onDeleteComment(post._id, commentId);
  };

  return (
    <div ref={ref} className="post">
      {user ? (
        <>
          <div className="user-info">
            <img src={user.profilePhoto.url} alt="User Profile" />
            <p>{user.username}</p>
          </div>
          <div className="post-content">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <div className="actions">
              <p>{post.likes.length}</p>
              <button onClick={handleLike}>
                {isLiked ? "Unlike" : "Like"}
              </button>
              <button onClick={handleComment}>Comment</button>
            </div>
          </div>
          {/* Render comments */}
          <div className="comments">
            {post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                {comment.user && comment.user.profilePhoto && (
                  <img
                    src={comment.user.profilePhoto.url}
                    alt="Comment User Profile"
                  />
                )}
                <p>{comment.text}</p>
                {/* Delete button for each comment */}
                <button onClick={() => handleDeleteComment(comment._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1>No Posts</h1>
      )}
    </div>
  );
});

export default Post;
