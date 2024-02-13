import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Post from "./components/Post";
import { getAllPosts } from "./redux/redux";
import axios from "axios";
import useInfinitScroll from "./hooks/useInfinitScroll";

function Home() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { posts, hasMore, loading } = useInfinitScroll(query, pageNumber);

  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      console.log(posts)
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
          return <Post key={post.id} ref={lastPostRef} post={post} />;
        } else {
          return <Post key={post.id} post={post} />;
        }
      })}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
}

export default Home;
