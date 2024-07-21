require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
