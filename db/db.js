const { Sequelize } = require("sequelize");
const env = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
const sequelize = new Sequelize(
  `postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`,
  {
    define: {
      timestamps: false,
    },
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
