import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Post from "./components/Post";
import { getAllPosts, likePost, addComment } from "./redux/redux";
import axios from "axios";
import useInfinitScroll from "./hooks/useInfinitScroll";
import LoadingSpinner from "./components/LoadingSpinner"; // Import the LoadingSpinner component

function Home() {
  const apiUrl = "https://wahy-social-app-api.onrender.com"
  const user = useSelector((state) => state.user);
  const [query, setQuery] = useState("");
  const [commentText, setCommentText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { posts, hasMore, loading } = useInfinitScroll(query, pageNumber);

  const dispatch = useDispatch();

  const handleLike = (postId, isLiked) => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    dispatch(likePost(postId, user.id, !isLiked));
  };

  const handleComment = (postId, commentText) => {
    dispatch(
      addComment(postId, {
        user: user._id,
        text: commentText,
        username: "example",
      })
    );
    setCommentText("");
    toast.success("Comment added successfully!");
  };

  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/${user._id}/comments/${commentId}`
      );
      if (response.status === 200) {
        console.log(
          `Comment ${commentId} deleted successfully for post ${postId}`
        );
        toast.success("Comment deleted successfully!");
      } else {
        console.error(
          `Failed to delete comment ${commentId} for post ${postId}`
        );
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="home">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div className="post-wrapper" key={post.id} ref={lastPostRef}>
              <Post
                onDeleteComment={handleDeleteComment}
                post={post}
                onLike={() => handleLike(post._id, isLiked)}
                onComment={(commentText) =>
                  handleComment(post._id, commentText)
                }
              />
              <form>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment..."
                />
                <button
                  type="button"
                  onClick={() => handleComment(post._id, commentText)}
                >
                  Comment
                </button>
              </form>
            </div>
          );
        } else {
          return (
            <div className="post-wrapper" key={post.id}>
              <Post
                post={post}
                onLike={() => handleLike(post._id, isLiked)}
                onDeleteComment={handleDeleteComment}
                onComment={(commentText) =>
                  handleComment(post._id, commentText)
                }
              />
              <form className="add-comment-form">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment..."
                />
                <button
                  className="comment-btn"
                  type="button"
                  onClick={() => handleComment(post._id, commentText)}
                >
                  Comment
                </button>
              </form>
            </div>
          );
        }
      })}
      {loading && <LoadingSpinner />}{" "}
      <ToastContainer />
    </div>
  );
}

export default Home;
