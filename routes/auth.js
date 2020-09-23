const express = require("express");
const { body } = require("express-validator/check");

const User = require("../model/Users");
const authController = require("../controller/auth");

const router = express.Router();
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("displayName").trim().not().isEmpty(),
  ],
  authController.signup
);

module.exports = router;
