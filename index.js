import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  const body = req.body;
  res.json({ message: "Data received", data: body });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
