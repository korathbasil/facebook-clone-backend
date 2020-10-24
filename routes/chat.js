const express = require("express");

const router = express.Router();

// Controller imports
const createChat = require("../controller/chat/createChat");
const sendMessage = require("../controller/chat/sendMessage");
const getChats = require("../controller/chat/getChats");

// Middleware imports
const verifyToken = require("../util/verifyToken");
// Get chats for given IDs
router.post("/getChats", getChats);
// Create chat
router.post("/create", createChat);
// Send a message to a chat
router.post("/sendMessage", sendMessage);

module.exports = router;
