const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../model/Users.js");
const { signupSchema, loginSchema } = require("../util/validation");

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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      DOB: req.body.DOB,
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
  if (!isPasswordValid)
    return res.status(400).json({ message: "Incorrect password" });
  const token = jwt.sign(
    { id: selectedUser._id },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.header("auth-token", token);
  res.status(201).json({
    email: selectedUser.email,
    displayName: selectedUser.displayName,
    avatar: selectedUser.avatar,
  });
});

module.exports = router;
