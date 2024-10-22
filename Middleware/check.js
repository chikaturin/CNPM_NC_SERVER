const jwt = require("jsonwebtoken");

const checktokken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const decoded = jwt.decode(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.decoded = decoded;

  next();
};

module.exports = { checktokken };
