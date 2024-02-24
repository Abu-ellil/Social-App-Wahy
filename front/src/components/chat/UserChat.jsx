import React, { useContext, useCallback } from "react";
import { Stack } from "react-bootstrap";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { ChatContext } from "../../context/chatContext";
import { unreadNotificationsFun } from "../../api/unreadNotifications";
import { useSelector } from "react-redux";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat }) => {
  const loggedInUser = useSelector((state) => state.user);
  const { secondUser } = useGetChatUser(chat, loggedInUser);

  const { notifications, onlineUsers, markThisUserNotesAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

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

  const truncatetext = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText += "...";
    }
    return shortText;
  };
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
          <div className="text">
            {latestMessage?.text && (
              <span>{truncatetext(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="notification-info">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
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
