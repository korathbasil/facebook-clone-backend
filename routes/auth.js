const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const { signupSchema, loginSchema } = require("../model/validation");

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
  if (!isPasswordValid) return res.status(400).send("Incorrect password");
  res.status(201).send("Logged in");
});

module.exports = router;
