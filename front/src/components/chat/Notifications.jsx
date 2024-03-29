import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/chatContext";
import { useSelector } from "react-redux";
import { unreadNotificationsFun } from "../../api/unreadNotifications";
import moment from "moment";

// Import your notification sound file
import notificationSoundFile from "../../assets/notification.mp3";
import { FaRegBell } from "react-icons/fa";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFun(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user.id === n.senderId);

    return {
      ...n,
      sender: sender?.username,
    };
  });

  // Load notification sound on component mount
  const [notificationSound, setNotificationSound] = useState(null);

  useEffect(() => {
    setNotificationSound(new Audio(notificationSoundFile));
  }, []);

  // Play sound when there are new unread notifications
  useEffect(() => {
    if (notificationSound && unreadNotifications.length > 0) {
      notificationSound.play();
    }
  }, [notificationSound, unreadNotifications]);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaRegBell
          style={{
            fontSize: "42px",
          }}
        />
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Mark All As Read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notifications">No New messages</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, i) => {
              return (
                <div
                  key={i}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <span>{`${n.sender} sent you a new message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notifications;

// import { useContext, useState } from "react";
// import { IoChatbubblesOutline } from "react-icons/io5";
// import { ChatContext } from "../../context/chatContext";
// import { useSelector } from "react-redux";
// import { unreadNotificationsFun } from "../../api/unreadNotifications";
// import moment from "moment";

// const Notifications = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const user = useSelector((state) => state.user);
//   const { notifications, userChats, allUsers, markAllNotificationsAsRead,markNotificationAsRead } =
//     useContext(ChatContext);

//   const unreadNotifications = unreadNotificationsFun(notifications);

//   const modifiedNotifications = notifications.map((n) => {
//     const sender = allUsers.find((user) => user.id === n.senderId);

//     return {
//       ...n,
//       sender: sender?.username,
//     };
//   });

//   return (
//     <div className="notifications">
//       <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
//         <IoChatbubblesOutline
//           style={{
//             fontSize: "42px",
//             color: "#fff",
//           }}
//         />
//         {unreadNotifications?.length === 0 ? null : (
//           <span className="notification-count">
//             <span>{unreadNotifications?.length}</span>
//           </span>
//         )}
//       </div>
//       {isOpen ? (
//         <div className="notifications-box">
//           <div className="notifications-header">
//             <h3>Notifications</h3>
//             <div
//               className="mark-as-read"
//               onClick={() => markAllNotificationsAsRead(notifications)}
//             >
//               Mark All As Read
//             </div>
//           </div>
//           {modifiedNotifications?.length === 0 ? (
//             <span className="notifications">No New messages</span>
//           ) : null}
//           {modifiedNotifications &&
//             modifiedNotifications.map((n, i) => {
//               return (
//                 <div
//                   key={i}
//                   className={
//                     n.isRead ? "notification" : "notification not-read"
//                   }
//                   onClick={() =>{
//                     markNotificationAsRead(n, userChats, user, notifications)
//                     setIsOpen(false)}
//                   }
//                 >
//                   <span>{`${n.sender} sent you new message`}</span>
//                   <span className="notification-time">
//                     {moment(n.date).calendar()}
//                   </span>
//                 </div>
//               );
//             })}
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Notifications;
