// Model imports
const Users = require("../../model/User");
const Photos = require("../../model/Photo");
const Albums = require("../../model/Album");
const Posts = require("../../model/Post");

module.exports = (req, res) => {
  let albumId, newImageId;
  Albums.findOne({
    userId: req.body.userId,
    albumName: "Profile Pictures",
  }).then((album) => {
    albumId = album._id;
  });
  const newImage = {
    userId: req.body.userId,
    miniUserId: req.body.miniUserId,
    small: req.images.small,
    medium: req.images.medium,
    original: req.images.original,
    albumId: albumId,
  };
  Photos.create(newImage, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      newImageId = data._id;
      Albums.findById(albumId).then((album) => {
        album.latestPhoto = {
          photoId: data._id,
          iamgeUrl: req.images.small,
        };
        album.photos.push(data._id);
        album.save();
      });
      const post = {
        variant: req.body.folder,
        authorId: req.body.userId,
        miniAuthorId: req.body.miniUserId,
        caption: "",
        album: albumId,
        image: data._id,
      };
      Posts.create(post, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          Users.findById(data.authorId)
            .then((user) => {
              user.profilePicture = {
                profilePictureUrl: req.images.small,
                imageId: newImageId,
              };

              //   if (req.body.folder === "coverPictures") {
              //     user.coverPicture = {
              //       coverPictureUrl: req.images.medium,
              //       imageId: newImageId,
              //     };
              //   }

              user.posts.push(data._id);
              user.feed.push(data._id);
              user.recentNinePhotos.push(newImageId);
              user.friends.forEach((friend) => {
                Users.findById(friend.id)
                  .then((selectedFriend) => {
                    selectedFriend.feed.push(data._id);
                    selectedFriend.save();
                  })
                  .catch((e) => console.log(e));
              });
              user.save();
            })
            .then(() => {
              res.status(201).send("done success");
            })
            .catch((e) => res.status(401).send(e));
        }
      });
    }
  });
};
