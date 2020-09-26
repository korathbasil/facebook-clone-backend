const mongoose = require("mongoose");

const frienRequestsSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  senderDisplayName: {
    type: String,
    required: true,
  },
  senderProfilePicture: {
    type: String,
    default: "",
  },
  recieverId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  recieverDisplayName: {
    type: String,
    required: true,
  },
  recieverProfilePicture: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("FriendRequests", frienRequestsSchema);
