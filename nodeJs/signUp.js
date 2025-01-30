const express = require("express");
const router = express.Router();
const connection = require("./connection");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;
const d = new Date();
const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

router.post("/signUp", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error occurred!");
      }

      if (data.length !== 0) {
        return res.status(409).send("This email is already taken!");
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
          "INSERT INTO users (email, password, joinDate) VALUES (?, ?, ?)",
          [email, hashedPassword, date],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(501).send("Failed to insert into DB!");
            }

            connection.query(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (err, data) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Server error occurred!");
                }

                if (data.length === 0) {
                  return res.status(404).send("User not found!");
                }

                const user = data[0];
                bcrypt.compare(password, user.password).then((match) => {
                  if (match) {
                    const payload = { id: user.id };
                    const token = JWT.sign(payload, secret, {
                      expiresIn: "1h",
                    });

                    res.cookie("token", token, {
                      httpOnly: true,
                      maxAge: 3600000,
                      secure: true,
                      sameSite: "Strict",
                    });

                    return res.status(201).send("Account created. Welcome!");
                  } else {
                    return res.status(401).send("Password mismatch!");
                  }
                });
              }
            );
          }
        );
      } catch (error) {
        console.error(error);
        return res.status(500).send("Server error occurred!");
      }
    }
  );
});

module.exports = router;
