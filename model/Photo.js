const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  miniUserid: {
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
});

module.exports = mongoose.model("Photos", photoSchema);
