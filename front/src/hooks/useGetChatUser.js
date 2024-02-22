import { useEffect, useState } from "react";
import { getRequest, apiUrl } from "../api/api";

export const useGetChatUser = ( chat, user ) => {
  const [secondUser, setSecondUSer] = useState(null);
  const [error, setError] = useState(null);

  const secondUserId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!secondUserId) return null;

      const response = await getRequest(`${apiUrl}/users/find/${secondUserId}`);

      if (response.error) {
        return setError(response);
      }
      setSecondUSer(response);
    };

    getUser();
  }, [secondUserId]);
  return { secondUser };
};
