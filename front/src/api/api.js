// In a separate file, e.g., api.js
import axios from "axios";

export const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export const postRequest = async (url, bodyData) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error("Error making POST request:", error);
    return { error: true, message: error.message };
  }
};



export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";
  }
  if (data?.message) {
    message = data.message;

    return { error: true, message };
  }

  return data;
};






























// export const getPosts = async (
//   query,
//   pageNumber,
//   setPosts,
//   setHasMore,
//   setError,
//   setLoading
// ) => {
//   try {
//     setLoading(true);
//     const apiUrl = import.meta.env.VITE_API_SERVER_URL;
//     const response = await axios.get(
//       `${apiUrl}/posts?page=${pageNumber}&query=${query}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     setPosts((prevPosts) => {
//       const uniquePosts = new Map(prevPosts.map((post) => [post.id, post]));
//       response.data.forEach((post) => {
//         uniquePosts.set(post.id, post);
//       });
//       return [...uniquePosts.values()];
//     });
//     setHasMore(response.data.length > 0);
//   } catch (error) {
//     setError(error);
//   } finally {
//     setLoading(false);
//   }
// };
