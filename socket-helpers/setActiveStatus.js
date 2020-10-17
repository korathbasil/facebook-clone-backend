// Model imports
const User = require("../model/User");

module.exports = (userId, socketId) => {
  User.findById(userId)
    .select("activeStatus socketId")
    .then((user) => {
      user.activeStatus = true;
      user.socketId = socketId;
      user.save();
    });
};
