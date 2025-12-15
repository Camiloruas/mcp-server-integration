import express from "express";
import { pingTool } from "./tools/ping.js";
import { n8nTool } from "./tools/n8n.js";
import { aiTool } from "./tools/ai.js";

export function createMcpServer() {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      service: "MCP Server",
      status: "ok",
    });
  });

  app.get("/tools/ping", pingTool);
  app.post("/tools/n8n", n8nTool);
  app.post("/tools/ai", aiTool);

  return app;
}
