const http = require("http");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");

// Route imports
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const { pathToFileURL } = require("url");

// App config
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
PORT = process.env.PORT || 8000;
dotenv.config();
const gc = new Storage({
  keyFilename: path.join(__dirname, "facebook-clone-291012-cc3214523360.json"),
  projectId: "facebook-clone-291012",
});

gc.getBuckets().then((buckets) => console.log(buckets));
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

// Middlewares
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
app.post("/post", postRoute);

//  User Route
app.put("/user", userRoute);

// Server listener
server.listen(PORT, () => console.log("server started at " + PORT));
