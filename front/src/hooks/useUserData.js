import { useState, useEffect } from "react";
import axios from "axios";

const useUserData = (userId) => {
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/users/${userId}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();

    // Clean up function
    return () => {
      // Any cleanup code, if needed
    };
  }, [userId]);

  return { userData, loading };
};

export default useUserData;
