const express = require("express");
const mongoose = require("mongoose");

const Posts = require("./model/posts.js");
const Users = require("./model/users.js");

// App config
const app = express();
PORT = process.env.PORT || 8000;

//DB config
const dbConnectionUrl =
  "mongodb+srv://admin:bnmP7PDnPEmWTiSv@cluster0.u5egm.mongodb.net/facebookDB?retryWrites=true&w=majority";
mongoose.connect(dbConnectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middlewares
app.use(express.json());

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

// Server listener
app.listen(PORT, () => console.log("server started at " + PORT));
