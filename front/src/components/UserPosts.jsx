// UserPosts.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPosts.css"; // Import the CSS file

const UserPosts = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/posts`);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="user-posts-container">
      {userData ? (
        <>
          <h2>{userData.username}'s Posts</h2>
          <div className="posts-list">
            {userData.posts.map((post) => (
              <div key={post._id} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading user posts...</p>
      )}
    </div>
  );
};

export default UserPosts;
