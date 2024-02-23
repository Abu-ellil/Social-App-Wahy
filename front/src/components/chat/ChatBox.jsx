import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../context/chatContext";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { Stack } from "react-bootstrap";
import moment from "moment";

const ChatBox = () => {
  const user = useSelector((state) => state.user);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { secondUser } = useGetChatUser(currentChat, user);

  if (!secondUser) {
    return (
      <p style={{ textAlign: "center", widows: "100%" }}>
        No second user found for this chat.
      </p>
    );
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", widows: "100%" }}>Loading Chat...</p>
    );
  }

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{secondUser?.username}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack key={index}>
              <span>{message.text}</span>
              <span>
                {moment(message.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </span>{" "}
              {/* Convert moment object to string */}
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

export default ChatBox;
