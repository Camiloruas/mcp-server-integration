import express from "express";
import { pingTool } from "./tools/ping.js";
import { n8nTool } from "./tools/n8n.js";
import { callN8nWebhook } from "./tools/callN8nWebhook.js";


export function createMcpServer() {
  const app = express();

  app.use(express.json());

  // Health
  app.get("/", (req, res) => {
    res.json({
      service: "MCP Server",
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  });

  // MCP Tools
  app.get("/tools/ping", pingTool);
  app.post("/tools/n8n", n8nTool);
  app.post("/tools/n8n", callN8nWebhook);


  return app;
}
