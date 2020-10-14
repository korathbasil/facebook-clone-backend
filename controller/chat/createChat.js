//  Model imports
const Chat = require("../../model/Chat");
const User = require("../../model/User");
const MiniUser = require("../../model/MiniUser");
const Message = require("../../model/Message");

module.exports = (req, res) => {
  const newChat = {
    messages: [],
  };
  Chat.create(newChat)
    .then(async (chat) => {
      await User.findById(req.userId).then(async (user) => {
        user.chats.push({
          other: req.body.recieverId,
          chat: chat._id,
        });
        await user.save();
      });
      await User.findById(req.body.recieverId).then(async (user) => {
        user.chats.push({
          other: req.body.userId,
          chat: chat._id,
        });
        await user.save();
      });
      res.send("chat created");
    })
    .catch((e) => res.send(e));
};
