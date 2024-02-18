const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
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

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update profile route  
router.patch("/me/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password", "bio"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  // if (!isValidOperation) {
  //   console.error("Invalid updates:", updates);
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update the user with the provided data
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    // Save the updated user
    await user.save();
    res.send(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send(error);
  }
});

router
  .route("/:id/avatar")
  .patch(photoUpload.single("avatar"), async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "no file provided" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    const result = await cloudinaryUploadImage(imagePath);

  if (user.profilePhoto && user.profilePhoto.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
    user.profilePhoto = { url: null, publicId: null };
    await user.save();
  }
    user.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    res.status(200).json({
      message: "your profile photo uploaded successfully",
      profilePhoto: { url: result.secure_url, publicId: result.public_id },
    });

    fs.unlinkSync(imagePath);
  })
  .get(async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user || !user.profilePhoto.url) {
        return res.status(404).json({ message: "User or avatar not found" });
      }

      const authClient = await authorize();
      const avatarBuffer = await fetchAvatarFile(
        authClient,
        user.profilePhoto.url
      );

      res.writeHead(200, { 
        "Content-Type": "image/png", 
      });

      res.end(Buffer.from(avatarBuffer, "binary"));
    } catch (err) {
      console.error("Error fetching avatar:", err);
      res.status(500).json({ message: "file too larg" });
    } 
  });

router.route("/:id").get(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("posts");

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    let avatarBuffer;
    if (user.profilePhoto && user.profilePhoto.url) {
      const authClient = await authorize();
      avatarBuffer = await fetchAvatarFile(authClient, user.profilePhoto.url);
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        posts: user.posts,
        profilePhoto: avatarBuffer ? Buffer.from(avatarBuffer, "binary") : null,
      },
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {router};
