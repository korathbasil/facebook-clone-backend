const mongoose = require("mongoose");

const potsSchema = mongoose.Schema({
  displayName: String,
  avatar: String,
  caption: String,
  image: String,
  likesCount: Number,
  commentsCount: Number,
  sharesCount: Number,
});

module.exports = mongoose.model("Posts", potsSchema);
