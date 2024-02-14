// PostList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PostList.css";
import { useGetUserID } from "../hooks/useGetUserID";
import Post from "./Post";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

const PostList = ({ user, token }) => {
  const [posts, setPosts] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response?.data.message || "Unknown error"
        );
      }
    };

    fetchPosts();
  }, []); // <-- Removed the extra useEffect here

  const onDeletePost = async (postId) => {
    try {
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);

      await axios.delete(`${apiUrl}/posts/${userID}/${postId}`, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data.message || "Unknown error"
      );

      // Note: This might trigger too many requests, you may want to consider handling this differently
      const response = await axios.get(`${apiUrl}/posts`);
      setPosts(response.data);
    }
  };

  const onDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${apiUrl}/posts/${postId}/comment/${commentId}`, {
        headers: { Authorization: token },
      });

      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== commentId
              ),
            }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error.response?.data.message || "Unknown error"
      );
      const response = await axios.get(`${apiUrl}/posts`);
      setPosts(response.data);
    }
  };


  return (
    <div className="container">
      <h2>Posts</h2>
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          user={user}
          token={token}
          onDeletePost={onDeletePost}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default PostList;
