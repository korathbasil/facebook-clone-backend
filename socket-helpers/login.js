// Model imports
const User = require("../model/User");

module.exports = (userId) => {
  User.findById(userId)
    .select("miniUserId activeStatus friends")
    .populate({
      path: "friends",
      select: "miniUserId activeStatus",
      populate: {
        path: "id",
      },
    })
    .then((user) => {
      console.log(user);
    });
};
