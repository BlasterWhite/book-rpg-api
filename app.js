const express = require("express");

const userRoutes = require("./routes/userRoutes");
const livreRoutes = require("./routes/livreRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/livres", livreRoutes);

module.exports = app;
