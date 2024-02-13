import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Post from "./components/Post";
import { getAllPosts } from "./redux/redux";
import axios from "axios";
import useInfinitScroll from "./hooks/useInfinitScroll";

function Home() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {}, []);

  const { posts, hasMore, loading } = useInfinitScroll(query, pageNumber);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
}

export default Home;
