const express = require("express");
const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");
const verifyToken = require("../util/verifyToken");

// Model imports
const Users = require("../model/Users");
const FriendRequests = require("../model/FriendRequests");
const Photos = require("../model/Photo");
const Posts = require("../model/Posts");

// Controller imports
const {
  sendRequest,
  acceptRequest,
} = require("../controller/user/friendRequest");
const { uploadPost } = require("../controller/post");

const router = express.Router();

// fetching details of a particular user
router.post("/getDetails", (req, res) => {
  let displayName, email, gender, DOB;
  const friends = [];
  Users.findById(req.body.userId)
    .then((user) => {
      displayName = user.displayName;
      email = user.email;
      gender = user.gender;
      DOB = user.DOB;
      user.friends.forEach((friend) => {
        friends.push(friend);
      });
      res.status(200).json({
        email: email,
        displayName: displayName,
        gender: gender,
        DOB: DOB,
        friends: friends,
      });
    })
    .catch((e) => res.status(401).json({ m: e.message }));
});

// Sending a friend request
router.put("/friendRequest", sendRequest);

// Accepting or rejecting a friend request
router.post("/friendRequest", acceptRequest);

router.post("/profilePicture", uploadPost);

router.get("/getFeed", verifyToken, (req, res) => {
  let posts = [];
  Users.findById(req.userId).then((user) => {
    console.log(user.feed);
    user.feed.forEach((item) => {
      Posts.findById(item.postId).then((post) => {
        posts.push(post);
        res.status(200).send(posts);
      });
    });
  });
});

module.exports = router;
