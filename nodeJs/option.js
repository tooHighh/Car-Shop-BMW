const express = require("express");
const router = express.Router();
const auth = require("./middleware");
const JWT = require("jsonwebtoken");
const connection = require("./connection");

router.post("/sendOption", auth, (req, res) => {
  let token = req.cookies["token"];
  const decoded = JWT.decode(token);

  connection.query(
    "SELECT * FROM user_options WHERE user_id = ? AND option_id = ?",
    [decoded.id, req.body.option_id],
    (err, response) => {
      if (err) console.error(err);
      if (response.length === 0) {
        connection.query(
          "INSERT INTO user_options(user_id,option_id) VALUES (?, ?)",
          [decoded.id, req.body.option_id],
          (err) => {
            if (err) console.error(err);
            res.status(200).send("Added to cart!");
          }
        );
      } else res.status(400).send("This option is already taken!");
    }
  );
});

module.exports = router;
