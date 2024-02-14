// SearchableComponent.js
import React, { useState } from "react";
import Search from "./Search";
import "./Search.css";
import LoadingSpinner from "../components/LoadingSpinner";
import PostDetails from "./PostDetails"; // Import the new component
import { FaUser, FaRegNewspaper } from "react-icons/fa"; // Import icons for user and post

const SearchableComponent = () => {
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

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
  };

  return (
    <div>
      <Search
        apiUrl={apiUrl}
        onSearchResults={handleSearchResults}
        setLoading={setLoading} // Pass setLoading function
      />

      {loading && <LoadingSpinner />}

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
              </li>
            ))}
          </ul>
        </div>
      )}

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
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedItem && selectedItemType === "post" && (
        <PostDetails post={selectedItem} onCloseDetails={handleCloseDetails} />
      )}

      {userResults.length === 0 && postResults.length === 0 && !loading && (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchableComponent;
