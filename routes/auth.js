const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
const User = require("../model/Users");
const { signupSchema, loginSchema } = require("../util/validation");

// dotenv.config();

const router = express.Router();
router.put("/signup", async (req, res) => {
  // Data validation
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.send("email already exists");
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    displayName: req.body.displayname,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser._id);
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  const selectedUser = await User.findOne({ email: req.body.email });
  if (!selectedUser) return res.send("user not found");
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    selectedUser.password
  );

  //   Create and assign token
  if (!isPasswordValid) return res.status(400).send("Incorrect password");
  const token = jwt.sign(
    { id: selectedUser._id },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
  res.status(201).send("Logged in");
});

module.exports = router;
