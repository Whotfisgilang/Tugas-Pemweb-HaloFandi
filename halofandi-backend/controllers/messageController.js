const Message = require("../models/Message");

// CREATE MESSAGE
exports.createMessage = async (req, res) => {
  try {
    const message = new Message({
      sender: req.user.id,
      text: req.body.text
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};