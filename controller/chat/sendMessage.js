// Model imports
const Chat = require("../../model/Chat");
const Message = require("../../model/Message");

module.exports = (req, res) => {
  const newMessage = {
    senderId: req.userId,
    miniSenderId: req.body.miniSenderId,
    messageText: req.body.messageText,
  };
  Message.create(newMessage)
    .then((msg) => {
      Chat.findById(req.body.chatId).then((chat) => {
        chat.messages.unshift(msg._id);
        chat.save();
      });
      res.send("message sent!");
    })
    .catch((e) => res.send(e));
};
