const http = require("http");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
const fileUpload = require("express-fileupload");
const streamifier = require("streamifier");
const { Buffer } = require("buffer");
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

// GCP config
const gc = new Storage({
  keyFilename: path.join(__dirname, "facebook-clone-291012-cc3214523360.json"),
  projectId: "facebook-clone-291012",
});
const imageBucket = gc.bucket("fb-clone-images");

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

getUser("5f75e69bd0a0a930b9d64feb");

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

app.post("/testFile", async (req, res) => {
  const file = req.files.image;
  console.log(req.files, req.body);
  streamifier.createReadStream(new Buffer(file.data)).pipe(
    imageBucket.file(`profilePictures/${file.name}`).createWriteStream({
      resumable: false,
      gzip: true,
    })
  );
  res.send(file);
});

// Server listener
server.listen(PORT, () => console.log("server started at " + PORT));
