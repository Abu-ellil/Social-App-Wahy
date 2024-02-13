// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./forms/Login.jsx";
import PostForm from "./forms/PostForm.jsx";
import Navbar from "./components/Navbar";
import { useGetUserID } from "./hooks/useGetUserID";
import EditProfile from "./components/EditProfile";
import Home from "./Home.jsx";
import SignupForm from "./forms/SignupForm.jsx";

function App() {
  const userID = useGetUserID();
  const [token, setToken] = useState(false);

  useEffect(() => {
    // Check if a token is stored in localStorage on component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={!token ? <Login /> : null} />
          <Route path="/register" element={!token ? <SignupForm /> : null} />
          <Route
            path="/post-form"
            element={token ? <PostForm token={token} /> : null}
          />
          <Route path="/" element= {<Home /> } />
          <Route
            path="/edit-profile"
            element={
              token ? <EditProfile token={token} userID={userID} /> : null
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
