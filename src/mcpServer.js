import express from "express";
import cors from "cors";

import { pingTool } from "./tools/ping.js";
import { callN8nWebhook } from "./tools/callN8nWebhook.js";
import { aiTool } from "./tools/ai.js";

export function createMcpServer() {
  const app = express();

  //  ESSENCIAL
  app.use(cors());
  app.use(express.json());

  // Health
  app.get("/", (req, res) => {
    res.json({
      service: "MCP Server",
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // MCP Tools
  app.get("/tools/ping", pingTool);
  app.post("/tools/n8n", callN8nWebhook);
  app.post("/tools/ai", aiTool);

  return app;
}
