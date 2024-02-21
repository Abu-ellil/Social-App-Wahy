// In a separate file, e.g., api.js
import axios from "axios";

export const apiUrl = import.meta.env.VITE_API_SERVER_URL;
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



export const getRequest = async(url)=>{
  const response = await axios(url)

  if (!response.ok){
    let message = "An error occured..."
  }
  if (response?.message){
     message = response.message

     return {error:true, message}
  }

  return response
}