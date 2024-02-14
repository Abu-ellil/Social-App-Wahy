import React, { forwardRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiHeart } from "react-icons/ci";
import "./Post.css";
import { FaHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const Post = forwardRef(({ post, onLike, onComment, onDeleteComment }, ref) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (post && post.user) {
      setUser(post.user);
    }
  }, [post]);

  useEffect(() => {
    post.likes;
  }, [post._id, isLiked]);

  const handleLike = async () => {
    try {
      await onLike(post._id, !isLiked);
      setIsLiked((prevIsLiked) => !prevIsLiked);
      const updatedLikes = isLiked
        ? post.likes.filter((userId) => userId !== user._id)
        : [...post.likes, user._id];
      post.likes = updatedLikes;

      toast.success(`Post ${isLiked ? "unliked" : "liked"} successfully!`);
    } catch (error) {
      toast.error("Error performing like/unlike action. Please try again.");
      console.error("Error performing like/unlike action:", error);
    }
  };

  const handleComment = async () => {
    try {
      await onComment(post._id, commentText);
      setCommentText("");

      const updatedPost = await fetchUpdatedPost(post._id);
      setUser(updatedPost.user);
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Error adding comment. Please try again.");
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    onDeleteComment(post._id, commentId);
    toast.success("Comment deleted successfully!");
  };

  const timeDifference = (timestamp) => {
    const currentTime = new Date();
    const postTime = new Date(timestamp);
    const differenceInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}s`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes}m`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days}d`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
        toast.success("Post shared successfully!");
      } catch (error) {
        toast.error("Error sharing post. Please try again.");
        console.error("Error sharing post:", error);
      }
    } else {
      toast.error("Web Share API is not supported in this browser.");
    }
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
            <p>Created {timeDifference(post.createdAt)} ago</p>
            <p>{post.description}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <div className="actions">
              <div className="likes-info">
                <button onClick={handleLike}>
                  {post.likes.includes(user._id) ? (
                    <FaHeart className="like" />
                  ) : (
                    <CiHeart className="liked" />
                  )}
                </button>
              </div>
              <button onClick={handleShare}>
                <FiSend className=" FiSend" />
              </button>
            </div>
            <div className="likes-counter"><p>{post.likes.length} likes</p></div>
            
          </div>
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

                {comment.user.id === user._id && (
                  <button onClick={() => handleDeleteComment(comment._id)}>
                    Delete
                  </button>
                )}
                <p>{timeDifference(comment.createdAt)} ago</p>
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
