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
const armeRoutes = require("./routes/armeRoutes");
const equipementRoutes = require("./routes/equipementRoutes");

const app = express();

app.use(bodyParser.json());
app.use(
    cors({
        origins: ["http://193.168.146.103:8081", "http://127.0.0.1:5173"], // Autorise les requêtes depuis cette origine
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // Autorise ces méthodes HTTP
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Origin",
            "Origin",
            "X-Requested-With",
            "Accept",
        ], // Autorise ces en-têtes HTTP
        credentials: true, // Autorise l'envoi de cookies avec la demande
        maxAge: 86400, // Cache les résultats de la requête pré-vol (OPTIONS) pendant 24 heures
    }),
);

const secretKey = "sklLeevR0FHz5ha%2ys#";

app.use((req, res, next) => {
    if (((req.path === "/livres" ||
                req.path.includes("popular") ||
                req.path.includes("news") ||
                req.path.includes("images")) &&
            req.method === "GET") ||
        (req.path.includes("/users") &&
            (!req.path.includes("favoris") || !req.path.includes("aventures")) &&
            req.method === "POST")) {
        next();
    } else {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({message: "Token non fourni"});
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({message: "Token invalide"});
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
app.use("/armes", armeRoutes);
app.use("/equipements", equipementRoutes);

module.exports = app;
