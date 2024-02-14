// SearchableComponent.js
import React, { useState } from "react";
import Search from "./Search";
import "./Search.css";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchableComponent = () => {
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div>
      <Search
        apiUrl={apiUrl}
        onSearchResults={handleSearchResults}
        setLoading={setLoading}
      />

      {loading && <LoadingSpinner/>}

      {searchResults.length > 0 ? (
        <div className="SearchResults">
          <h3>Search Results:</h3>
          <ul className="SearchResultsList">
            {searchResults.map((result) => (
              <li key={result.id} className="SearchResultItem">
                {result.name}
                {/* Display other relevant information */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{!loading && "No results found."}</p>
      )}
    </div>
  );
};

export default SearchableComponent;
