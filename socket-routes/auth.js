const socketIo = require("../socket-io");

// Socket listener
socketIo.getIo().on("connection", (socket) => {
  socket.on("login", (data) => {
    console.log(data);
  });
});
