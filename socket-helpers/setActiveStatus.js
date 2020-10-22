// Model imports
const User = require("../model/User");
const MiniUser = require("../model/MiniUser");

module.exports = (userId, socketId) => {
  User.findById(userId)
    .select("activeStatus socketId")
    .then((user) => {
      user.activeStatus = true;
      user.socketId = socketId;
      user.save();
    });
  MiniUser.findById(userId)
    .select("activeStatus")
    .then((user) => {
      user.activeStatus = true;
      user.save();
    });
};
