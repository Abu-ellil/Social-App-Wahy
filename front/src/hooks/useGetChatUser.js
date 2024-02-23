import { useEffect, useState } from "react";
import { getRequest, apiUrl } from "../api/api";

export const useGetChatUser = (chat, user) => {
  const [secondUser, setSecondUser] = useState(null);
  const [error, setError] = useState(null);

  const secondUserId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!secondUserId) return;

      try {
        const response = await getRequest(
          `${apiUrl}/users/find/${secondUserId}`
        );

        if (response.error) {
          setError(response.error); 
          return;
        }
        setSecondUser(response.user);
      } catch (error) {
        console.error("Error fetching second user:", error);
        setError("Error fetching second user");
      }
    };

    getUser();
  }, [secondUserId, chat, user]); 


  return { secondUser, error }; 
};

















// import { useEffect, useState } from "react";
// import { getRequest, apiUrl } from "../api/api";

// export const useGetChatUser = ( chat, user ) => {
//   const [secondUser, setSecondUSer] = useState(null);
//   const [error, setError] = useState(null);

//   const secondUserId = chat?.members.find((id) => id !== user?._id);

//   useEffect(() => {
//     const getUser = async () => {
//       if (!secondUserId) return null;

//       const response = await getRequest(`${apiUrl}/users/find/${secondUserId}`);

//       if (response.error) {
//         return setError(response);
//       }
//       setSecondUSer(response);
//     };

//     getUser();
//   }, [secondUserId]);
//   return { secondUser };
// };
