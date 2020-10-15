//  Model imports
const Chat = require("../../model/Chat");
const User = require("../../model/User");
const MiniUser = require("../../model/MiniUser");

module.exports = (req, res) => {
  const newChat = {
    parties: [req.body.miniUserId, req.body.miniRecieverId],
    messages: [],
  };
  // Creating new chat
  Chat.create(newChat)
    .then((chat) => {
      // Adding id of created chat to Sender's chats array
      MiniUser.findById(req.body.miniUserId).then((miniUser) => {
        User.findById(miniUser.userId).then((user) => {
          user.chats.push(chat._id);
          user.save();
        });
      });
      // Adding id of created chat to Reciever's chats array
      MiniUser.findById(req.body.miniRecieverId).then((miniUser) => {
        User.findById(miniUser.userId).then((user) => {
          user.chats.push(chat._id);
          user.save();
        });
      });
      res.status(201).send("chat created");
    })
    .catch((e) => res.send(e));
};
