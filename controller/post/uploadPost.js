const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../../util/GCPbucket");

// Model imports
const Users = require("../../model/User");
const Photos = require("../../model/Photo");
const Albums = require("../../model/Album");
const Posts = require("../../model/Post");

module.exports = (req, res) => {
  const variant = req.body.variant;
  const altVariant = req.body.altVariant;
  const file = req.files.image;
  let albumId, postId, variantPictureId, variantImageUrl;

  Users.findById(req.body.userId).then((user) => {
    //   albumId = user.albums.map((album) => {
    //     if (album.albumName === variant) {
    //       return album.albumId;
    //     }
    //   });
    let index = user.albums.findIndex(
      (album) => album.albumName === altVariant
    );
    albumId = user.albums[index].albumId;
    user.save();
  });
  const newImage = {
    userId: req.body.userId,
    miniUserId: req.body.miniUserId,
    imageUrl: `https://storage.googleapis.com/fb-clone-images/${variant}/${fileName}.${fileExtension}`,
    albumId: albumId,
  };
  Photos.create(newImage, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      variantImageUrl = data.imageUrl;
      variantImageId = data._id;
      Albums.findById(albumId).then((album) => {
        album.latestPhoto = {
          photoId: data._id,
          iamgeUrl: data.imageUrl,
        };
        album.photos.push({
          photoId: data._id,
        });
        album.save();
      });
      const post = {
        variant: variant,
        authorId: req.body.userId,
        miniAuthorId: req.body.miniUserId,
        caption: req.body.caption,
        album: {
          albumId: albumId,
          albumName: variant,
        },
        images: [{ photoId: data._id }],
      };
      Posts.create(post, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          Users.findById(data.authorId)
            .then((user) => {
              if (variant === "profilePictures") {
                user.profilePicture = {
                  profilePictureUrl: variantImageUrl,
                  imageId: variantImageId,
                };
              }
              if (variant === "coverPictures") {
                user.coverPicture = variantImageUrl;
              }

              user.posts.push({
                postId: data._id,
              });
              user.feed.push({
                postId: data._id,
              });

              user.friends.forEach((friend) => {
                Users.findById(friend.id)
                  .then((selectedFriend) => {
                    console.log(selectedFriend);
                    selectedFriend.feed.push({
                      postId: data._id,
                    });
                    selectedFriend.save();
                  })
                  .catch((e) => console.log(e));
              });
              return user.save();
            })
            .then((result) => {
              res.status(201).json({ result: result, data: data });
            })
            .catch((e) => res.status(401).send(e));
        }
      });
    }
  });
};
