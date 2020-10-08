const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  miniUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  albumName: {
    type: String,
    required: true,
  },
  latestPhoto: {
    photoId: {
      type: mongoose.Types.ObjectId,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  photos: [
    {
      photoId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Album", albumSchema);
