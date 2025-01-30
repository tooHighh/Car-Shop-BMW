const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DaTABASE,
});

connection.connect((err) => {
  if (err) console.log(err);
  console.log("Connected succesfully!");
});

module.exports = connection;
