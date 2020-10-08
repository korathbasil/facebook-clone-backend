// Model imports
const Users = require("../../model/User");

module.exports = (userId) => {
  return new Promise((resolved, rejected) => {
    Users.findById(userId)
      .populate("friends")
      .select("-password")
      .then((user) => {
        resolved(user);
      })
      .catch((e) => rejected(e));
  });
};
