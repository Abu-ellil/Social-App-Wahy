import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css"; // Import the CSS file

const Post = forwardRef(({ post, onLike, onComment }, ref) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (post && post.user) {
      setUser(post.user);
    }
    setIsLiked(post.likes.includes(user?.id));
  }, [post, user]);

  const handleLike = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    // Call onLike function to handle the like action
    onLike(post._id, isLiked);
  };

  const handleComment = async () => {
    // Call onComment function to handle the comment action
    onComment(post._id, commentText);
    setCommentText(""); // Clear comment text
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
        </>
      ) : (
        <h1>No Posts</h1>
      )}
    </div>
  );
});

export default Post;
