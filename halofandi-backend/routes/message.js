const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createMessage,
  getMessages
} = require("../controllers/messageController");

router.post("/", auth, createMessage);
router.get("/", auth, getMessages);

module.exports = router;