const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
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
    photoId: {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  photos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  ],
});

module.exports = mongoose.model("Album", albumSchema);
