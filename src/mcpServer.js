import express from "express";
import { pingTool } from "./tools/ping.js";
import { callN8nWebhook } from "./tools/callN8nWebhook.js";
import { aiTool } from "./tools/ai.js";

export function createMcpServer() {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      service: "MCP Server",
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/tools/ping", pingTool);
  app.post("/tools/n8n", callN8nWebhook);
  app.post("/tools/ai", aiTool);

  return app;
}
