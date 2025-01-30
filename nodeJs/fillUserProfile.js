const connection = require("./connection");
const express = require("express");
const router = express.Router();
const auth = require("./middleware");

router.get("/getUserProfileData", auth, (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [req.userId],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server problem!");
      }
      if (data.length === 0) return res.status(400).send("User not found!");
      else {
        res.status(200).json({ data });
      }
    }
  );
});

module.exports = router;
