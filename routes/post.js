const express = require("express");
const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");

// Model imports
const Posts = require("../model/Posts");
const Comments = require("../model/Comments");
const router = express.Router();

// Fetch all posts
router.get("/getAll", (req, res) => {
  Posts.find({}, (err, data) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).send(data);
    }
  });
});

// Uploading a post
router.post("/upload", (req, res) => {
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
      .file(`normalUploads/${fileName}.${fileExtension}`)
      .createWriteStream({
        resumable: false,
        gzip: true,
      })
  );
  post.image = `https://storage.googleapis.com/fb-clone-images/normalUploads/${fileName}.${fileExtension}`;
  Posts.create(post, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Like or dislike a post
router.post("/like", (req, res) => {
  const postId = req.body.postId;
  const action = req.body.like;
  const userId = req.body.userId;
  const displayName = req.body.displayName;
  Posts.findById(postId)
    .then(async (post) => {
      if (action) {
        post.likesCount = post.likesCount + 1;
        post.likes.push({
          userId: userId,
          displayName: displayName,
        });
        return post.save();
      } else {
        if (post.likesCount === 0) {
          res.status(400).send("cant dislike, already no like");
        } else {
          post.likesCount = post.likesCount - 1;
          post.likes.splice(
            post.likes.findIndex((like) => like.userId === userId),
            1
          );
          return post.save();
        }
      }
    })
    .then((result) => res.send(result))
    .catch((e) => res.status(400).json({ message: e.message }));
});

// Comment on a post
router.post("/comment", (req, res) => {
  const newComment = {
    postId: req.body.postId,
    userId: req.body.userId,
    displayName: req.body.displayName,
    content: req.body.content,
  };
  Comments.create(newComment, async (err, data) => {
    if (err) {
      console.log("Helooo");
      res.status(500).json({ message: err.message });
    } else {
      await Posts.findById(data.postId)
        .then((post) => {
          post.comments.push({
            commentId: data._id,
          });
          return post.save();
        })
        .then((result) =>
          res.status(201).json({
            message: "Comment added to post successfully",
          })
        )
        .catch((e) =>
          res.status(400).json({
            message: e.message,
          })
        );
    }
  });
});

// Load comments on a particular post
router.post("/comments", (req, res) => {
  const commentIds = req.body.commentIds;
  Comments.find({ _id: { $in: commentIds } }, (err, data) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
