import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegNewspaper, FaUser } from "react-icons/fa";
import LoadingSpinner from "../components/isLoading/LoadingSpinner";
import PostDetails from "./PostDetails";
import Search from "./Search";
import "./Search.css";
import UserDetails from "./UserDetails";

const SearchableComponent = () => {
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;

  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);
  const [userPosts, setUserPosts] = useState([]); // Add userPosts state

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (selectedItem && selectedItemType === "user") {
        setLoadingUserPosts(true);
        setLoading(true);
        try {
          const response = await axios.get(
            `${apiUrl}/api/${selectedItem._id}/posts`
          );
          const posts = response.data.user.posts || [];
          setUserPosts(posts);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user's posts:", error);
          setLoading(false);
        } finally {
          setLoadingUserPosts(false);
        }
      }
    };

    fetchUserPosts();
  }, [apiUrl, selectedItem, selectedItemType]);

  const handleSearchResults = (results) => {
    setUserResults(results.userResults);
    setPostResults(results.postResults);
  };

  const handleItemClick = (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setSelectedItemType(null);
    setUserPosts([]); // Reset userPosts state
  };

  return (
    <div className="SearchResulContainer">
      <Search
        apiUrl={apiUrl}
        onSearchResults={handleSearchResults}
        setLoading={setLoading}
      />

      {loading && <LoadingSpinner />}

      {/* Display user results */}
      {userResults.length > 0 && (
        <div className="UserResults">
          <h3>Users:</h3>
          <ul className="SearchResultsList">
            {userResults.map((user) => (
              <li
                key={user._id}
                className="SearchResultItem"
                onClick={() => handleItemClick(user, "user")}
              >
                <FaUser className="UserIcon" />
                {user.username}
                <img src={user.profilePhoto.url} alt="" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display post results */}
      {postResults.length > 0 && (
        <div className="PostResults">
          <h3>Posts:</h3>
          <ul className="SearchResultsList">
            {postResults.map((post) => (
              <li
                key={post._id}
                className="SearchResultItem"
                onClick={() => handleItemClick(post, "post")}
              >
                <FaRegNewspaper className="PostIcon" />
                {post.title}
                <img src={post.image} alt="" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display UserDetails when a user item is clicked */}
      {selectedItem && selectedItemType === "user" && !loadingUserPosts && (
        <UserDetails
          user={selectedItem}
          userPosts={userPosts}
          onCloseDetails={handleCloseDetails}
        />
      )}

      {/* Display PostDetails when a post item is clicked */}
      {selectedItem && selectedItemType === "post" && (
        <PostDetails post={selectedItem} onCloseDetails={handleCloseDetails} />
      )}

      {/* Display message when no results */}
      {userResults.length === 0 && postResults.length === 0 && !loading && (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchableComponent;
