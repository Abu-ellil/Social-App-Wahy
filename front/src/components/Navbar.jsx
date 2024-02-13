import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const renderAuthenticatedLinks = () => (
    <>
 
      <li className="navbar-item">
        <Link to="/post-form" className="navbar-link">
          Post Form
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/" className="navbar-link">
          Post List
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/edit-profile" className="navbar-link">
          <div>
            <img
              src={user.profilePhoto.url}
              alt="User"
              className="user-image"
            />
            <h3>{user.username}</h3>
          </div>
        </Link>
      </li>
      <li className="navbar-item">
        <button onClick={handleLogout} className="navbar-link">
          Logout
        </button>
      </li>
    </>
  );

  const renderUnauthenticatedLinks = () => (
    <>
      <li className="navbar-item">
        <Link to="/login" className="navbar-link">
          Login
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/register" className="navbar-link">
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      
      <ul className="navbar-list">
        {user ? renderAuthenticatedLinks() : renderUnauthenticatedLinks()}
      </ul>
    </nav>
  );
};

export default Navbar;
