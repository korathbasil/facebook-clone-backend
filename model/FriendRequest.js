const mongoose = require("mongoose");

const frienRequestSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  senderMiniId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  recieverId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  recieverMiniId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("FriendRequest", frienRequestSchema);
