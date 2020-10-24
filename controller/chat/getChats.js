// Model imports
const Chat = require("../../model/Chat");

module.exports = (req, res) => {
  const chatIds = req.body.chatIds;
  const userId = req.body.userId;
  Chat.find({ _id: { $in: chatIds } })
    .populate("parties messages")
    .then((chats) => {
      let alteredChat = [];
      chats.forEach((chat) => {
        let secondParty;
        chat.parties.forEach((party) => {
          if (party.userId != userId) {
            secondParty = party;
          }
        });
        // console.log(secondParty);
        newChat = {
          id: chat._id,
          party: secondParty,
          messages: chat.messages,
        };
        alteredChat.push(newChat);
      });
      res.send(alteredChat);
    })
    .catch(() => res.send("no chats found"));
};
