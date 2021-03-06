// Model imports
const Users = require("../../model/User");

module.exports = {
  getFeed: (req, res) => {
    Users.findById(req.userId).then((user) => {
      console.log(user.feed);
    });
  },
  getPosts: (req, res) => {
    Users.findById(req.userId).then((user) => {
      console.log(user.posts);
    });
  },
};
