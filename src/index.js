import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MCP Server",
    timestamp: new Date().toISOString(),
  });
});

app.post("/tools/ping", (req, res) => {
  res.json({
    tool: "ping",
    response: "pong",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(` MCP Server running on port ${PORT}`);
});
