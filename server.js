const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const bodyParser = require("body-parser");

// Route imports
const authRoute = require("./routes/auth.js");

// Model imports
const Posts = require("./model/Posts.js");
const Users = require("./model/Users.js");

// App config
const app = express();
PORT = process.env.PORT || 8000;
dotenv.config();
app.use(cors({ origin: "http://localhost:3000" }));
// DB config
mongoose.connect(
  "mongodb+srv://administrator:u9B8dWyYbVU2juGw@cluster0.u5egm.mongodb.net/fbCloneDB?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Database connected")
);

// Middlewares
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

// app.get("/users", (req, res) => {
//   Users.find({}, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

app.get("/posts", (req, res) => {
  Posts.find({}, (err, data) => {
    if (err) {
      res.status(500).json({ message: err.message });
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

// app.post("/signup", (req, res) => {
//   const user = req.body;
//   Users.create(user, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });

app.get("/users", (req, res) => {
  Users.find({}, (err, data) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).send(data);
    }
  });
});

app.use("/auth", authRoute);

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
