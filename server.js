const http = require("http");
const path = require("path");
const os = require("os");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const streamifier = require("streamifier");

// Route imports
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const { pathToFileURL } = require("url");
const { Buffer } = require("buffer");

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

// gc.getBuckets().then((buckets) => console.log(buckets));
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
// app.use(multer().single("image"));
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
app.post("/post", postRoute);

//  User Route
app.put("/user", userRoute);

// Testing
// app.post("/testFile", (req, res) => {
//   const BusBoy = require("busboy");
//   const busboy = new BusBoy({ headers: req.headers });
//   let imageFileName;
//   imageToBeUploaded = {};
//   busboy.on("file", (fieldName, file, fileName, encoding, mimetype) => {
//     const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
//     imageFileName = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
//     const filePath = path.join(os.tmpdir(), imageFileName);
//     imageToBeUploaded = { filePath, mimetype };
//     file.pipe(fs.createWriteStream(filePath));
//   });
//   busboy.on("finish", () => {
//     imageBucket.upload(imageToBeUploaded.filePath, {
//       resumable: false,
//     });
//   });
//   busboy.end(req.rawBody);
//   // imageBucket
//   //   .file(req.file.originalname)
//   //   .createWriteStream({
//   //     resumable: false,
//   //     gzip: true,
//   //   })
//   //   .then(() => res.send("Image Uploaded"));
// });

app.post("/testFile", async (req, res) => {
  const file = req.files.image;
  streamifier.createReadStream(new Buffer(file.data)).pipe(
    imageBucket.file(file.name).createWriteStream({
      resumable: false,
      gzip: true,
    })
  );
  // // const { createReadStream, filename } = await file;
  // createReadStream(file).pipe(

  //     .catch((e) => console.log(e))
  // );
  // console.log(file.data);
  res.send(file);
});

// Server listener
server.listen(PORT, () => console.log("server started at " + PORT));
