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
    const newMessage = await message.save();
    await newMessage.populate("senderId").execPopulate();
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find messages and populate the 'senderId' field with the user
    const messages = await messageModel.find({ chatId }).populate("senderId");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };
