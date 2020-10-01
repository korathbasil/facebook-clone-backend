const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");

// Model imports
const Users = require("../model/Users");
const Photos = require("../model/Photo");
const Albums = require("../model/Album");
const Posts = require("../model/Posts");

module.exports = {
  uploadPost: (req, res) => {
    const variant = req.body.variant;
    const file = req.files.image;
    const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = new Date().toISOString();
    let albumId, postId;

    streamifier.createReadStream(new Buffer(file.data)).pipe(
      imageBucket
        .file(`${variant}/${fileName}.${fileExtension}`)
        .createWriteStream({
          resumable: false,
          gzip: true,
        })
    );
    Users.findById(req.body.userId).then((user) => {
      //   albumId = user.albums.map((album) => {
      //     if (album.albumName === variant) {
      //       return album.albumId;
      //     }
      //   });
      let index = user.albums.findIndex((album) => album.albumName === variant);
      albumId = user.albums[index].albumId;
      user.save();
    });
    const newImage = {
      authorId: req.body.userId,
      miniAuthorId: req.body.miniUserId,
      imageUrl: `https://storage.googleapis.com/fb-clone-images/${variant}/${fileName}.${fileExtension}`,
      albumId: albumId,
    };
    Photos.create(newImage, (err, data) => {
      if (err) {
        console.log(err);
      } else {
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
                user.posts.push({
                  postId: data._id,
                });
                user.feed.push({
                  postId: data._id,
                });
                user.friends.forEach((friend) => {
                  Users.findById(friend.id)
                    .then((selectedFriend) => {
                      selectedFriend.feed.push({
                        postId: data._id,
                      });
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
  },
};
