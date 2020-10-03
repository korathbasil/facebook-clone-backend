// Model imports
const Users = require("../../model/Users");
const Posts = require("../../model/Posts");
module.exports = (userId) => {
  let loggedUser;
  let posts, feed;
  Users.findById(userId).then((user) => {
    loggedUser = {
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
      gender: user.gender,
      DOB: user.DOB,
      profilePicture: user.profilePicture.profilePictureUrl,
      profilePictureId: user.profilePicture.imageId,
      coverPicture: user.coverPicture,
    };
    user.feed.forEach((item) => {});
  });
};
