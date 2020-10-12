const express = require("express");

const router = express.Router();

// Model imports
const Posts = require("../model/Post");
const Comments = require("../model/Comment");

// Controller imports
const uploadPost = require("../controller/post/uploadPost");
const { likePost } = require("../controller/post/likePost");
const { commentPost } = require("../controller/post/commentPost");

// Middleware imports
const addToBucket = require("../middlewares/addToBucket");

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
router.post("/upload", addToBucket, uploadPost);
// Like or dislike a post
router.post("/like", likePost);
// Comment on a post
router.post("/comment", commentPost);

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
