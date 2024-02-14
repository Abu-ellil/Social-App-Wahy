import React, { forwardRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiHeart } from "react-icons/ci";
import "./Post.css";
import { FaHeart } from "react-icons/fa";

const Post = forwardRef(({ post, onLike, onComment, onDeleteComment }, ref) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
console.log(post)
  useEffect(() => {
    if (post && post.user) {
      setUser(post.user);
    }
  }, [post]);

  useEffect(() => {
   post.likes
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

  return (
    <div ref={ref} className="post">
      {user ? (
        <>
          <div className="user-info">
            <img src={user.profilePhoto.url} alt="User Profile" />
            <p>{user.username}</p>
          </div>
          <div className="post-content">
            <p>{post.createdAt}</p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <div className="actions">
              <button onClick={handleLike}>
                {post.likes.includes(user._id) ? (
                  <FaHeart className="like" />
                ) : (
                  <CiHeart className="liked" />
                )}
              </button>
              <p>{post.likes.length}</p>
            </div>
          </div>
          <div className="comments">
            <div>
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
                </div>
              ))}
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
