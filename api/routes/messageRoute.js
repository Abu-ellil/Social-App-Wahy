const express = require("express");
const {
  createMessage,
  getMessages,
  depugg,
} = require("../controllers/messagesController");
const router = express.Router();



router.post("/", createMessage);
router.get("/:chatId", getMessages);
router.get("/debug/messages/:chatId", depugg);

module.exports = router;
