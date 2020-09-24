const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  avatar: {
    type: String,
    default: "",
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  gender: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", usersSchema);
