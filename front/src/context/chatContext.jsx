import { createContext, useCallback, useEffect, useState } from "react";
import { apiUrl, getRequest, postRequest } from "../api/api";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  // console.log("messages:", messages);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${apiUrl}/users`);
      if (response.error) {
        return console.log("Error user ", response);
      }
      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (user?._id) {
        setLoading(true);
        setError(null);
        try {
          const response = await getRequest(`${apiUrl}/chats/${user?._id}`);
          setUserChats(response);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user chats:", error);
        }
      }
    };
    fetchUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${apiUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (error) {
        setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);
  

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId, secondId) => {
      try {
        const response = await postRequest(`${apiUrl}/chats`, {
          firstId,
          secondId,
        });

        if (response.error) {
          console.error("Error creating chat:", response.message);
          return null;
        }

        setUserChats((prevChats) => [...prevChats, response]);
        return response;
      } catch (error) {
        console.error("Error creating chat:", error);
        return null;
      }
    },
    [apiUrl, setUserChats]
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        loading,
        error,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        messagesError,
        isMessagesLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
