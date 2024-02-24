import { createContext, useCallback, useEffect, useState } from "react";
import { apiUrl, getRequest, postRequest } from "../api/api";
import { io } from "socket.io-client";
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
  const [sendTextmessagesError, setSendTextmessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications:", notifications);

  useEffect(() => {
    const newSocket = io("http://localhost:3003");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket !== null) {
      const secondUserId = currentChat?.members.find((id) => id !== user?._id);
      socket.emit("sendMessage", { ...newMessage, secondUserId });
    }
  }, [socket, currentChat, newMessage, user]);

  // send message

  useEffect(() => {
    if (socket !== null) {
      socket.emit("addNewUser", user?.id);
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });
    }
  }, [socket]);



  // receive message and notifications

useEffect(() => {
  if (socket !== null) {
    socket.on("getMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("getNotifications", (res) => {
      const isChatOpen = currentChat?.members.some((id)=>id=== res.senderId)

      if(isChatOpen){
        setNotifications((prev) => [{...res,isRead:true }, ...prev])
      }else{
        setNotifications((prev) => [res, ...prev])
      }
    });

  }

  return () => {
    if (socket !== null) {
      socket.off("getMessage");
      socket.off("getNotifications");
    }
  };
}, [socket, currentChat]);




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
      setAllUsers(response);
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

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log("You must type anything😊...");
      }

      const response = await postRequest(`${apiUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return setSendTextmessagesError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

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

const markAllNotificationsAsRead = useCallback((notifications) => {
  const markNotifications = notifications.map((notification) => {
    return {
   ...notification,
      isRead: true,
    };
  });
  setNotifications(markNotifications);
}, []);


const markNotificationAsRead = useCallback((n,userChats,user,notifications) => {
  const desiredChat = userChats.find((chat)=>{
    const chatMembers = [user._id, n.senderId ]
    const isDesiredChat = chat?.members.every((member) =>{
      return chatMembers.includes(member)
    })
    return isDesiredChat
  })

  // mark it as read
  const markNotification = notifications.map((el)=>{
    if(n.senderId === el.senderId){
      return {
     ...el,
        isRead: true
      }
    }else{
      return el
    }
  })

updateCurrentChat(desiredChat)
setNotifications(markNotification)

},[])
 




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
      sendTextMessage,
      onlineUsers,
      notifications,
      allUsers,
      markAllNotificationsAsRead,
      markNotificationAsRead,
    }}
  >
    {children}
  </ChatContext.Provider>
);
};
