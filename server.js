const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Route imports
const authRoute = require("./routes/auth.js");

// Model imports
const Posts = require("./model/Posts.js");
const Users = require("./model/Users.js");

// App config
const app = express();
PORT = process.env.PORT || 8000;
dotenv.config();

//DB config
mongoose.connect(process.env.DB_CONNECTION_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middlewares
app.use(express.json());
app.use(bodyParser());

// API Routes
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/posts", (req, res) => {
  Posts.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/post", (req, res) => {
  const post = req.body;
  Posts.create(post, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.use("./auth", authRoute);

// // SignUp Route
// app.post("/signup", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   Users.create({ email: email, password: password }, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });

// Server listener
app.listen(PORT, () => console.log("server started at " + PORT));
