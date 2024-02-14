import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./forms/Login.jsx";
import PostForm from "./forms/PostForm.jsx";
import Navbar from "./components/Nav.jsx";
import { useGetUserID } from "./hooks/useGetUserID";
import EditProfile from "./components/EditProfile";
import Home from "./Home.jsx";
import SignupForm from "./forms/SignupForm.jsx";
import SideMenu from "./components/SideMenu.jsx";
import { useSelector } from "react-redux";
import UserPosts from "./components/UserPosts.jsx";

function App() {
  const user = useSelector(state=>state.user)
  const [token, setToken] = useState(false);

  useEffect(() => {
    const storedToken = useGetUserID();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="app">
      <Router>
        <SideMenu />
        <section className="home-container">
          <Navbar />

          <Routes>
            <Route path="/login" element={!token ? <Login /> : null} />
            <Route path="/register" element={!token ? <SignupForm /> : null} />
            <Route
              path="/post-form"
              element={token ? <PostForm token={token} /> : null}
            />
            <Route path="/" element={<Home />} />
            <Route
              path="/edit-profile"
              element={
                token ? <EditProfile token={token} userID={user._id} /> : null
              }
            />
            <Route
              path="/edit-profile"
              element={
                token ? <EditProfile token={token} userID={user._id} /> : null
              }
            />
            <Route path="/my-posts" element={<UserPosts/>} />
          </Routes>
        </section>
      </Router>
    </div>
  );
}

export default App;
