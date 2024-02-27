


import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../context/chatContext";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { FiSend } from "react-icons/fi";
import { Stack } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import InputEmoji from "react-input-emoji";
import moment from "moment";

const ChatBox = () => {
  

  const chatAPI = import.meta.env.VITE_CHAT_API_SERVER_URL;

  const user = useSelector((state) => state.user);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { secondUser } = useGetChatUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");

  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
    }
  };

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
            <Stack
              ref={scroll}
              key={index}
              className={`${
                message.senderId === user?._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack gap={3} direction="horizontal" className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Roboto, Tajawal"
          borderColor="rgba(72,112,223,0.2"
          onKeyDown={handleKeyDown}
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <FiSend />
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
