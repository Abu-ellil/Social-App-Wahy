const { Server } = require("socket.io");
const express = require("express");

const app = express();
const PORT = 3003;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Create a Socket.IO server instance
const io = new Server(server, { cors: "http://localhost:5173" });

let onlineUsers = [];

// listen to connection



io.on("connection", (socket) => {
  console.log("A user connected", socket.id);



socket.on("addNewUser", (userId) => {
  !onlineUsers.some((user) => user.userId === user) &&
    onlineUsers.push({
      userId,
      socketId: socket.id,
    });
console.log(onlineUsers);

io.emit('getOnlineUsers', onlineUsers);

});



});