// Post.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const serverUrl = "http://localhost:3030/api";

const Post = ({ post, user, token, onDeletePost, onDeleteComment }) => {



// useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3030/api/users/${user}`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );

//       // Check if the response data is available
//       if (response.data) {
//         const { username, email, avatar } = response.data;
//         console.log(response.data);
//         setAvatar(avatar);
//         setLoading(false);
//       } else {
//         // Handle the case when user data is not available
//         setError("User not found");
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setError("Error fetching user data");
//       setLoading(false);
//     }
//   };

//   fetchUserData();
// }, [user, token]);


const [avatar, setAvatar] = useState(null);
  const [comment, setComment] = useState("");
  const [publisherDetails, setPublisherDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/users/${post.publisher}`
        );
        setPublisherDetails(response.data);
        console.log(publisherDetails)
      } catch (error) {
        console.error(
          `Error fetching user details for user ${post.publisher}:`,
          error
        );
      }
    };

    fetchDetails();
  }, [post.publisher]);

  const handleLike = async () => {
    try {
      await axios.post(
        `${serverUrl}/posts/${post._id}/like`,
        {},
        { headers: { Authorization: token } }
      );

      const updatedPost = { ...post, likes: post.likes + 1 };
      setPublisherDetails(updatedPost);
    } catch (error) {
      console.error(
        "Error liking post:",
        error.response?.data.message || "Unknown error"
      );
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(
        `${serverUrl}/posts/${post._id}/comment`,
        { text: comment },
        { headers: { Authorization: token } }
      );

      const updatedPost = {
        ...post,
        comments: [...post.comments, { text: comment, user }],
      };
      setPublisherDetails(updatedPost);
      setComment("");
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data.message || "Unknown error"
      );
    }
  };

  const renderComments = () => {
    return post.comments.map((comment) => (
      <div key={comment._id} className="comment">
        <p>{comment.text}</p>
        <p>Comment by: {comment.user === user ? "You" : comment.user}</p>
        {comment.user === user && (
          <div>
            <button onClick={() => onDeleteComment(post._id, comment._id)}>
              Delete Comment
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="post" key={post._id}>
      <h3>{post.title}</h3>
      {post.picture && (
        <img src={`data:image/png;base64,${post.picture}`} alt="Post" />
      )}
      <p>Likes: {post.likes}</p>
      <p>Comments: {post.comments.length}</p>
      <p>
        Publisher: {publisherDetails ? publisherDetails.username : "Unknown"}
      </p>
      {publisherDetails && publisherDetails.avatar ? (
        <img
          src={`http://localhost:3030/api/users/${post.publisher}/avatar`}
          alt="User Avatar"
          width="100"
        />
      ) : (
        <p>No avatar available</p>
      )}
      <br />
      <button onClick={handleLike}>Like</button>

      <div>
        <h4>Add Comment</h4>
        <input
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>

      <div>
        {post.comments.length > 0 && renderComments()}

        {post.publisher.id === user && (
          <div>
            <button onClick={() => onDeletePost(post._id)}>Delete Post</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
