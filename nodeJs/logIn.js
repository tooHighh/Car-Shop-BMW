const express = require("express");
const router = express.Router();
const connection = require("./connection");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;

router.post("/logIn", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error occurred!");
      }

      if (data.length === 0) {
        return res.status(400).send("Email or password incorrect!");
      }

      const user = data[0];

      const correspond = await bcrypt.compare(password, user.password);
      if (correspond) {
        const payload = {
          id: user.id,
        };
        const token = JWT.sign(payload, secret, { expiresIn: "1h" });

        res.cookie(`token`, token, {
          httpOnly: true,
          maxAge: 3600000,
          secure: true,
          sameSite: "Strict",
        });
        res.status(200).send("User found. Welcome!");
      } else return res.status(400).send("Wrong password!");
    }
  );
});

module.exports = router;
