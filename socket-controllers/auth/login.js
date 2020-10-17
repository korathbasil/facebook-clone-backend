// Model imports
const User = require("../../model/User");

module.exports = (userId) => {
  User.findById(userId)
    .select("activeStatus friends")
    .polpulate({
      path: "friends",
      select: "activeStatus",
    })
    .then((user) => {
      user.activeStatus = true;
      user.save();
    });
};
