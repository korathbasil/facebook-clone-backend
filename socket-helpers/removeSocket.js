// Model imports
const User = require("../model/User");

module.exports = (userId) => {
  User.findById(userId)
    .select("activeStatus socketId")
    .then((user) => {
      user.activeStatus = false;
      user.socketId = "";
      user.save();
    });
};
