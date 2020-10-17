// Model imports
const User = require("../model/User");

module.exports = (userId) => {
  User.findById(userId)
    .select("miniUserId activeStatus friends")
    .populate({
      path: "friends",
      select: "miniUserId activeStatus",
    })
    .then((user) => {
      console.log(user);
    });
};
