const messageModel = require("../models/messageModel");
const User = require("../models/User.js")

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
   
    res.status(200).json(response);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {

    const messages = await messageModel.find({ chatId });
    
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};


const depugg = async (req, res) => {
  const { chatId } = req.params;
const messagesForChat = await messageModel.find({
  chatId: "65d7c0f79bb18667f1fb9b30",
});
console.log("Messages for chatId '65d7c0f79bb18667f1fb9b30':", messagesForChat);
  try {
    const messagesForChat = await messageModel.find({ chatId });
    console.log("Messages for chatId:", chatId, ":", messagesForChat);
    res.status(200).json(messagesForChat);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createMessage, getMessages, depugg };
