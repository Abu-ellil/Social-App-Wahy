import { useEffect, useState } from "react";

const useAuth = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if a token is stored in local storage on component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const loginUser = (newToken) => {
    setToken(newToken);
    // Store the token in local storage
    localStorage.setItem("token", newToken);
  };

  const logoutUser = () => {
    setToken(null);
    // Remove the token from local storage on logout
    localStorage.removeItem("token");
  };

  return { token, loginUser, logoutUser };
};

export default useAuth;
