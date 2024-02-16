import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import EditProfile from "./components/EditProfile";
import Navbar from "./components/Nav.jsx";
import SideMenu from "./components/SideMenu.jsx";
import UserPosts from "./components/UserPosts.jsx";
import Login from "./forms/Login.jsx";
import PostForm from "./forms/PostForm.jsx";
import SignupForm from "./forms/SignupForm.jsx";
import { useGetUserToken } from "./hooks/useGetUserToken.jsx";
import SearchableComponent from "./search/SearchableComponent.jsx";

function App() {
  const user = useSelector((state) => state.user);
  const [token, setToken] = useState(false);

  useEffect(() => {
    const storedToken = useGetUserToken();
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
            <Route path="/my-posts" element={<UserPosts />} />
            <Route path="/search" element={<SearchableComponent />} />
          </Routes>
        </section>
      </Router>
    </div>
  );
}

export default App;
