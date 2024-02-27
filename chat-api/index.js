// server.js

const { Server } = require("socket.io");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
const io = new Server(server, { cors: "*" });

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    // Check if the user is already in the onlineUsers array
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

      io.emit("getOnlineUsers", onlineUsers);
    }
  });

  // add message`

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.secondUserId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotifications", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // CALLING THIS



 socket.on("callUser", (data) => {
    const calleeSocketId = onlineUsers[data.calleeId];
    if (calleeSocketId) {
      io.to(calleeSocketId).emit("incomingCall", {
        signalData: data.signalData,
        from: data.from,
        callType: data.callType,
      });
    }
  });

  socket.on("answerCall", (data) => {
    const callerSocketId = onlineUsers[data.from];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });
});