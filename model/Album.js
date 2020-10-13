const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  miniUserId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
    required: true,
  },
  albumName: {
    type: String,
    required: true,
  },
  latestPhoto: {
    type: mongoose.Types.ObjectId,
    ref: "Photo",
  },
  photos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  ],
});

module.exports = mongoose.model("Album", albumSchema);
