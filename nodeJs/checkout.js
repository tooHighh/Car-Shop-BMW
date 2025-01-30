const express = require("express");
const router = express.Router();
const auth = require("./middleware");
const path = require("path");

router.get("/checkout", auth, (req, res) => {
  const filePath = path.join(
    __dirname,
    "../public",
    "aftercheckOut",
    "checkout.html"
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Failed to load the checkout page.");
    }
  });
});

module.exports = router;
