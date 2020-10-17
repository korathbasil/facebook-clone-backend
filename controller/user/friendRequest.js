// Model imports
const FriendRequests = require("../../model/FriendRequest");
const Users = require("../../model/User");

module.exports = {
  sendRequest: (req, res) => {
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
            user.friendRequestsSent.unshift({
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
            targetUser.friendRequestsRecieved.unshift({
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
  },
  acceptRequest: (req, res) => {
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
              user.friends.unshift({
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
              user.friends.unshift({
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
  },
};
