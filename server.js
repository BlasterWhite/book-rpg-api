const http = require("http");
require("dotenv").config();
const app = require("./app");

app.set("port", process.env.PORT || 3000);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
