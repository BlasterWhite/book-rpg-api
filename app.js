const express = require("express");

const userRoutes = require("./routes/userRoutes");
const livreRoutes = require("./routes/livreRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const personnageRoutes = require("./routes/personnageRoutes");
const imageRoutes = require("./routes/imageRoutes");
const aventureRoutes = require("./routes/aventureRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/livres", livreRoutes);
app.use("/sections", sectionRoutes);
app.use("/personnages", personnageRoutes);
app.use("/images", imageRoutes);
app.use("/aventures", aventureRoutes);

module.exports = app;
