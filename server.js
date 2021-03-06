const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const getUser = require("./controller/user/getUser");
const socketIo = require("./socket-io");

// Route imports
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");

// App config
const app = express();
const server = http.createServer(app);
const io = socketIo.initIo(server);
PORT = process.env.PORT || 8000;
dotenv.config();

// Socket-helpers import
const getActiveFriends = require("./socket-helpers/getActiveFriends");
const removeSocket = require("./socket-helpers/removeSocket");
const setActiveStatus = require("./socket-helpers/setActiveStatus");

let friendSocketId;
// Socket listener
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("login", (data) => {
    socket.userId = data.userId;
    socket.join(toString(data.userId));
    setActiveStatus(data.userId, socket.id);
    getActiveFriends(data.userId).then((activeFriends) => {
      activeFriends.forEach((friend) => {
        socket.join(toString(friend._id));
        socket.broadcast
          .to(toString(friend.socketId))
          .emit("new-user-login", { userId: data.userId });
      });
    });
  });
  socket.on("join-to-new-user", (data) => {
    socket.join(toString(data.userId));
  });
  socket.on("disconnecting", () => {
    // console.log(socket.rooms);
    if (socket.userId) {
      removeSocket(socket.userId);
    }
  });
  socket.on("disconnect", () => {});
});

// DB config
mongoose.connect(
  process.env.DB_CONNECTION_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Database connected")
);

// Middlewares
app.use(fileUpload());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// API Routes
// hello world test
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

//  Authentication Route
app.use("/auth", authRoute);

// Post Route
app.use("/post", postRoute);

//  User Route
app.use("/user", userRoute);

// Chat Route
app.use("/chat", chatRoute);

// Test file upload => SUCCESS
const addToBucket = require("./middlewares/addToBucket");
const Albums = require("./model/Album");
const { send } = require("process");
const { getIo } = require("./socket-io");
app.post("/testFile", (req, res) => {
  console.log(req.files);
  console.log(req.body);
  Albums.findOne({
    userId: req.body.userId,
    albumName: "Timeline Photos",
  })
    .then((album) => {
      res.send(album);
      console.log(album);
    })
    .catch(() => res.send("Album not found"));
  // const file = req.files.image;
  // console.log(req.files, req.body);
  // streamifier.createReadStream(new Buffer(file.data)).pipe(
  //   imageBucket.file(`profilePictures/${file.name}`).createWriteStream({
  //     resumable: false,
  //     gzip: true,
  //   })
  // );
  // res.send(file);
  // res.send("done");
});

// Server listener
server.listen(PORT, () => console.log("server started at " + PORT));
