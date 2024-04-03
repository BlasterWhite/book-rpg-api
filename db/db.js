const { Sequelize } = require("sequelize");
const env = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

console.log(
  `postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`,
);

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
