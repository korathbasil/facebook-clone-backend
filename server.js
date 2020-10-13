const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const getUser = require("./controller/user/getUser");

// Route imports
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");

// App config
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
PORT = process.env.PORT || 8000;
dotenv.config();

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

// Socket listener
io.on("connection", (socket) => {
  console.log(" user connected");
});

// getUser("5f7f19cc6210b1561207400c");

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

// Test file upload => SUCCESS
const addToBucket = require("./middlewares/addToBucket");
app.post("/testFile", (req, res) => {
  console.log(req.files);
  // const file = req.files.image;
  // console.log(req.files, req.body);
  // streamifier.createReadStream(new Buffer(file.data)).pipe(
  //   imageBucket.file(`profilePictures/${file.name}`).createWriteStream({
  //     resumable: false,
  //     gzip: true,
  //   })
  // );
  // res.send(file);
  res.send("done");
});

// Server listener
server.listen(PORT, () => console.log("server started at " + PORT));
