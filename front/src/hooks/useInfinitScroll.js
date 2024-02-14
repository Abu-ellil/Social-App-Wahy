import axios from "axios";
import { useEffect, useState } from "react";

const useInfinitScroll = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true); 

  useEffect(() => {
    setPosts([]);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    const getPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_SERVER_URL;
        const response = await axios.get(
          `${apiUrl}/api/posts?page=${pageNumber}&query=${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (isMounted) {
          setPosts((prevPosts) => {
            const uniquePosts = new Map(
              prevPosts.map((post) => [post.id, post])
            );
            response.data.forEach((post) => {
              uniquePosts.set(post.id, post);
            });
            return [...uniquePosts.values()];
          });
          setHasMore(response.data.length > 0);
        }
      } catch (error) {
        setError(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getPosts();

    return () => {
      isMounted = false;
    };
  }, [query, pageNumber]);

  return { loading, posts, hasMore, error };
};

export default useInfinitScroll;
