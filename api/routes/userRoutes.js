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

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // Create a new user
    const user = new User(req.body);
    await user.save();
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
    const user = await User.findOne({ email: email }); // Corrected query

    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    // Assuming you have a method to check password validity, replace this with your actual implementation
    const isPasswordValid = user.checkPassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
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

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.send(req.user);
  } catch (error) {
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

    if (user.profilePhoto?.publicId !== null) {
      await cloudinaryRemoveImage(user.profilePhoto.publicId);
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
        "Content-Type": "image/png", // Adjust the content type based on your avatar format
      });

      res.end(Buffer.from(avatarBuffer, "binary"));
    } catch (err) {
      console.error("Error fetching avatar:", err);
      res.status(500).json({ message: "Internal Server Error" });
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
