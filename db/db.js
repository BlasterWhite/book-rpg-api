const { Sequelize } = require("sequelize");
const env = {
  host: "193.168.146.103",
  port: 5432,
  user: "postgres",
  password: "7tbz4M8pgC5nEn2bkEBkptokV4DmgC",
  database: "postgres",
};
const sequelize = new Sequelize(
  `postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`,
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
