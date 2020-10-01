const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  miniUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  albumId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("Photos", photoSchema);
