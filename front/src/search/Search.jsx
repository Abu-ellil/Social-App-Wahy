// Search.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // You may need to install axios using npm or yarn

const Search = ({ apiUrl, onSearchResults, setLoading }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/search?q=${query}`);
        onSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(() => {
      if (query.trim() !== "") {
        fetchResults();
      }
    }, 500); // Set a delay of 500 milliseconds to wait for user to stop typing

    return () => clearTimeout(delayTimer);
  }, [query, apiUrl, onSearchResults, setLoading]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default Search;
