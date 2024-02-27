import React, { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { useSelector } from "react-redux";

const PotentialChats = () => {
  const user = useSelector((state) => state.user);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
  return (
    <div className="all-users">
      {potentialChats &&
        potentialChats.map((u, index) => {
          return (
            <div
              className="single-user"
              key={index}
              onClick={() => createChat(user._id, u._id)}
            >
              {u.username}
              <span
                className={
                  onlineUsers?.some((user) => user.userId === u._id)
                    ? "user-online"
                    : ""
                }
              ></span>
            </div>
          );
        })}
    </div>
  );
};

export default PotentialChats;
