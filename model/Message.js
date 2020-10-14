const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  miniSenderId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
  },
  messageText: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
