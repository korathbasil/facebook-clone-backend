// Model imports
const Users = require("../../model/Users");
const Posts = require("../../model/Posts");
const Photos = require("../../model/Photo");
const Photo = require("../../model/Photo");
module.exports = (userId) => {
  let loggedUser;
  let feed = [];
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
    user.feed.forEach((item) => {
      let currentPost = {};
      Posts.findById(item.postId).then((post) => {
        currentPost = post;
        currentPost.loadedImages = [];
        post.images.forEach((item) => {
          Photo.findById(item.photoid).then((photo) => {
            currentPost.loadedImages.push(photo.imageUrl);
          });
        });
      });
      feed.push(currentPost);
    });
    loggedUser.feed = feed;
    console.log(loggedUser);
    console.log(feed);
  });
};
