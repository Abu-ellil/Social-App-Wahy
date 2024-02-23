
const { Server } = require("socket.io");
const http = require("http"); // Import the HTTP module

const server = http.createServer(); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Specify the CORS origin
    methods: ["GET", "POST"], // Specify allowed methods
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});




// const { Server } = require("socket.io");

// const io = new Server({ cors: "http://localhost:5173" });

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
// });

// server.listen(3003, () => {
//   console.log("server running at http://localhost:3003");
// });
