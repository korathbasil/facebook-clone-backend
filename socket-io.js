const socketIo = require("socket.io");

let io;

module.exports = {
  initIo: (server) => {
    io = socketIo(server);
    return io;
  },
  getIo: () => {
    if (io != null) {
      return io;
    }
  },
};
