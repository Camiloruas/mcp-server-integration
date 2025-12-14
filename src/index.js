import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "MCP Server",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/mcp/tools", (req, res) => {
  res.json({
    server: "mcp-server",
    version: "1.0.0",
    tools: [
      {
        name: "ping",
        description: "Health check tool",
        method: "POST",
        path: "/tools/ping",
      },
    ],
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
