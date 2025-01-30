const connection = require("./connection");
const express = require("express");
const router = express.Router();
const auth = require("./middleware");
const JWT = require("jsonwebtoken");

router.post("/removeOption", auth, (req, res) => {
  const token = req.cookies["token"];
  const userId = JWT.decode(token).id;

  connection.query(
    "DELETE FROM user_options WHERE user_id = ? AND option_id = ?",
    [userId, req.body.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Couldn't delete the option!");
      }

      connection.query(
        "SELECT * FROM user_options WHERE user_id = ?",
        [userId],
        (err, response) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Couldn't fetch user options!");
          }

          const data = response.length === 0 ? [] : response;

          res
            .status(200)
            .json({ message: "The delete was successful!", data: data });
        }
      );
    }
  );
});

module.exports = router;
