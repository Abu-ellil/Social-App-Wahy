import axios from "axios";
import { useEffect, useState } from "react";

const useInfinitScroll = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false); // Initially set to true to allow loading for the first time

  useEffect(() => {
    setPosts([]);
  }, [query]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const apiUrl = import.meta.env.VITE_API_SERVER_URL;

    setLoading(true);
    axios({
      method: "get",
      url: `${apiUrl}/posts?page=${pageNumber}&query=${query}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setPosts((prevPosts) => {
          // Use a Map to ensure unique posts based on their ID
          const uniquePosts = new Map(prevPosts.map((post) => [post.id, post]));
          res.data.forEach((post) => {
            uniquePosts.set(post.id, post);
          });
          return [...uniquePosts.values()];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [query, pageNumber, hasMore, loading]);

  return { loading, posts, hasMore, error };
};

export default useInfinitScroll;
