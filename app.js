const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const livreRoutes = require("./routes/livreRoutes");
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
    try {
        if (((req.path === "/livres" ||
                    req.path.includes("popular") ||
                    req.path.includes("news") ||
                    req.path.includes("images")) &&
                req.method === "GET") ||
            (req.path.includes("/login") && req.method === "POST")) {
            req.byPass = true;
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
                console.log(req.user)
                next();
            });
        }
    } catch (error) {
        req.user = null;
        console.log(error)
        next();
    }
});

app.use((req, res, next) => {
    if (req.byPass || !req.user) { // le login
        return next();
    }

    if (req.user.permission === "admin") { // un admin à tous les droits
        return next();
    }

    // le writer à tout les droit sauf /users ou il a la perm par défault
    if (req.user.permission === "writer") {
        if (req.path === "/users") {
            return res.status(403).json({message: "Vous n'avez pas les droits pour cette action"});
        }
        return next();
    }

    const body = {message: "Vous n'avez pas les droits pour cette action"};
    const path = `/${req.path.split("/")[1]}`;

    switch (path) {
        case '/users':
            if (["GET", "PUT", "DELETE"].includes(req.method) && req.path !== "/users/:id") {
                return res.status(403).json(body);
            }
            break
        case '/livres':
            if (["POST", "PUT", "DELETE"].includes(req.method)) {
                return res.status(403).json(body);
            }
            break
        case '/images':
            if (["POST", "PUT", "DELETE"].includes(req.method)) {
                return res.status(403).json(body);
            }
            break
        case '/armes':
            if (["POST", "PUT", "DELETE"].includes(req.method)) {
                return res.status(403).json(body);
            }
            break
        case '/equipements':
            if (["POST", "PUT", "DELETE"].includes(req.method)) {
                return res.status(403).json(body);
            }
            break
    }

    next();
})

app.use("/users", userRoutes);
app.use("/livres", livreRoutes);
app.use("/personnages", personnageRoutes);
app.use("/images", imageRoutes);
app.use("/aventures", aventureRoutes);
app.use("/levenschtein", levenschteinRoutes);
app.use("/armes", armeRoutes);
app.use("/equipements", equipementRoutes);

module.exports = app;
