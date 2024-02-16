import React from "react";
import Post from "./Post";

const PostsList = ({ posts, onLike, onComment, onDeleteComment }) => {
  return (
    <div className="posts-list">
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default PostsList;
