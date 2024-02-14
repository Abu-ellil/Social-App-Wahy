// searchRoute.js
const express = require("express");
const router = express.Router();

router.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();

  // Assuming you have access to both users and posts data
  const userResults = users.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );

  const postResults = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
  );

  res.json({ userResults, postResults });
});
 