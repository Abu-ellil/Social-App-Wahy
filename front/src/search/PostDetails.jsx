import React, { useEffect, useRef } from "react";

const PostDetails = ({ post, onCloseDetails }) => {
  const postDetailsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        postDetailsRef.current &&
        !postDetailsRef.current.contains(event.target)
      ) {
        onCloseDetails();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onCloseDetails]);

  return (
    <div className="PostDetailsContainer" ref={postDetailsRef}>
      <button onClick={onCloseDetails}>Close</button>
      <div>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <p>Category: {post.category}</p>
        <img src={post.image} alt="" />
      </div>
    </div>
  );
};

export default PostDetails;
