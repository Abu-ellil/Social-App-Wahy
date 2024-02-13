import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Post from "./components/Post";
import { getAllPosts, likePost, addComment } from "./redux/redux"; // Make sure to import addComment
import axios from "axios";
import useInfinitScroll from "./hooks/useInfinitScroll";

function Home() {
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
  };
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      console.log(posts);
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
  return (
    <div>
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div key={post.id} ref={lastPostRef}>
              <Post
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
            <div key={post.id}>
              <Post
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
        }
      })}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
}
//   return (
//     <div>
//       {posts.map((post, index) => (
//         <div key={post.id}>
//           <Post
//             post={post}
//             onLike={() => handleLike(post._id, isLiked)}
//             onComment={(commentText) => handleComment(post._id, commentText)}
//           />
//           <form>
//             <input
//               type="text"
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               placeholder="Enter your comment..."
//             />
//             <button
//               type="button"
//               onClick={() => handleComment(post._id, commentText)}
//             >
//               Comment
//             </button>
//           </form>
//         </div>
//       ))}
//       {loading && <p>Loading more posts...</p>}
//     </div>
//   );
// }

export default Home;
