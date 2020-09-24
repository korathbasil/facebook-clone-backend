const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
const Users = require("../model/Users.js");
const { signupSchema, loginSchema } = require("../util/validation");

// dotenv.config();

const router = express.Router();
router.put("/signup", async (req, res) => {
  // Data validation
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  const userExists = await Users.findOne({ email: req.body.email });
  if (userExists) return res.send("email already exists");
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new Users({
      email: req.body.email,
      password: hashedPassword,
      displayName: req.body.displayName,
      gender: req.body.gender,
    });

    const saveduser = await user.save();
    return res.status(201).json({ id: saveduser._id });
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
  const selectedUser = await Users.findOne({ email: req.body.email });
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
  res.header("auth-token", token);
  res.status(201).send("Logged in");
});

module.exports = router;
