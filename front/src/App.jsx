import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./languages/i18n.js";
import NotFound404 from "./NotFound404.jsx";
import { setLanguage } from "./redux/redux.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";


function App() {

   const dispatch = useDispatch();
   const { i18n } = useTranslation();


  const user = useSelector((state) => state.user);
  const [token, setToken] = useState(false);


useEffect(() => {
  // Initialize language preference from local storage
  const storedLanguage = localStorage.getItem("language");
  const initialLanguage = storedLanguage || "en"; // Default to English if no preference is found
  i18n.changeLanguage(initialLanguage);

  // Dispatch action to set language preference in Redux state
  dispatch(setLanguage(initialLanguage));
}, [dispatch, i18n]);


  useEffect(() => {
    const storedToken = useGetUserToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    
      <div className="app">
        <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          {" "}
          {/* Wrap your component tree with I18nextProvider */}
          <Router>
            <SideMenu />

            <section className="home-container">
              <Navbar />

              <Routes>
                <Route path="/login" element={!token ? <Login /> : null} />
                <Route
                  path="/register"
                  element={!token ? <SignupForm /> : null}
                />
                <Route
                  path="/post-form"
                  element={token ? <PostForm token={token} /> : null}
                />
                <Route path="/" element={<Home />} />
                <Route
                  path="/edit-profile"
                  element={
                    token ? (
                      <EditProfile token={token} userID={user._id} />
                    ) : null
                  }
                />
                <Route path="/my-posts" element={<UserPosts />} />
                <Route path="/search" element={<SearchableComponent />} />
                <Route path="*" element={<NotFound404 />} />
              </Routes>
            </section>
          </Router>
        </I18nextProvider>
        </ThemeProvider>
      </div>
    
  );
}

export default App;
