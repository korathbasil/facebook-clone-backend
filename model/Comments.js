const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  miniUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
