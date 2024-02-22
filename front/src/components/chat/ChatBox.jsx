import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../context/chatContext";
import { useGetChatUser } from "../../hooks/useGetChatUser";


const ChatBox = () => {
  const user = useSelector((state) => state.user);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { secondUser } = useGetChatUser(currentChat, user);

console.log(ChatContext)
// console.log(currentChat,secondUser)

  if (!secondUser) {
    return (
      <p style={{ textAlign: "center", widows: "100%" }}>
        No Conversation selected yet...
      </p>
    );
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", widows: "100%" }}>
        Loading Chat...
      </p>
    );
  }



  return(
    <div>111111111</div>
  );
};

export default ChatBox;
