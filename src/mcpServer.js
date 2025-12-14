import express from "express";
import { pingTool } from "./tools/ping.js";

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

  return app;
}
