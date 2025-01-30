const connection = require("./connection");
const express = require("express");
const router = express.Router();
const auth = require("./middleware");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;

router.post("/updateUserProfileData", auth, async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  if (!email || !pass) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const hasedPass = await bcrypt.hash(pass, 10);

  let token = req.cookies["token"];
  const payload = JWT.decode(token);
  delete payload.exp;
  payload.password = pass;
  token = JWT.sign(payload, secret, { expiresIn: "1h" });

  connection.query(
    "UPDATE users SET email = ?, password = ? WHERE id = ?",
    [email, hasedPass, req.userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server problem!");
      }

      res.status(200).json({ email, pass });
    }
  );
});

module.exports = router;
