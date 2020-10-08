const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  miniUserId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
