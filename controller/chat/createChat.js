//  Model imports
const Chat = require("../../model/Chat");
const User = require("../../model/User");
const MiniUser = require("../../model/MiniUser");
const Message = require("../../model/Message");

module.exports = (req, res) => {
  const newChat = {
    parties: [req.body.miniUserId, req.body.miniRecieverId],
    messages: [],
  };
  Chat.create(newChat)
    .then((chat) => {
      MiniUser.findById(req.body.miniUserId).then((miniUser) => {
        User.findById(miniUser.userId).then((user) => {
          user.chats.push(chat._id);
          user.save();
        });
      });
      MiniUser.findById(req.body.miniRecieverId).then((miniUser) => {
        User.findById(miniUser.userId).then((user) => {
          user.chats.push(chat._id);
          user.save();
        });
      });
      res.send("chat created");
    })
    .catch((e) => res.send(e));
};
