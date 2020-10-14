const express = require("express");

const router = express.Router();

// Controller imports
const createChat = require("../controller/chat/createChat");
const sendMessage = require("../controller/chat/sendMessage");

// Middleware imports
const verifyToken = require("../util/verifyToken");

// Create chat
router.post("/create", verifyToken, createChat);
// Send a message to a chat
router.post("/sendMessage", verifyToken, sendMessage);

module.exports = router;
