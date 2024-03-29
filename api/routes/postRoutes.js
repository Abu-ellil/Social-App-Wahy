const Post = require("../models/Post.js");
const express = require("express");
const User = require("../models/User.js");
const {
  authorize,
  uploadFile,
  fetchAvatarFile,
  upload,
} = require("../utils/fileUpload.js");
const { photoUpload } = require("../utils/photoUpload.js");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary.js");
const fs = require("fs");

const router = express.Router();

// CREATE a new post
router.post("/posts", photoUpload.single("image"), async (req, res) => {
  console.log(req.body);
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const url = await cloudinaryUploadImage(imagePath);
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.body.user,
    category: req.body.category,
    image: url.secure_url,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id)
      .populate("user")
      .populate("comments");
    if (post == null) {
      return res.status(404).json({ message: "Cannot find post" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

// GET all posts with pagination
router.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = 2; // Adjust as needed
  let posts;
  try {
    if (page) {
      posts = await Post.find()
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all posts for user
router.get("/:id/posts", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          populate: {
            path: "user",
          },
        },
      })
      .exec();

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        posts: user.posts,
      },
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user").populate("comments");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a post by ID
router.patch("/posts/:id", getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.description != null) {
    res.post.description = req.body.description;
  }
  if (req.body.category != null) {
    res.post.category = req.body.category;
  }
  if (req.body.image != null) {
    res.post.image = req.body.image;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a post by ID
router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Post" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/posts/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.body.userId; // Assuming user ID is sent in request body
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: `Post ${post._id} is ${isLiked ? "unliked" : "liked"}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router };
