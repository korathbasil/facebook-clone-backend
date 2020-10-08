const mongoose = require("mongoose");

const frienRequestSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderMiniId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
    required: true,
  },
  recieverId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recieverMiniId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
    required: true,
  },
});

module.exports = mongoose.model("FriendRequest", frienRequestSchema);
