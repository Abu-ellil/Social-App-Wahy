import React from "react";
import { Stack } from "react-bootstrap";
import { useGetChatUser } from "../../hooks/useGetChatUser";

const UserChat = ({ chat, user }) => {
  const { secondUser } = useGetChatUser(chat, user);
  
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card"
      role="button"
    >
      <div className="second-user-info">
        <div className="">
          <img src={secondUser?.user.profilePhoto.url} alt="" height="33px" />
        </div>
        <div className="text-content">
          <div className="name">{secondUser?.user.username}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="notification-info">
        <div className="date">12/12/2022</div>
        <div className="this-user-notifications">2</div>
        <span className="user-online"></span>
      </div>
    
    </Stack>
  );
};

export default UserChat;
