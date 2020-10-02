const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = verified.id;
    console.log(req.userId);
    next();
  } catch (err) {
    res.status(400).send("Access denied");
  }
};
