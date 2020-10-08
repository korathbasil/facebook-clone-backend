// Model imports
const Users = require("../../model/User");
const Posts = require("../../model/Post");
const Photos = require("../../model/Photo");
module.exports = (userId) => {
  return new Promise((resolved, rejected) => {
    // let loggedUser = {};
    let posts = [];
    Users.findById(userId)
      .populate("friends")
      .select("-password")
      .then((user) => {
        // loggedUser = {
        //   userId: user._id,
        //   email: user.email,
        //   displayName: user.displayName,
        //   gender: user.gender,
        //   DOB: user.DOB,
        //   profilePicture: user.profilePicture.profilePictureUrl,
        //   profilePictureId: user.profilePicture.imageId,
        //   coverPicture: user.coverPicture,
        // };
        console.log(user);
        resolved(user);
      })
      .catch((e) => console.log(e));
  });
};

// module.exports = (userId) => {
//   Users.findById(userId)
//     .populate("feed")
//     .then((user) => {
//       console.log(user);
//     });
// };
