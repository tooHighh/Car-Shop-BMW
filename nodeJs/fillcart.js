const connection = require("./connection");
const auth = require("./middleware");
const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");

router.get("/fillCart", auth, (req, res) => {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const userId = JWT.decode(token).id;

  connection.query(
    "SELECT * FROM user_options WHERE user_id = ?",
    [userId],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const optionPromises = data.map((option) => {
        return new Promise((resolve, reject) => {
          connection.query(
            "SELECT * FROM options WHERE option_id = ?",
            [option.option_id],
            (err, response) => {
              if (err) return reject(err);
              resolve(response);
            }
          );
        });
      });

      Promise.all(optionPromises)
        .then((options) => {
          res.status(200).send(options);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        });
    }
  );
});

module.exports = router;
