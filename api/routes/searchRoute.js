const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();

    // Assuming you have access to both users and posts data
    const users = await User.find();
    const posts = await Post.find();

    // Assuming User and Post models have the required fields (e.g., username, email, title, description, category)

    const userResults = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    // Use populate to fetch the user information associated with each post
    const postResults = await Post.find({
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
      ],
    }).populate("user"); // populate the 'user' field

    res.json({ userResults, postResults });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
