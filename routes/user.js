const express = require("express");
const verifyToken = require("../util/verifyToken");

// Model imports
const Users = require("../model/User");
const Posts = require("../model/Post");

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

// Uploading a profile picture
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

router.get("/getUser", (req, res) => {
  Users.findById(req.body.userId)
    .populate("albums")
    .then((user) => {
      res.send(user);
    })
    .catch((e) => res.send(e));
});

module.exports = router;
