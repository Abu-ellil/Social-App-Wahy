// Search.js
import React, { useState } from "react";
import axios from "axios";
import "./Search.css";

const Search = ({ apiUrl, onSearchResults, setLoading }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true); // Set loading state to true before making the request
      const response = await axios.get(`${apiUrl}/search?q=${query}`);
      const searchResults = response.data.results;
      onSearchResults(searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className="SearchContainer">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        className="SearchInput"
      />
      <button onClick={handleSearch} className="SearchButton">
        Search
      </button>
    </div>
  );
};

export default Search;
