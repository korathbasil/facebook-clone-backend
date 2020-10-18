// Model imports
const User = require("../model/User");

module.exports = (userId) => {
  return new Promise((resolved, rejected) => {
    User.findById(userId)
      .select("miniUserId activeStatus friends")
      .populate({
        path: "friends",
        populate: {
          path: "id",
          select: "socketId activeStatus",
        },
      })
      .then((user) => {
        // console.log(user);
        let activeFriends = [];
        user.friends.map((friend) => {
          if (friend.id.activeStatus == true) {
            // console.log(friend);
            activeFriends.push(friend);
          }
        });
        resolved(activeFriends);
      });
  });
};
