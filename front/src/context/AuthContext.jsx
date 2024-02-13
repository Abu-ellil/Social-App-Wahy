// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if user ID is stored in local storage on component mount
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const loginUser = (newUserId) => {
    setUserId(newUserId);
    // Store the user ID in local storage
    localStorage.setItem("userId", newUserId);
  };

  const logoutUser = () => {
    setUserId(null);
    // Remove the user ID from local storage on logout
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userId, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
