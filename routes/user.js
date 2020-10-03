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
router.put("/friendRequest", (req, res) => {
  const request = {
    senderId: req.body.userId,
    senderMiniId: req.body.miniUserId,
    recieverId: req.body.targetUserId,
    recieverMiniId: req.body.targetUserMiniId,
  };
  // Adding request to FriendRequest collection
  FriendRequests.create(request, (err, data) => {
    if (err) {
      res.status(403).json({ message: "failed to send request" });
    } else {
      // Adding to friend request sent list of sending user
      Users.findById(req.body.userId)
        .then((user) => {
          user.friendRequestsSent.push({
            requestId: data._id,
          });
          return user.save();
        })
        .then(async (result) => {
          const targetUserData = await Users.findById(req.body.targetUserId);
          return {
            targetUser: targetUserData,
            result: result,
          };
        })
        .then(async ({ targetUser, result }) => {
          // console.log(targetUser);
          targetUser.friendRequestsRecieved.push({
            requestId: data._id,
          });
          savedTargetUser = await targetUser.save();
          return { savedTargetUser: savedTargetUser, result: result };
        })
        .then(({ savedTargetUser, result }) => {
          if (action) {
            res.status(201).send("Friend Request sent successfully");
          } else {
            res.status(201).send("friend request deleted successfully");
          }
        })
        .catch((e) => res.status(400).json({ m: e }));
    }
  });
});

// Accepting or rejecting a friend request
router.post("/friendRequest", (req, res) => {
  const requestId = req.body.requestId;
  const action = req.body.action;
  let senderId, senderMiniId, recieverId, recieverMiniId;
  FriendRequests.findById(requestId)
    .then(async (request) => {
      senderId = request.senderId;
      recieverId = request.recieverId;
      senderMiniId = request.senderMiniId;
      recieverMiniId = request.recieverMiniId;
      // console.log(senderId);
      // console.log(recieverId);
      return request.remove();
    })
    .then((result) => {
      Users.findById(senderId)
        .then(async (user) => {
          user.friendRequestsSent.splice(
            user.friendRequestsSent.findIndex(
              (rqst) => rqst.requestId === requestId
            )
          );
          if (action) {
            user.friends.push({
              id: recieverId,
              miniUserId: recieverMiniId,
            });
          }
          return user.save();
        })
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
      Users.findById(recieverId)
        .then(async (user) => {
          user.friendRequestsRecieved.splice(
            user.friendRequestsSent.findIndex(
              (rqst) => rqst.requestId === requestId
            )
          );
          if (action) {
            user.friends.push({
              id: senderId,
              miniUserId: senderMiniId,
            });
          }
          return user.save();
        })
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
      return result;
    })
    .then((result) => res.status(201).send("Accepted friendRequest"))
    .catch((e) => res.status(403).send(e));
});

// router.post("/profilePicture", (req, res) => {
//   const file = req.files.image;
//   const userId = req.body.userId;
//   const fileName = new Date().toISOString();
//   const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
//   streamifier.createReadStream(new Buffer(file.data)).pipe(
//     imageBucket.file(`profilePictures/${file.name}`).createWriteStream({
//       resumable: false,
//       gzip: true,
//     })
//   );
//   // const newPhoto = {
//   //   userId: ,
//   //   miniUserId: ,
//   //   imageUrl: ,
//   //   albumId: ,
//   //   postId: ,
//   // }
//   //   Photos.create()
//     const newPost = {
//       variant =
//     }
//   Users.findById(userId).then((user) => {
//     user.profilePicture = `https://storage.googleapis.com/fb-clone-images/profilePictures/${fileName}.${fileExtension}`;
//   });
// });

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
