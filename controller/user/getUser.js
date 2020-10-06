// Model imports
const Users = require("../../model/Users");
const Posts = require("../../model/Posts");
const Photos = require("../../model/Photo");
// module.exports = (userId) => {
//   let loggedUser = {};
//   let posts = [];
//   Users.findById(userId).then((user) => {
//     loggedUser = {
//       userId: user._id,
//       email: user.email,
//       displayName: user.displayName,
//       gender: user.gender,
//       DOB: user.DOB,
//       profilePicture: user.profilePicture.profilePictureUrl,
//       profilePictureId: user.profilePicture.imageId,
//       coverPicture: user.coverPicture,
//     };

//   });
// };

module.exports = (userId) => {
  Users.findById(userId)
    .populate("feed")
    .then((user) => {
      console.log(user);
    });
};
