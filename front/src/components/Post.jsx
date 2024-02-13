import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css"; // Import the CSS file

const Post = forwardRef(({ post }, ref) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (post && post.user) {
      setUser(post.user);
    }
  }, [post]);

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
              <button>Like</button>
              <button>Comment</button>
            </div>
            <div className="likes">Likes: {post.likes.length}</div>
            <div className="comments">Comments: {post.comments.length}</div>
          </div>
        </>
      ) : (
        <h1>No Posts</h1>
      )}
    </div>
  );
});

export default Post;
