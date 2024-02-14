const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

app.use("/users", userRoutes.router);
app.use("/api/", postRoutes.router);
app.use("/api", commentRoutes);
app.use("/", searchRoute);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
