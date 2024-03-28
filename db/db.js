// on utilise une base de donnée postgres
const { Client } = require("pg");

const client = new Client({
  host: "193.168.146.103",
  port: 5432,
  user: "postgres",
  password: "7tbz4M8pgC5nEn2bkEBkptokV4DmgC",
  database: "postgres",
});
client.connect();

module.exports = client;
