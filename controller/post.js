const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");

module.exports = {
  uploadPost: (req, res) => {
    const variant = req.body.variant;
    const file = req.files.image;
    const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = new Date().toISOString();
    const post = {
      authorId: req.body.userId,
      miniAuthorId: req.body.miniUserId,
      caption: req.body.caption,
    };
    streamifier.createReadStream(new Buffer(file.data)).pipe(
      imageBucket
        .file(`mobileUploads/${fileName}.${fileExtension}`)
        .createWriteStream({
          resumable: false,
          gzip: true,
        })
    );
    post.image = `https://storage.googleapis.com/fb-clone-images/mobileUploads/${fileName}.${fileExtension}`;
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
  },
};
