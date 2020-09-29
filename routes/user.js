const express = require("express");

// Model imports
const Users = require("../model/Users");
const FriendRequests = require("../model/FriendRequests");

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
    senderDisplayName: req.body.displayName,
    senderProfilePicture: req.body.profilePicture,
    recieverId: req.body.targetUserId,
    recieverDisplayName: req.body.targetDisplayName,
    recieverProfilePicture: req.body.targetProfilePicture,
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
  let senderid,
    senderDisplayName,
    senderProfilePicture,
    recieverId,
    recieverDisplayName,
    recieverProfilePicture;
  FriendRequests.findById(requestId)
    .then(async (request) => {
      senderId = request.senderId;
      senderDisplayName = request.senderDisplayName;
      senderProfilePicture = request.senderProfilePicture;
      recieverId = request.recieverId;
      recieverDisplayName = request.recieverDisplayName;
      recieverProfilePicture = request.recieverProfilePicture;
      return request.remove();
    })
    .then((result) => {
      Users.findById(senderId)
        .then(async (user) => {
          user.friendRequestsSent.splice(
            user.friendRequestsSent.findIndex(
              (rqst) => rqst.requestid === requestId
            )
          );
          if (action) {
            user.friends.push({
              id: recieverId,
              displayName: recieverDisplayName,
              profilePicture: recieverProfilePicture,
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
              (rqst) => rqst.requestid === requestId
            )
          );
          if (action) {
            user.friends.push({
              id: senderId,
              displayName: senderDisplayName,
              profilePicture: senderProfilePicture,
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

module.exports = router;
