const {Sequelize} = require("sequelize");
const env = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
};

const sequelize = new Sequelize(
    `postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`,
    {
        define: {
            timestamps: false,

        },
        pool: {
            max: 10, // maximum de connexions dans le pool
            min: 0,  // minimum de connexions dans le pool
            acquire: 30000, // temps maximum en ms pour essayer d'acquérir une connexion avant de déclencher une erreur
            idle: 10000 // temps maximum en ms qu'une connexion peut rester inactive avant d'être libérée
        }
    },
);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    });

module.exports = sequelize;
