// Model imports
const Users = require("../../model/User");
const Photos = require("../../model/Photo");
const Albums = require("../../model/Album");
const Posts = require("../../model/Post");

module.exports = (req, res) => {
  let albumId;
  Users.findById(req.body.userId).then((user) => {
    let index = user.albums.findIndex(
      (album) => album.albumName === "Profile Pictures"
    );
    albumId = user.albums[index].albumId;
    user.save();
  });
};
