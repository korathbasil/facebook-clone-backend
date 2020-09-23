const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  email: String,
  username: String,
  displayName: String,
  avatar: String,
  password: String,
});

module.exports = mongoose.model("users", usersSchema);
