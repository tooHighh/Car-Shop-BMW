const connection = require("./connection");
const express = require("express");
const router = express.Router();

router.get("/getCarData", (req, res) => {
  const arr1 = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM cars", (err, data1) => {
      if (err) {
        return reject(err);
      }
      resolve(data1);
    });
  });
  const arr2 = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM options", (err, data2) => {
      if (err) {
        return reject(err);
      }
      resolve(data2);
    });
  });
  Promise.all([arr1, arr2]).then(([data1, data2]) => {
    res.status(200).json({ cars: data1, options: data2 });
  });
});

module.exports = router;
