const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../model/Users");

exports.signup = (req, res, next) => {
  console.log("object");
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const displayName = req.body.displayName;
  const password = req.body.password;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        displayName: displayName,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user created", userId: result._id });
    })
    .catch((err) => alert(err));
};
