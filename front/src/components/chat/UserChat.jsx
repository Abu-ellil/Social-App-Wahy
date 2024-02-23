import React, { useContext } from "react";
import { Stack } from "react-bootstrap";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { ChatContext } from "../../context/chatContext";

const UserChat = ({ chat, user }) => {
  const { secondUser } = useGetChatUser(chat, user);
  const {onlineUsers} = useContext(ChatContext)

  const isOnline = onlineUsers?.some((user) => user.userId === secondUser?._id)
 
  
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card"
      role="button"
    >
      <div className="second-user-info">
        <div className="">
          <img src={secondUser?.profilePhoto.url} alt="" height="33px" />
        </div>
        <div className="text-content">
          <div className="name">{secondUser?.username}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="notification-info">
        <div className="date">12/12/2022</div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ?  "user-online": ""}></span>
      </div>
    
    </Stack>
  );
};

export default UserChat;
