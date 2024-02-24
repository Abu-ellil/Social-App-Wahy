import React, { useContext, useCallback } from "react";
import { Stack } from "react-bootstrap";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { ChatContext } from "../../context/chatContext";
import { unreadNotificationsFun } from "../../api/unreadNotifications";
import { useSelector } from "react-redux";

const UserChat = ({ chat }) => {
  const loggedInUser = useSelector((state) => state.user);
  const { secondUser } = useGetChatUser(chat, loggedInUser);

  const {
    notifications,
    markNotificationAsRead,
    onlineUsers,
    markThisUserNotesAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFun(notifications);
  const thisuserNotifications = unreadNotifications?.filter(
    (n) => n.senderId === secondUser?._id
  );

  const isOnline = onlineUsers?.some((user) => user.userId === secondUser?._id);

  const handleClick = useCallback(() => {
    if (thisuserNotifications?.length !== 0) {
      markThisUserNotesAsRead(thisuserNotifications, notifications);
    }
  }, [thisuserNotifications, notifications, markThisUserNotesAsRead]);

  return (
    <Stack
      onClick={handleClick}
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
        <div
          className={
            thisuserNotifications && thisuserNotifications.length > 0
              ? "this-user-notifications"
              : ""
          }
        >
          {thisuserNotifications && thisuserNotifications.length > 0
            ? thisuserNotifications.length
            : ""}
        </div>

        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
