import { createContext, useEffect, useState } from "react";
import { getRequest, apiUrl } from "../api/api";

export const ChateContext = createContext();

export const ChateContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (user?._id) {
        setLoading(true);
        setError(null);
        try {
          const response = await getRequest(`${apiUrl}/chats/${user?._id}`);
          setUserChats(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user chats:", error);
        }
      }
    };
    fetchUserChats();
  }, [user]);

  return (
    <ChateContext.Provider value={{ userChats, loading, error }}>
      {children}
    </ChateContext.Provider>
  );
};

// useEffect(() => {
//     const fetchUserChats = async () => {

//         try {
//             const response = await getRequest(`${apiUrl}/chats/${user?._id}`)
//             setUserChats(response.data)
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching user chats:", error)
//         }
//     }
//     fetchUserChats()
// }, [user])
