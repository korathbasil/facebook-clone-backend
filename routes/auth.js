const express = require("express");
const verifyToken = require("../util/verifyToken");
const { signup, login } = require("../controller/auth/authentication");
const { validateUser } = require("../controller/auth/authorization");

const router = express.Router();

// Signup route
router.put("/signup", signup);
// Login route
router.post("/login", login);
// User validation route which sends back the authorized user
router.get("/validate", verifyToken, validateUser);

module.exports = router;
