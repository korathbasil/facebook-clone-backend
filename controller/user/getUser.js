// Model imports
const Users = require("../../model/User");

module.exports = (userId) => {
  return new Promise((resolved, rejected) => {
    Users.findById(userId)
      .populate({
        path: "recentNinePhotos feed",
        populate: {
          path: "image miniAuthorId",
        },
      })
      .select("-password")
      .then((user) => {
        // console.log(user);
        resolved(user);
      })
      .catch((e) => rejected(e));
  });
};
