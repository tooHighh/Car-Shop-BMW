const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("./middleware");

router.get("/afterSignUp", auth, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public", "aftersignUp", "aftersignup.html")
  );
});

module.exports = router;
