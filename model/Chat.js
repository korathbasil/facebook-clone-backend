const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  //   parties: [{ type: mongoose.Types.ObjectId, ref: "MiniUser" }],
  messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Chat", chatSchema);
