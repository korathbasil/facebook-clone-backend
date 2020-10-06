const express = require("express");
const verifyToken = require("../util/verifyToken");
const authentication = require("../controller/auth/authentication");
const authorization = require("../controller/auth/authorization");

const router = express.Router();

// Signup route
router.put("/signup", authentication.signup);
// Login route
router.post("/login", authentication.login);
// User valodation route which send back the authorized user
router.get("/validate", verifyToken, authorization.validateUser);

module.exports = router;
