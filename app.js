const express = require("express");

const userRoutes = require("./routes/userRoutes");
const livreRoutes = require("./routes/livreRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/livres", livreRoutes);
app.use("/sections", sectionRoutes);

module.exports = app;
