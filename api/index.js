const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const chatRouter = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const connectToDatabase = require("./utils/mongoDbConnect");
const commentRoutes = require("./routes/commentRoutes");
const searchRoute = require("./routes/searchRoute");

connectToDatabase();
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Define a secret key for JWT
const secretKey = process.env.JWT_SECRET;

// Middleware to verify JWT and authenticate users
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = decoded.user;
    next();
  });
};

// Hash passwords before saving to the database
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare hashed passwords during login
const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT for authentication
const generateToken = (user) => {
  return jwt.sign({ user }, secretKey, { expiresIn: "1h" });
};

app.use("/users", userRoutes.router);
app.use("/api/", postRoutes.router);
app.use("/chats", chatRouter);
app.use("/api/messages", messageRoute);
app.use("/api", commentRoutes);
app.use("/", searchRoute);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
