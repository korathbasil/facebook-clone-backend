const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
});

module.exports = mongoose.model("users", usersSchema);
