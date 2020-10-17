const mongoose = require("mongoose");

const miniUserSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  avtiveStatus: {
    type: Boolean,
    defualt: false,
  },
});

module.exports = mongoose.model("MiniUser", miniUserSchema);
