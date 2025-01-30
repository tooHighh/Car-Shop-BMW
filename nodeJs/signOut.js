const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/signOut", (req, res) => {
  res.clearCookie("token");
  res.status(200).sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = router;
