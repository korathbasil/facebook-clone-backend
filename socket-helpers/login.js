// Model imports
const User = require("../model/User");

module.exports = (userId) => {
  User.findById(userId)
    .select("miniUserId activeStatus friends")
    .populate({
      path: "friends",
      populate: {
        path: "id",
        select: "miniUserId activeStatus",
      },
    })
    .then((user) => {
      return user.friends;
    });
};
