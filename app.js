const express = require("express");

const client = require("./db/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const query = "SELECT * FROM test";
  client.query(query, (err, result) => {
    if (err) res.status(500).send("Error");
    res.json(result.rows);
  });
});

module.exports = app;
