const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const livreRoutes = require("./routes/livreRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const personnageRoutes = require("./routes/personnageRoutes");
const imageRoutes = require("./routes/imageRoutes");
const aventureRoutes = require("./routes/aventureRoutes");
const levenschteinRoutes = require("./routes/levenschteinRoutes");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://193.168.146.103:8081", // Autorise les requêtes depuis cette origine
    methods: ["GET", "POST", "OPTIONS"], // Autorise ces méthodes HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Autorise ces en-têtes personnalisés
    credentials: true, // Autorise l'envoi de cookies avec la demande
    maxAge: 86400, // Cache les résultats de la requête pré-vol (OPTIONS) pendant 24 heures
  }),
);

const secretKey = "sklLeevR0FHz5ha%2ys#";

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Max-Age", "1800");
//   next();
// });

app.use((req, res, next) => {
  if (
    (req.path === "/livres" && req.method === "GET") ||
    (req.path.includes("/users") &&
      (!req.path.includes("favoris") || !req.path.includes("aventures")) &&
      req.method === "POST") ||
    (req.path === "/images" && req.method === "GET")
  ) {
    next();
  } else {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Token non fourni" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide" });
      }
      req.user = decoded;
      next();
    });
  }
});

app.use("/users", userRoutes);
app.use("/livres", livreRoutes);
app.use("/sections", sectionRoutes);
app.use("/personnages", personnageRoutes);
app.use("/images", imageRoutes);
app.use("/aventures", aventureRoutes);
app.use("/levenschtein", levenschteinRoutes);

module.exports = app;
