const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../../util/GCPbucket");

const { getIo } = require("../../socket-io");
const io = getIo();

// Model imports
const Users = require("../../model/User");
const Photos = require("../../model/Photo");
const Albums = require("../../model/Album");
const Posts = require("../../model/Post");

module.exports = (req, res) => {
  if (req.hasImage) {
    let albumId, newImageId;
    Albums.findOne({
      userId: req.body.userId,
      albumName: "Timeline Photos",
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
          album.latestPhoto = data._id;
          album.photos.unshift(data._id);
          album.save();
        });
        const post = {
          variant: req.body.folder,
          authorId: req.body.userId,
          miniAuthorId: req.body.miniUserId,
          caption: req.body.caption,
          album: albumId,
          image: data._id,
        };
        Posts.create(post, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            Users.findById(data.authorId)
              .then((user) => {
                user.posts.unshift(data._id);
                user.feed.unshift(data._id);
                user.recentNinePhotos.unshift(newImageId);
                user.friends.forEach((friend) => {
                  Users.findById(friend.id)
                    .then((selectedFriend) => {
                      selectedFriend.feed.unshift(data._id);
                      selectedFriend.save();
                    })
                    .catch((e) => console.log(e));
                });
                user.save();
              })
              .then(() => {
                io.to(toString(req.body.userId)).emit("new-post", {
                  post: data,
                });
                res.status(201).send("done success");
              })
              .catch((e) => res.status(401).send(e));
          }
        });
      }
    });
  } else {
    const post = {
      variant: req.body.folder,
      authorId: req.body.userId,
      miniAuthorId: req.body.miniUserId,
      caption: req.body.caption,
    };
    Posts.create(post, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        Users.findById(data.authorId)
          .then((user) => {
            user.posts.unshift(data._id);
            user.feed.unshift(data._id);
            user.friends.forEach((friend) => {
              Users.findById(friend.id)
                .then((selectedFriend) => {
                  selectedFriend.feed.unshift(data._id);
                  selectedFriend.save();
                })
                .catch((e) => console.log(e));
            });
            user.save();
          })
          .then(() => {
            io.to(toString(req.body.userId)).emit("new-post", {
              post: data,
            });
            res.status(201).send("done success");
          })
          .catch((e) => res.status(401).send(e));
      }
    });
  }
};
