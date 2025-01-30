const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;

function authenticateToken(req, res, next) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = JWT.verify(token, secret);
    req.userId = payload.id;
    req.pass = payload.password;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
