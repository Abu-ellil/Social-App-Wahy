const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment"); // Import Comment model
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();

    // Search for users
    const userResults = await User.find({
      $or: [
        { username: { $regex: new RegExp(query, "i") } },
        { email: { $regex: new RegExp(query, "i") } },
      ],
    });

    // Search for posts and populate user and comments
    const postResults = await Post.find({
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
      ],
    })
      .populate({
        path: "user",
        select: "username email profilePhoto posts",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username",
        },
      });

    res.status(200).json({ userResults, postResults });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
