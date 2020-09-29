const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Route imports
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");

// App config
const app = express();
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
app.listen(PORT, () => console.log("server started at " + PORT));
