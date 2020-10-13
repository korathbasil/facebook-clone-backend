const Users = require("../../model/User");

module.exports = {
  validateUser: (req, res) => {
    if (req.userId) {
      Users.findById(req.userId)
        .then((user) => {
          const loggedUser = {
            id: req.userId,
            miniUserId: user.miniUserId,
            email: user.email,
            displayName: user.displayName,
            profilePicture: user.profilePicture,
            friends: user.friends,
          };
          return loggedUser;
          // clg(user);
        })
        .then((user) => {
          res.status(200).send(user);
        })
        .catch((e) => res.status(402).send(e));
    }
  },
};
