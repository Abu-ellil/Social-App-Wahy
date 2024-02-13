const express = require("express");
const Comment = require("../models/Comment.js");

const router = express.Router();

// GET all comments for a specific post
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/// CREATE a new comment
router.post("/posts/:postId/comments", async (req, res) => {
  const comment = new Comment({
    postId: req.params.postId,
    user: req.body.user, // Assuming user ID is sent in the request body
    text: req.body.text,
    username: req.body.username,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a comment by ID
router.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    await comment.remove();
    res.json({ message: "Deleted Comment" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
